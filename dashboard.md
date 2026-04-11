# API REFERENCE - DASHBOARD APPRENANT (ISISU)

## 1. Vue d'ensemble du Dashboard
**Endpoint :** `GET /api/v1/dashboard/apprenant`
**Description :** Récupère les indicateurs clés (KPIs) et l'état global du profil étudiant.

**Structure de la réponse (Data) :**
- **utilisateur** : `id` (int), `nom` (string), `prenom` (string), `role` (enum: ETUDIANT_FIE3, etc.)
- **progression** : 
    - `completionPercent` (int) : Pourcentage global de complétion du parcours.
    - `sessionsTerminees` (int) : Nombre total de sessions closes.
    - `questionsRepondues` (int) : Compteur total de questions traitées.
- **scores** :
    - `scoreMoyenGlobal` (double) : Moyenne générale sur l'ensemble des compétences.
    - `scoreDerniereSession` (double) : Résultat obtenu au dernier test.
    - `evolutionScore` (string) : Tendance textuelle ou pourcentage d'évolution.
- **competences** (Array) : 
    - `id`, `nom`, `niveau` (enum: NON_DEMARRE, etc.), `score` (0.0 à 1.0), `lacunes` (string).
- **activiteRecente** (Array) : 
    - `date` (ISO-8601), `type`, `titre`, `resultat`.

---

## 2. Historique des Sessions
**Endpoint :** `GET /api/v1/dashboard/apprenant/sessions`
**Description :** Liste complète et détaillée des sessions passées, incluant les questions et réponses.

**Structure de l'objet Session (Array de Data) :**
- **Metadonnées** : `id`, `dateDebut`, `dateFin`, `statut` (EN_COURS, TERMINEE, ABANDONNEE), `numeroSession`, `timerExpire` (boolean).
- **utilisateur** : Détails complets du profil (INE, Niveau FIE, Promotion, Parcours origine, etc.).
- **questionSessions** (Array) :
    - `id`, `ordre`, `type`, `estRepondue`, `estCorrecte`.
    - **question** : `enonce`, `type` (QCM_SIMPLE/MULTIPLE), `difficulte` (FACILE, MOYEN, DIFFICILE), `competences` liées, `choix` (liste des propositions).
- **reponses** (Array) :
    - `choixSelectionnesJSON` : IDs des choix faits par l'utilisateur.
    - `reponseTexte` : Pour les questions ouvertes.
    - `estCorrecte`, `dureeReactionSecondes`, `dateReponse`.
- **scores** (Array par compétence) :
    - `scoreObtenu`, `statut` (LACUNE, etc.), `niveauAtteint`, `scorePrecedent`, `evolutionPourcentage`.

---

## 3. Détail d'une Session Spécifique
**Endpoint :** `GET /api/v1/dashboard/apprenant/sessions/{sessionId}`
**Description :** Résumé condensé des résultats d'une session précise.

**Structure de la réponse (Data) :**
- `sessionId` (int)
- `dateDebut`, `dateFin`, `statut`
- `scoreGlobal` (double)
- **competences** (Array) :
    - `nom`, `scoreAvant`, `scoreApres`, `evolution` (string).

---

## 4. État des Compétences (Référentiel)
**Endpoint :** `GET /api/v1/dashboard/apprenant/competences`
**Description :** Liste l'état de maîtrise actuel pour chaque compétence du référentiel.

**Structure de la réponse (Array de Data) :**
- `id` (int)
- `nom` (string)
- `niveau` (enum: NON_DEMARRE, EN_PROGRESSION, VALIDE)
- `score` (double : 0.1 = 10%)
- `lacunes` (string) : Texte listant les points de cours non maîtrisés pour cette compétence.

---

## Enums Techniques détectées
- **Roles** : ETUDIANT_FIE3, ADMIN, RESPONSABLE_UE.
- **Statuts Session** : EN_COURS, TERMINEE, ABANDONNEE.
- **Niveau FIE** : FIE1, FIE2, FIE3.
- **Types Questions** : QCM_SIMPLE, QCM_MULTIPLE.
- **Niveaux Compétence** : NON_DEMARRE, EN_PROGRESSION, VALIDE.
