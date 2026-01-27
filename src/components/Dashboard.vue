<template>
  <div class="container mx-auto p-8">
    <div class="max-w-4xl mx-auto">
      <!-- En-tête avec animation GSAP -->
      <div class="mb-8">
        <h1 ref="titleRef" class="text-4xl font-bold text-foreground mb-2 opacity-0">
          Bienvenue sur AUXO
        </h1>
        <p ref="subtitleRef" class="text-lg text-muted-foreground opacity-0">
          Votre plateforme de quiz et d'apprentissage
        </p>
      </div>

      <!-- Carte principale du dashboard -->
      <div ref="cardRef" class="bg-card rounded-lg shadow-lg p-6 border border-border opacity-0">
        <h2 class="text-2xl font-semibold mb-4 text-card-foreground">
          Tableau de bord
        </h2>
        
        <div class="space-y-4">
          <!-- Statistiques -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="(stat, index) in stats" 
              :key="index"
              :ref="el => statsRef[index] = el"
              class="bg-secondary p-4 rounded-md opacity-0"
            >
              <p class="text-sm text-muted-foreground">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-secondary-foreground">{{ stat.value }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4 mt-6">
            <Button 
              @click="handleStartQuiz" 
              variant="default"
              size="lg"
            >
              Commencer un Quiz
            </Button>
            <Button 
              @click="handleViewStats" 
              variant="outline"
              size="lg"
            >
              Voir les Statistiques
            </Button>
          </div>

          <!-- Message de test API -->
          <div v-if="apiMessage" class="mt-4 p-4 bg-accent rounded-md">
            <p class="text-sm text-accent-foreground">{{ apiMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { Button } from './ui/button'
import api from '@/services/api.js'

// Références pour les animations GSAP
const titleRef = ref(null)
const subtitleRef = ref(null)
const cardRef = ref(null)
const statsRef = ref([])

// Données du dashboard
const stats = ref([
  { label: 'Quiz complétés', value: '12' },
  { label: 'Score moyen', value: '85%' },
  { label: 'Temps total', value: '3h 45m' },
])

const apiMessage = ref('')

// Animations GSAP au montage du composant
onMounted(() => {
  // Timeline principale pour l'animation d'entrée
  const tl = gsap.timeline()

  // Animation du titre
  tl.to(titleRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    onStart: () => {
      gsap.set(titleRef.value, { y: -20 })
    }
  })

  // Animation du sous-titre
  tl.to(subtitleRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
    onStart: () => {
      gsap.set(subtitleRef.value, { y: -15 })
    }
  }, '-=0.4')

  // Animation de la carte
  tl.to(cardRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'back.out(1.2)',
    onStart: () => {
      gsap.set(cardRef.value, { scale: 0.95 })
    }
  }, '-=0.3')

  // Animation des statistiques (stagger)
  tl.to(statsRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    onStart: () => {
      statsRef.value.forEach(el => {
        if (el) gsap.set(el, { y: 10 })
      })
    }
  }, '-=0.2')

  // Test de l'API au chargement
  testApi()
})

// Fonction pour tester l'API Spring Boot
const testApi = async () => {
  try {
    const response = await api.get('/hello')
    apiMessage.value = `✓ Connexion API réussie: ${response.data}`
  } catch (error) {
    apiMessage.value = '⚠ API Spring Boot non disponible (normal si le backend n\'est pas démarré)'
  }
}

// Handlers avec animations
const handleStartQuiz = () => {
  gsap.to(cardRef.value, {
    scale: 0.98,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut',
  })
  console.log('Démarrage du quiz...')
}

const handleViewStats = () => {
  gsap.to(statsRef.value, {
    scale: 1.05,
    duration: 0.2,
    stagger: 0.05,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut',
  })
  console.log('Affichage des statistiques...')
}
</script>
