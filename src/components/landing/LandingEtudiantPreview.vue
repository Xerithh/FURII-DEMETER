<script setup lang="ts">
import Card from "@/components/ui/card/Card.vue";
</script>

<template>
  <section
    id="apercu-etudiant"
    class="section-block section-white px-6 py-16 lg:px-10"
    data-reveal
  >
    <div class="section-inner mx-auto w-full max-w-7xl">
      <div class="mb-10 max-w-3xl space-y-5">
        <p
          class="ui-subtitle text-sm uppercase tracking-[0.16em] text-[var(--isis-blue)]"
        >
          Vue d ensemble
        </p>
        <h2 class="section-title text-3xl sm:text-4xl">
          Apercu etudiant ISISU
        </h2>
        <p class="desc-text text-lg text-slate-600">
          L espace etudiant met en avant votre niveau reel, les priorites d
          apprentissage et les modules recommandes, avec des insights IA
          directement exploitables pour la decision pedagogique.
        </p>
      </div>

      <Card class="overflow-hidden isis-lift-card border border-slate-200">
        <div class="border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span class="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span class="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span class="ml-3 text-xs text-slate-500">isisu-etudiant</span>
          </div>
        </div>

        <div
          class="etudiant-preview-container relative m-0 flex w-full items-center justify-center bg-slate-100 p-0"
        >
          <img
            src="/images/etudiant-preview.png"
            alt="Aperçu etudiant"
            class="etudiant-preview-img opacity-0 transition-opacity duration-300"
            data-focus-visual
            onload="this.classList.remove('opacity-0')"
            onerror="
              this.onerror = null;
              this.parentElement.innerHTML =
                '<span class=\'text-slate-400 font-medium\'>Espace Réservé (Mettre votre screenshot ici)</span>';
            "
          />
        </div>
      </Card>
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

.section-white {
  background: #fff;
}

.etudiant-preview-container {
  padding: 0;
  margin: 0;
  display: block;
  width: 100%;
  min-height: 180px;
}

.etudiant-preview-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: none;
  object-fit: contain;
}
</style>
