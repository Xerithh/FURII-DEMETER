<script setup>
import { User } from "lucide-vue-next";

const teamMembers = [
  {
    id: 1,
    name: "Adam Chabani",
    role: "Etudiant FIE3 - Developpement / communication",
    bio: "Etudiant en FIE3, interesse par le developpement informatique et les technologies numeriques. J'aime comprendre le fonctionnement des systemes, resoudre des problemes techniques et participer a des projets collaboratifs.",
    link: "https://www.linkedin.com/in/adam-chabani-08a4b4335/",
    image: "Photo_Chabani_Adam.jpg",
  },
  {
    id: 2,
    name: "Nour Elhouda Khalifi",
    role: "Etudiante FIE3 - Gestion de projet / UX",
    bio: "Etudiante en FIE3, je m'interesse a la gestion de projet, a l'experience utilisateur et aux technologies numeriques appliquees a des projets concrets.",
    link: "https://www.linkedin.com/in/nour-elhouda-khelifi-502252325",
    image: "Photo_Khalifi_Nour_Elhouda.jpeg",
  },
  {
    id: 3,
    name: "Cleo Garcia",
    role: "Etudiant FIE3 - Developpeur, Designer UI/UX",
    bio: "Futur ingenieur en 3eme annee a ISIS et etudiant-entrepreneur, je mobilise mon experience de developpeur junior au profit de projets novateurs.",
    link: "https://cleo-garcia.fr",
    image: "Photo_Garcia_Cleo.jpg",
  },
];

function getImageUrl(filename) {
  if (!filename) return null;

  try {
    return new URL(`../assets/team/${filename}`, import.meta.url).href;
  } catch {
    return null;
  }
}
</script>

<template>
  <section
    id="team"
    class="section-block section-team w-full px-6 py-16 lg:px-10"
    data-reveal
  >
    <div class="section-inner mx-auto w-full max-w-7xl">
      <div class="mb-14 max-w-3xl space-y-5">
        <p
          class="ui-subtitle text-sm uppercase tracking-[0.16em] text-[var(--isis-blue)]"
        >
          Notre equipe
        </p>
        <h2 class="section-title text-3xl sm:text-4xl">
          L'equipe derriere ce projet
        </h2>
        <p class="desc-text text-lg text-slate-600">
          Une equipe multidisciplinaire dediee a l'evaluation adaptative et aux
          recommandations pedagogiques intelligentes.
        </p>
      </div>

      <div class="grid gap-5 md:grid-cols-3" data-stagger>
        <article v-for="member in teamMembers" :key="member.id">
          <a
            :href="member.link"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Lien vers ${member.name}`"
            class="group isis-lift-card flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg"
            data-stagger-item
          >
            <div class="flex flex-1 flex-col gap-4">
              <div
                class="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100"
              >
                <template v-if="member.image">
                  <img
                    :src="getImageUrl(member.image)"
                    :alt="`Photo de ${member.name}`"
                    class="h-full w-full object-cover"
                  />
                </template>
                <template v-else>
                  <component :is="User" class="h-8 w-8 text-slate-400" />
                </template>
              </div>

              <div class="flex flex-1 flex-col text-left">
                <h3 class="card-title mb-1 text-2xl text-slate-900">
                  {{ member.name }}
                </h3>
                <p class="mb-2 text-sm font-semibold text-[var(--isis-blue)]">
                  {{ member.role }}
                </p>
                <p class="desc-text text-sm leading-7 text-slate-600">
                  {{ member.bio }}
                </p>
              </div>
            </div>
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-block {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.section-inner {
  width: 100%;
}

.section-team {
  background: #f8fafc;
  --isis-blue: #1d4ed8;
  font-family: "Fira Sans", "Segoe UI", sans-serif;
}

.ui-subtitle {
  font-family: "Fira Sans", "Segoe UI", sans-serif;
  font-weight: 600;
}

.section-title {
  font-family: "Fira Sans", "Segoe UI", sans-serif;
  font-weight: 600;
  color: #0f172a;
}

.card-title {
  font-family: "Fira Sans", "Segoe UI", sans-serif;
  font-weight: 700;
  color: #0f172a;
}

.desc-text {
  color: #475569;
  font-family: "Mada", "Segoe UI", sans-serif; /* match landing desc-text */
}
</style>
