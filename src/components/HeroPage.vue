<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
    <!-- Header/Navigation -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            alt="AUXO Logo"
            class="h-10 w-10 object-contain"
          />
          <span v-if="!logoUrl" class="text-xl font-bold text-primary">AUXO</span>
        </div>
        
        <!-- Navigation Links -->
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-sm text-black hover:text-foreground transition">Fonctionnalités</a>
          <a href="#about" class="text-sm text-black hover:text-foreground transition">À propos</a>
          <a href="#contact" class="text-sm text-black hover:text-foreground transition">Contact</a>
        </div>

        <!-- CTA Button -->
        <Button variant="default" size="sm">
          Commencer
        </Button>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20 md:py-32">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Contenu Texte -->
        <div class="space-y-6">
          <div ref="titleRef" class="opacity-0">
            <h1 class="text-5xl md:text-6xl text-left font-bold leading-tight text-foreground">
              Bienvenue sur <span class="text-blue-600 bg-clip-text bg-gradient-to-r from-primary to-accent">AUXO</span>
            </h1>
          </div>

          <p ref="descRef" class="text-lg text-left text-muted-foreground max-w-xl opacity-0">
            Votre plateforme interactive pour créer, partager et maîtriser des quiz captivants. 
            Des animations fluides, des interfaces intuitives et une expérience utilisateur exceptionnelle.
          </p>

          <div ref="ctaRef" class="flex gap-4 opacity-0">
            <Button 
              variant="default" 
              size="lg"
              @click="handleStartQuiz"
              class="cursor-pointer"
            >
              Démarrer un Quiz
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              @click="handleLearnMore"
              class="cursor-pointer"
            >
              En savoir plus
            </Button>
          </div>

          <!-- Stats -->
          <div ref="statsRef" class="grid grid-cols-3 gap-4 pt-8 opacity-0">
            <div class="text-center">
              <p class="text-3xl font-bold text-primary">2.5K+</p>
              <p class="text-sm text-muted-foreground">Utilisateurs actifs</p>
            </div>
            <div class="text-center border-l border-r border-border">
              <p class="text-3xl font-bold text-primary">500+</p>
              <p class="text-sm text-muted-foreground">Quiz créés</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold text-primary">95%</p>
              <p class="text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </div>

        <!-- Illustration/Visuels -->
        <div ref="heroImageRef" class="relative h-96 md:h-full opacity-0">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center space-y-4">
              <svg class="w-20 h-20 text-primary mx-auto animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" opacity="0.15" />
                <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.5" opacity="0.25" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" opacity="0.9" />
                <path d="M12 3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />
              </svg>
              <p class="text-2xl font-bold text-foreground">Prêt à apprendre ?</p>
              <p class="text-muted-foreground">Plongez dans une expérience de quiz immersive</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { Button } from './ui/button'

// Références pour animations
const titleRef = ref(null)
const descRef = ref(null)
const ctaRef = ref(null)
const statsRef = ref(null)
const heroImageRef = ref(null)
const featureRefs = ref([])

// URL du logo (à remplacer par le vrai logo)
const logoUrl = ref('')

// Données des features
const features = ref([
  {
    icon: '⚡',
    title: 'Rapide et Réactif',
    description: 'Interface ultra-fluide avec animations GSAP pour une expérience sans accroc'
  },
  {
    icon: '🎨',
    title: 'Design Moderne',
    description: 'Utilisant Tailwind CSS pour un design clean et responsive sur tous les appareils'
  },
  {
    icon: '🔗',
    title: 'Connecté au Backend',
    description: 'Intégration transparente avec votre Spring Boot via Axios pour des données en temps réel'
  }
])

// Animation au montage
onMounted(() => {
  const tl = gsap.timeline()

  // Titre
  tl.to(titleRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    onStart: () => gsap.set(titleRef.value, { y: 30 })
  })

  // Description
  tl.to(descRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
    onStart: () => gsap.set(descRef.value, { y: 20 })
  }, '-=0.4')

  // CTA Buttons
  tl.to(ctaRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
    onStart: () => gsap.set(ctaRef.value, { y: 20 })
  }, '-=0.3')

  // Stats
  tl.to(statsRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    onStart: () => gsap.set(statsRef.value, { y: 10 })
  }, '-=0.2')

  // Hero Image
  tl.to(heroImageRef.value, {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'back.out(1)',
    onStart: () => gsap.set(heroImageRef.value, { scale: 0.9 })
  }, '-=0.5')

  // Features avec stagger
  gsap.to(featureRefs.value, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out',
    delay: 1.2,
    onStart: () => {
      featureRefs.value.forEach(el => {
        if (el) gsap.set(el, { y: 20 })
      })
    }
  })
})

// Handlers
const handleStartQuiz = () => {
  gsap.to([titleRef.value, ctaRef.value], {
    scale: 0.98,
    duration: 0.15,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut',
  })
  console.log('Navigation vers les quiz...')
}

const handleLearnMore = () => {
  const featuresSection = document.getElementById('features')
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// Fonction pour définir le logo depuis l'extérieur
const setLogo = (url) => {
  logoUrl.value = url
}

// Exposer la fonction pour utilisation depuis le parent
defineExpose({ setLogo })
</script>
