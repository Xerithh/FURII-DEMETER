<template>
  <div
    class="landing-premium min-h-screen bg-white text-slate-900"
    :class="{ 'landing-motion-enabled': motionReady }"
  >
    <LandingHeader :is-past-hero="isPastHero" />

    <main>
      <LandingHero @discover="scrollToSection('processus')" />
      <LandingProcess :process-steps="processSteps" :bg-words="bgWords" />
      <LandingAccessibility />
      <LandingEtudiantPreview />
      <LandingRecommendations :recommended-modules="recommendedModules" />
      <LandingCompetences />
      <LandingMiddleCta />
      <LandingFaq :faq-items="faqItems" />
      <TeamSection />
      <LandingNewsletter />
      <LandingInitiative />
    </main>

    <LandingFooter :current-year="currentYear" />
  </div>
</template>

<script setup lang="ts">
import LandingAccessibility from "@/components/landing/LandingAccessibility.vue";
import LandingCompetences from "@/components/landing/LandingCompetences.vue";
import LandingEtudiantPreview from "@/components/landing/LandingEtudiantPreview.vue";
import LandingFaq from "@/components/landing/LandingFaq.vue";
import LandingFooter from "@/components/landing/LandingFooter.vue";
import LandingHeader from "@/components/landing/LandingHeader.vue";
import LandingHero from "@/components/landing/LandingHero.vue";
import LandingInitiative from "@/components/landing/LandingInitiative.vue";
import LandingMiddleCta from "@/components/landing/LandingMiddleCta.vue";
import LandingNewsletter from "@/components/landing/LandingNewsletter.vue";
import LandingProcess from "@/components/landing/LandingProcess.vue";
import LandingRecommendations from "@/components/landing/LandingRecommendations.vue";
import TeamSection from "@/components/TeamSection.vue";
import { Activity, Compass, SlidersHorizontal } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";

interface ProcessStep {
  title: string;
  description: string;
  icon: unknown;
}

interface RecommendedModule {
  name: string;
  badge: string;
  rationale: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const LANDING_TITLE = "ISISU - Recommandations de modules boostees par IA";
const LANDING_DESCRIPTION =
  "ISISU analyse le niveau reel de chaque etudiant et recommande les modules les plus utiles, avec des decisions pedagogiques boostees par l intelligence artificielle.";

let previousTitle = "";
let previousDescription = "";

const ensureMetaTag = (
  selector: string,
  attributeName: string,
  attributeValue: string,
): HTMLMetaElement => {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(tag);
  }

  return tag as HTMLMetaElement;
};

const applyLandingSeo = () => {
  previousTitle = document.title;
  document.title = LANDING_TITLE;

  const descriptionTag = ensureMetaTag(
    'meta[name="description"]',
    "name",
    "description",
  );
  previousDescription = descriptionTag.getAttribute("content") ?? "";
  descriptionTag.setAttribute("content", LANDING_DESCRIPTION);

  const ogTitle = ensureMetaTag(
    'meta[property="og:title"]',
    "property",
    "og:title",
  );
  ogTitle.setAttribute("content", LANDING_TITLE);

  const ogDescription = ensureMetaTag(
    'meta[property="og:description"]',
    "property",
    "og:description",
  );
  ogDescription.setAttribute("content", LANDING_DESCRIPTION);

  const twitterTitle = ensureMetaTag(
    'meta[name="twitter:title"]',
    "name",
    "twitter:title",
  );
  twitterTitle.setAttribute("content", LANDING_TITLE);

  const twitterDescription = ensureMetaTag(
    'meta[name="twitter:description"]',
    "name",
    "twitter:description",
  );
  twitterDescription.setAttribute("content", LANDING_DESCRIPTION);
};

const restoreSeo = () => {
  if (previousTitle) {
    document.title = previousTitle;
  }

  const descriptionTag = document.head.querySelector(
    'meta[name="description"]',
  );
  if (descriptionTag && previousDescription) {
    descriptionTag.setAttribute("content", previousDescription);
  }
};

