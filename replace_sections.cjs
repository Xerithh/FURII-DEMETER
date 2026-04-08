const fs = require('fs');
const path = require('path');

const file = path.resolve('src/pages/landing.vue');
let content = fs.readFileSync(file, 'utf8');

// Extract sections from existing content
const extractSection = (id) => {
  const regex = new RegExp(`<section id="${id}"[\\s\\S]*?</section>`, 'g');
  const match = content.match(regex);
  return match ? match[0] : '';
};

const processSec = extractSection('processus');
const dashboardSec = extractSection('apercu-dashboard');
const recomSec = extractSection('recommandations');
const faqSec = extractSection('faq');

// NEW section
const middleCta = `      <section id="middle-cta" class="flex flex-col items-center justify-center section-white px-6 py-16 lg:px-10 text-center" style="min-height: 50vh;">
        <div class="mx-auto max-w-3xl space-y-8 text-center">
          <h2 class="text-3xl sm:text-5xl font-bold text-slate-900">Prêt à mesurer votre potentiel ?</h2>
          <p class="text-lg text-slate-600">
            Affinons ensemble vos compétences grâce à un parcours sur-mesure.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="/login" class="shadcn-btn-default inline-flex h-11 items-center justify-center rounded-md px-8 text-base font-medium w-full sm:w-auto">
              Lancer son analyse
            </a>
            <a href="/login" class="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-transparent px-8 text-base font-medium text-slate-900 transition-colors hover:bg-slate-100 w-full sm:w-auto">
              Se connecter
            </a>
          </div>
        </div>
      </section>`;

// Target replace block: from <section id="recommandations" up to <TeamSection />
const startMarker = '<section id="recommandations"';
const endMarker = '<TeamSection />';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  // Let's alternate them:
  // Hero (dark)
  // Process (white)
  // Dashboard (muted)
  // Middle CTA (white)
  // Recommandation (muted)
  // FAQ (white)
  
  const processWhite = processSec;
  const recomMuted = recomSec;

  const newBlock = `${processWhite}\n\n${dashboardSec}\n\n${middleCta}\n\n${recomMuted}\n\n${faqSec}\n\n      `;
  
  content = content.substring(0, startIndex) + newBlock + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log('Successfully reordered sections!');
} else {
  console.log('Could not find markers');
}
