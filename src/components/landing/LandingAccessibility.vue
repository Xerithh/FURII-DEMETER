<template>
  <section
    id="accessibilite"
    class="section-block section-muted px-6 py-16 lg:px-10"
    data-reveal
  >
    <div
      class="section-inner mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2"
    >
      <div class="relative flex justify-start py-10">
        <div class="container nawsome-container">
          <div class="loader" />
          <div class="loader" />
          <div class="loader" />
        </div>
      </div>
      <div class="order-1 space-y-5 lg:order-2">
        <p
          class="ui-subtitle text-sm uppercase tracking-[0.16em] text-[var(--isis-blue)]"
        >
          Multi-plateforme
        </p>
        <h2 class="section-title text-3xl sm:text-4xl">
          Accessible partout, sur tous vos appareils en un clic
        </h2>
        <p class="desc-text text-lg leading-8 text-slate-700">
          Votre analyse et vos recommandations sont disponibles à la demande.
          Commencez sur votre ordinateur, pilotez vos évaluations sur votre
          mobile ou votre tablette sans aucune friction.
        </p>
        <div class="pt-4">
          <a
            href="/login"
            class="cta-interactive inline-flex h-11 items-center rounded-md bg-[var(--isis-blue)] px-6 text-base font-medium text-white shadow-sm transition hover:bg-[#1e40af]"
          >
            Commencer l'évaluation
          </a>
        </div>
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

#accessibilite.section-block {
  min-height: 50vh;
}

.section-inner {
  width: 100%;
}

.section-muted {
  background: #f8fafc;
}

.nawsome-container {
  position: relative;
  width: clamp(348px, 36vw, 468px);
  height: clamp(240px, 24vw, 312px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nawsome-container .loader {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  width: clamp(180px, 24vw, 250px);
  height: clamp(114px, 16vw, 156px);
  margin-left: calc(clamp(180px, 24vw, 250px) / -2);
  margin-top: calc(clamp(114px, 16vw, 156px) / -2);
  border-radius: 5px;
  background: #0f172a;
  animation: dot1_ 3s cubic-bezier(0.55, 0.3, 0.24, 0.99) infinite;
}

.nawsome-container .loader:nth-child(2) {
  z-index: 11;
  width: clamp(168px, 22vw, 234px);
  height: clamp(102px, 14vw, 140px);
  margin-top: calc(clamp(102px, 14vw, 140px) / -2);
  margin-left: calc(clamp(168px, 22vw, 234px) / -2);
  border-radius: 3px;
  background: var(--isis-blue);
  animation-name: dot2_;
}

.nawsome-container .loader:nth-child(3) {
  z-index: 12;
  width: clamp(54px, 7vw, 62px);
  height: clamp(26px, 4vw, 31px);
  margin-top: clamp(60px, 7vw, 78px);
  margin-left: calc(clamp(54px, 7vw, 62px) / -2);
  border-radius: 0 0 5px 5px;
  background: var(--isis-blue-light);
  animation-name: dot3_;
}

@keyframes dot1_ {
  3%,
  97% {
    width: clamp(180px, 24vw, 250px);
    height: clamp(114px, 16vw, 156px);
    margin-top: calc(clamp(114px, 16vw, 156px) / -2);
    margin-left: calc(clamp(180px, 24vw, 250px) / -2);
  }
  30%,
  36% {
    width: clamp(90px, 12vw, 125px);
    height: clamp(132px, 18vw, 187px);
    margin-top: clamp(-94px, -12vw, -94px);
    margin-left: clamp(-62px, -8vw, -62px);
  }
  63%,
  69% {
    width: clamp(48px, 6vw, 62px);
    height: clamp(90px, 12vw, 125px);
    margin-top: clamp(-62px, -8vw, -62px);
    margin-left: clamp(-31px, -4vw, -31px);
  }
}

@keyframes dot2_ {
  3%,
  97% {
    height: clamp(102px, 14vw, 140px);
    width: clamp(168px, 22vw, 234px);
    margin-left: calc(clamp(168px, 22vw, 234px) / -2);
    margin-top: calc(clamp(102px, 14vw, 140px) / -2);
  }
  30%,
  36% {
    width: clamp(78px, 10vw, 109px);
    height: clamp(105px, 14vw, 150px);
    margin-left: calc(clamp(78px, 10vw, 109px) / -2);
    margin-top: calc(clamp(105px, 14vw, 150px) / -2);
  }
  63%,
  69% {
    width: clamp(35px, 5vw, 50px);
    height: clamp(66px, 8vw, 94px);
    margin-left: calc(clamp(35px, 5vw, 50px) / -2);
    margin-top: calc(clamp(66px, 8vw, 94px) / -2);
  }
}

@keyframes dot3_ {
  3%,
  97% {
    height: clamp(26px, 4vw, 31px);
    width: clamp(54px, 7vw, 62px);
    margin-left: calc(clamp(54px, 7vw, 62px) / -2);
    margin-top: clamp(60px, 7vw, 78px);
  }
  30%,
  36% {
    width: clamp(11px, 1vw, 12px);
    height: clamp(11px, 1vw, 12px);
    margin-left: calc(clamp(11px, 1vw, 12px) / -2);
    margin-top: clamp(57px, 7vw, 77px);
    border-radius: 8px;
  }
  63%,
  69% {
    width: clamp(22px, 3vw, 25px);
    height: clamp(6px, 1vw, 7px);
    margin-left: calc(clamp(22px, 3vw, 25px) / -2);
    margin-top: clamp(-57px, -6vw, -57px);
    border-radius: 10px;
  }
}
</style>