const currentYear = new Date().getFullYear();
const isPastHero = ref(false);
const motionReady = ref(false);

let revealObserver: IntersectionObserver | null = null;
let staggerObserver: IntersectionObserver | null = null;
let scrollRafId = 0;
let onLandingScroll: (() => void) | null = null;

const processSteps: ProcessStep[] = [
  {
    title: "Evaluation du Niveau",
    description:
      "Realisez une evaluation simple pour positionner votre niveau reel de depart.",
    icon: Activity,
  },
  {
    title: "Analyse IA du Profil",
    description:
      "L intelligence artificielle identifie vos acquis, vos lacunes et vos priorites d apprentissage.",
    icon: SlidersHorizontal,
  },
  {
    title: "Modules Recommandes",
    description:
      "Recevez les modules les plus pertinents pour progresser plus vite, au bon niveau.",
    icon: Compass,
  },
];

const bgWords = ["EVALUATION", "ANALYSE", "PARCOURS"];

const recommendedModules: RecommendedModule[] = [
  {
    name: "Bases mathematiques pour l IA",
    badge: "Priorite elevee",
    rationale:
      "Active quand les scores montrent des lacunes sur les prerequis probabilistes et algebriques.",
  },
  {
    name: "Modelisation et methodes numeriques",
    badge: "Priorite moyenne",
    rationale:
      "Propose pour renforcer les capacites de formalisation et de resolution progressive des problemes.",
  },
  {
    name: "Projet applique et transfert de competence",
    badge: "Acceleration",
    rationale:
      "Debloque lorsque la competence est stable afin de passer sur des cas concrets a plus forte valeur.",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "Comment ISISU respecte le RGPD ?",
    answer:
      "Les donnees personnelles sont minimisées, securisees et traitees uniquement pour le suivi pedagogique. Les utilisateurs conservent leurs droits d acces, de rectification et de suppression.",
  },
  {
    question: "Quelle est la fiabilite de la mesure ?",
    answer:
      "L estimation du niveau est consolidee par des analyses IA sur vos reponses et votre progression, afin de fournir des recommandations coherentes, utiles et adaptables dans le temps.",
  },
  {
    question:
      "Pourquoi les recommandations changent-elles apres un nouveau test ?",
    answer:
      "Chaque nouvelle reponse affine l estimation de competence. Les modules recommandes evoluent donc pour rester aligns avec les besoins pedagogiques reels.",
  },
  {
    question: "Comment acceder aux modules recommandes ?",
    answer:
      "Commencez par realiser vos evaluations. Les resultats alimentent ensuite la page Modules suggeres, ou vous pouvez lancer directement les contenus proposes selon votre profil.",
  },
  {
    question:
      "Quelle difference entre modules suggeres et parcours personnalise ?",
    answer:
      "Les modules suggeres sont des recommandations ponctuelles, module par module. Le parcours personnalise organise ces recommandations dans un ordre progressif, avec des objectifs d apprentissage clairs.",
  },
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const updateNavTheme = () => {
  const hero = document.querySelector(".hero-section") as HTMLElement | null;
  if (!hero) {
    isPastHero.value = false;
    return;
  }

  const threshold = hero.clientHeight - 96;
  isPastHero.value = window.scrollY > Math.max(threshold, 0);
};

const applyScrollVisualEffects = () => {
  const focusVisuals = document.querySelectorAll<HTMLElement>(
    "[data-focus-visual]",
  );
  const parallaxLayers =
    document.querySelectorAll<HTMLElement>("[data-parallax]");
  const viewportHeight = window.innerHeight;

  focusVisuals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const progress = Math.min(
      Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0),
      1,
    );
    const scale = 0.95 + progress * 0.05;
    const offsetY = 30 - progress * 30;

    el.style.transform = `translate3d(0, ${offsetY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    el.style.opacity = "1";
  });

  parallaxLayers.forEach((el) => {
    const section = el.closest(".hero-section") as HTMLElement | null;
    const rect = section?.getBoundingClientRect() ?? el.getBoundingClientRect();
    const progress = Math.min(
      Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0),
      1,
    );
    const offset = (0.5 - progress) * 20;

    el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(1.08)`;
  });
};

