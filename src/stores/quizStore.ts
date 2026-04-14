import api from '@/services/api'
import { dashboardService } from '@/services/dashboardService'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AnswerResponseDTO, QuestionDisplayDTO, SessionResultsDTO } from '@/types/quiz'

export const useQuizStore = defineStore('quiz', () => {
  const QUIZ_SESSION_LOCK_KEY = 'quiz-session-active'

  const sessionActive = ref(false)
  const currentQuestion = ref<QuestionDisplayDTO | null>(null)
  
  const tempsRestantSecondes = ref(0)
  const pourcentageAvancement = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const sessionTerminated = ref(false)
  const results = ref<SessionResultsDTO | null>(null)
  const answerFeedback = ref<AnswerResponseDTO | null>(null)
  const currentSessionId = ref<number | null>(null)

  let timerInterval: ReturnType<typeof setInterval> | null = null

  const setSessionLock = (active: boolean) => {
    try {
      localStorage.setItem(QUIZ_SESSION_LOCK_KEY, active ? '1' : '0')
    } catch {
      // ignore storage access errors
    }
  }

  const extractProgress = (source: any): number | null => {
    if (!source || typeof source !== 'object') return null

    const candidates = [
      source.pourcentageAvancement,
      source.progression,
      source.progress,
      source.progressPercent,
      source.percentage,
      source.avancement,
    ]

    const value = candidates.find(v => typeof v === 'number')
    return typeof value === 'number' && Number.isFinite(value) ? value : null
  }

  const extractSessionId = (source: any): number | null => {
    if (!source || typeof source !== 'object') return null

    const candidates = [
      source.sessionId,
      source.id,
      source.evaluationSessionId,
      source.quizSessionId,
      source.session?.id,
      source.session?.sessionId,
      source.data?.sessionId,
      source.data?.id,
    ]

    const value = candidates.find(v => typeof v === 'number' && Number.isFinite(v))
    return typeof value === 'number' ? value : null
  }

  const updateCurrentSessionId = (source: any) => {
    const maybeSessionId = extractSessionId(source)
    if (maybeSessionId !== null) {
      currentSessionId.value = maybeSessionId
    }
  }

  const mapSessionDetailsToResults = (sessionDetails: any): SessionResultsDTO => {
    const score = typeof sessionDetails?.scoreGlobal === 'number' ? sessionDetails.scoreGlobal : 0

    const competenceEvolution = (sessionDetails?.competences || []).reduce((acc: Record<string, number>, competence: any) => {
      const name = competence?.nom || 'Compétence'
      const rawEvolution = competence?.evolution
      let value = 0

      if (typeof rawEvolution === 'number' && Number.isFinite(rawEvolution)) {
        value = rawEvolution
      } else if (typeof rawEvolution === 'string') {
        const parsed = Number.parseFloat(rawEvolution.replace(',', '.').replace('%', '').trim())
        value = Number.isFinite(parsed) ? parsed : 0
      }

      acc[name] = value
      return acc
    }, {})

    return {
      sessionId: sessionDetails?.sessionId,
      score,
      message: 'Évaluation terminée.',
      competenceEvolution,
    }
  }

  const fetchFinalResultsFromDashboard = async (sessionId: number) => {
    try {
      const sessionDetails = await dashboardService.getSessionDetails(sessionId)
      return mapSessionDetailsToResults(sessionDetails)
    } catch {
      return null
    }
  }

  const resolveCurrentSessionIdForResults = async (endPayload: any): Promise<number | null> => {
    const direct = extractSessionId(endPayload)
    if (direct !== null) return direct
    if (currentSessionId.value !== null) return currentSessionId.value

    try {
      const current = await api.get('/api/v1/eval/sessions/current')
      const fromCurrent = extractSessionId(current.data)
      if (fromCurrent !== null) return fromCurrent
    } catch {
      // ignore
    }

    try {
      const sessions = await dashboardService.getSessions()
      if (Array.isArray(sessions) && sessions.length > 0) {
        const [latest] = [...sessions].sort((a: any, b: any) => {
          const dateA = new Date(a?.dateFin || a?.dateDebut || 0).getTime()
          const dateB = new Date(b?.dateFin || b?.dateDebut || 0).getTime()
          return dateB - dateA
        })
        return typeof latest?.id === 'number' ? latest.id : null
      }
    } catch {
      // ignore
    }

    return null
  }

  // Helper to start the timer
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      if (tempsRestantSecondes.value > 0) {
        tempsRestantSecondes.value--
      } else {
        stopTimer()
        terminateSession() // Auto terminate on zero
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  // Restore current session if active
  const checkCurrentSession = async (): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.get('/api/v1/eval/sessions/current')
      // Assuming 200 means active session, 204 or 404 means no active session
      if (response.status === 200 && response.data) {
        sessionActive.value = true
        setSessionLock(true)
        updateCurrentSessionId(response.data)
        tempsRestantSecondes.value = response.data.tempsRestantSecondes || 3600
        pourcentageAvancement.value = response.data.pourcentageAvancement || 0
        startTimer()
        await fetchNextQuestion()
        // fetchNextQuestion can terminate the session (204), so return real state.
        return sessionActive.value
      }
      setSessionLock(false)
      return false
    } catch (err: any) {
      // If 404, it means no current session found (based on typical REST API)
      if (err.response?.status !== 404) {
        error.value = "Erreur lors de la vérification de la session active."
      }
      if (err.response?.status === 404) {
        setSessionLock(false)
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const startSession = async () => {
    try {
      isLoading.value = true
      error.value = null
      sessionTerminated.value = false
      answerFeedback.value = null
      results.value = null
      currentQuestion.value = null
      pourcentageAvancement.value = 0

      const hasActiveSession = await checkCurrentSession()
      if (hasActiveSession) {
        return
      }

      // Start endpoints must not call recommendation APIs.
      // Call the main session creation endpoint.
      const startEndpoints = [
        '/api/v1/eval/sessions'
      ]

      let sessionStarted = false
      for (const endpoint of startEndpoints) {
        try {
          const response = await api.post(endpoint)
          sessionStarted = true
          sessionActive.value = true
          setSessionLock(true)
          updateCurrentSessionId(response.data)
          tempsRestantSecondes.value = response.data?.tempsRestantSecondes || 3600
          startTimer()
          await fetchNextQuestion()
          break
        } catch (startError: any) {
          const status = startError?.response?.status
          // Log full error payload to help diagnose 404 / 500 returned by the API
          // (kept minimal and non-sensitive - body may include error message from backend)
          // eslint-disable-next-line no-console
          console.warn(`[quizStore.startSession] endpoint failed: ${endpoint} status=${status}`, startError?.response?.data ?? startError?.message ?? startError)
          if (![404, 405].includes(status)) {
            // unexpected error (500 etc.) — rethrow so caller can show a toast
            throw startError
          }
        }
      }

      if (!sessionStarted) {
        throw new Error('Impossible de démarrer une nouvelle session d\'évaluation.')
      }
    } catch (err: any) {
      // Provide more context in the store error for UI and log details for debugging
      // eslint-disable-next-line no-console
      console.error('[quizStore.startSession] fatal error while starting session', err?.response?.status, err?.response?.data ?? err?.message ?? err)
      error.value = err?.response?.status
        ? `Erreur ${err.response.status} lors du démarrage de la session.`
        : 'Erreur lors du démarrage de la session.'
      sessionActive.value = false
      sessionTerminated.value = false
      currentQuestion.value = null
      setSessionLock(false)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchNextQuestion = async () => {
    try {
      isLoading.value = true
      error.value = null
      answerFeedback.value = null // reset feedback
      const response = await api.get('/api/v1/eval/sessions/current/question')
      
      if (response.status === 204 || (!response.data || !response.data.questionId)) {
        // No more questions -> end of session
        await handleSessionEnd(null)
      } else {
        const payload = response.data
        updateCurrentSessionId(payload)
        currentQuestion.value = {
          questionId: payload.questionId,
          questionSessionId: payload.questionSessionId,
          type: payload.type,
          questionText: payload.enonce,
          choices: payload.choix ? payload.choix.map((c: any) => ({
            id: c.id,
            text: c.texte || c.contenu || c.libelle || c.intitule || c.reponse || "Choix",
            ordre: c.ordre,
            cote: c.cote || c.side || c.colonne || c.type
          })) : null
        } as QuestionDisplayDTO
        
        // Also update advancement if given in headers/response
        if (payload.pourcentageAvancement !== undefined) {
          pourcentageAvancement.value = payload.pourcentageAvancement
        }
      }
    } catch (err: any) {
      error.value = "Erreur de chargement de la question."
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const submitAnswer = async (payload: any) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await api.post('/api/v1/eval/sessions/current/answer', payload)
      updateCurrentSessionId(response.data)
      
      answerFeedback.value = response.data as AnswerResponseDTO

      // Keep progress bar in sync right after each answer.
      const answerProgress = extractProgress(response.data)
      if (answerProgress !== null) {
        pourcentageAvancement.value = answerProgress
      } else {
        try {
          const currentSession = await api.get('/api/v1/eval/sessions/current')
          const sessionProgress = extractProgress(currentSession.data)
          if (sessionProgress !== null) {
            pourcentageAvancement.value = sessionProgress
          }
        } catch {
          // non-blocking: do not fail answer submission if progress refresh fails
        }
      }
      
      // We will let the UI handle the slight delay to show the feedback
      // then the UI can call fetchNextQuestion.
      return answerFeedback.value
    } catch (err: any) {
      error.value = "Erreur lors de la soumission de la réponse."
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const terminateSession = async () => {
    try {
      isLoading.value = true
      stopTimer()
      try {
        const response = await api.post('/api/v1/eval/sessions/current/terminate')
        updateCurrentSessionId(response.data)
        await handleSessionEnd(response.data)
      } catch (terminateErr: any) {
        // Si la requête POST échoue, on essaie quand même de charger les résultats
        console.warn('[quizStore.terminateSession] POST failed, attempting to fetch results anyway', terminateErr?.response?.status)
        error.value = "Erreur lors de l'arrêt de la session, tentative de récupération des résultats..."
        // Essayer de charger les résultats malgré l'erreur à la termination
        await handleSessionEnd(null)
      }
    } finally {
      isLoading.value = false
    }
  }

  const handleSessionEnd = async (data: any) => {
    sessionActive.value = false
    setSessionLock(false)
    currentQuestion.value = null
    stopTimer()

    try {
      // Prefer dashboard session details (source of truth for scoreGlobal).
      const sessionId = await resolveCurrentSessionIdForResults(data)
      if (sessionId !== null) {
        currentSessionId.value = sessionId
        const dashboardResults = await fetchFinalResultsFromDashboard(sessionId)
        if (dashboardResults) {
          results.value = dashboardResults
          sessionTerminated.value = true
          return
        }
      }

      if (data && typeof data === 'object') {
        const fallbackScore = typeof data.score === 'number' ? data.score : 0
        results.value = {
          ...data,
          sessionId: currentSessionId.value || undefined,
          score: fallbackScore,
        }
        sessionTerminated.value = true
        return
      }

      // Final fallback if backend returns no immediate payload.
      try {
        const res = await api.get('/api/v1/eval/sessions/current/results')
        const payload = res.data?.data ?? res.data
        results.value = {
          sessionId: currentSessionId.value || undefined,
          score: typeof payload?.score === 'number' ? payload.score : 0,
          maxScore: payload?.maxScore,
          competenceEvolution: payload?.competenceEvolution,
          message: payload?.message || 'Fin de test',
        }
      } catch (e) {
        console.error('Unable to load results from /results endpoint', e)
        results.value = { sessionId: currentSessionId.value || undefined, score: 0, message: 'Fin de test' }
      }
    } catch (err) {
      // Final safety net - ensure results is never null
      console.error('[quizStore.handleSessionEnd] Unexpected error', err)
      results.value = { sessionId: currentSessionId.value || undefined, score: 0, message: 'Fin de test' }
    }

    // ALWAYS set sessionTerminated to true to trigger redirect
    sessionTerminated.value = true
  }

  const resetQuizState = () => {
    stopTimer()
    sessionActive.value = false
    sessionTerminated.value = false
    currentQuestion.value = null
    answerFeedback.value = null
    results.value = null
    error.value = null
    isLoading.value = false
    tempsRestantSecondes.value = 0
    pourcentageAvancement.value = 0
    currentSessionId.value = null
    setSessionLock(false)
  }

  return {
    sessionActive,
    currentQuestion,
    tempsRestantSecondes,
    pourcentageAvancement,
    isLoading,
    error,
    sessionTerminated,
    results,
    answerFeedback,
    currentSessionId,
    checkCurrentSession,
    startSession,
    fetchNextQuestion,
    submitAnswer,
    terminateSession,
    resetQuizState,
  }
})