const requestScrollVisualUpdate = () => {
  if (scrollRafId) {
    return;
  }

  scrollRafId = window.requestAnimationFrame(() => {
    scrollRafId = 0;
    applyScrollVisualEffects();
  });
};

const initRevealAnimations = () => {
  const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal]");

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealTargets.forEach((el) => revealObserver?.observe(el));

  const staggerTargets =
    document.querySelectorAll<HTMLElement>("[data-stagger]");

  staggerObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const container = entry.target as HTMLElement;
        const items = container.querySelectorAll<HTMLElement>(
          "[data-stagger-item]",
        );

        items.forEach((item, index) => {
          item.style.transitionDelay = `${index * 90}ms`;
          item.classList.add("is-revealed");
        });

        observer.unobserve(container);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  staggerTargets.forEach((el) => staggerObserver?.observe(el));
};

onMounted(() => {
  applyLandingSeo();
  updateNavTheme();

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!reducedMotion) {
    motionReady.value = true;
    initRevealAnimations();
    requestScrollVisualUpdate();
  } else {
    document
      .querySelectorAll<HTMLElement>("[data-reveal], [data-stagger-item]")
      .forEach((el) => {
        el.classList.add("is-revealed");
      });
  }

  onLandingScroll = () => {
    updateNavTheme();
    if (!reducedMotion) {
      requestScrollVisualUpdate();
    }
  };

  window.addEventListener("scroll", onLandingScroll, { passive: true });
  window.addEventListener("resize", updateNavTheme);

  if (!reducedMotion) {
    window.addEventListener("resize", requestScrollVisualUpdate);
  }
});

onBeforeUnmount(() => {
  restoreSeo();

  if (onLandingScroll) {
    window.removeEventListener("scroll", onLandingScroll);
  }

  window.removeEventListener("resize", updateNavTheme);
  window.removeEventListener("resize", requestScrollVisualUpdate);

  if (scrollRafId) {
    window.cancelAnimationFrame(scrollRafId);
    scrollRafId = 0;
  }

  revealObserver?.disconnect();
  staggerObserver?.disconnect();
  revealObserver = null;
  staggerObserver = null;
});
</script>

<style scoped>
.landing-premium {
  --isis-blue: #1d4ed8;
  --isis-blue-light: #bfdbfe;
}

.landing-motion-enabled :deep([data-reveal]),
.landing-motion-enabled :deep([data-stagger-item]) {
  opacity: 0;
  transform: translate3d(0, 30px, 0);
  transition:
    opacity 560ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;
}

.landing-motion-enabled :deep([data-reveal].is-revealed),
.landing-motion-enabled :deep([data-stagger-item].is-revealed) {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

:deep([data-focus-visual]),
:deep([data-parallax]) {
  will-change: transform;
  transform-origin: center center;
  backface-visibility: hidden;
}

:deep(.cta-interactive) {
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    background-color 220ms ease,
    border-color 220ms ease;
}

:deep(.cta-interactive:hover) {
  transform: translate3d(0, -2px, 0) scale(1.02);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.16);
}

:deep(.isis-lift-card) {
  transition:
    transform 240ms ease,
    box-shadow 240ms ease,
    border-color 240ms ease;
}

:deep(.isis-lift-card:hover) {
  transform: translate3d(0, -6px, 0);
  border-color: var(--isis-blue);
  box-shadow:
    0 16px 34px rgba(15, 23, 42, 0.12),
    0 2px 8px rgba(29, 78, 216, 0.22);
}

@media (prefers-reduced-motion: reduce) {
  :deep([data-focus-visual]),
  :deep([data-parallax]),
  :deep(.cta-interactive),
  :deep(.isis-lift-card) {
    transition: none !important;
    transform: none !important;
  }
}
</style>
