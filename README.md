# AUXO Frontend - Vue.js 3 + Vite

Frontend moderne et performant du projet AUXO, développé avec Vue.js 3, Vite, Tailwind CSS, et des composants UI accessibles.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation

```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install
```

### Lancer le serveur de développement

```bash
npm run dev
```

Le serveur démarre sur **http://localhost:5173** avec :
- ✨ **Hot Module Replacement (HMR)** - Les modifications sont reflétées en temps réel
- 🔗 **Proxy API** - Les appels `/api` sont automatiquement redirigés vers Spring Boot (localhost:8080)
- ⚡ **Build ultra-rapide** - Vite compile le code en millisecondes

### Build de production

```bash
npm run build
```

Génère un build optimisé dans le dossier `dist/`.

### Prévisualiser la build de production

```bash
npm run preview
```

## 📦 Stack technologique

### Core
- **Vue.js 3** (v3.4.21) - Framework JavaScript progressif et réactif
- **Vite** (v7.3.1) - Build tool ultra-rapide avec support ES modules natif

### Styling & UI
- **Tailwind CSS** (v3.4.1) - Framework CSS utility-first pour un design rapide
- **@tailwindcss/postcss** (v4) - Plugin PostCSS pour Tailwind v4
- **PostCSS** (v8.4.35) - Processeur CSS avec support des transformations
- **Autoprefixer** (v10.4.18) - Ajout automatique des préfixes navigateur

### Composants UI
- **radix-vue** (v1.5.1) - Composants UI accessibles et headless basés sur Radix UI
- **clsx** (v2.1.0) - Utilitaire de fusion de classe CSS
- **tailwind-merge** (v2.2.1) - Fusion intelligente des classes Tailwind en cas de conflits

### Animations
- **GSAP** (v3.12.5) - Bibliothèque d'animation professionnelle et haute performance
  - Timeline fluides
  - Animations de propriétés CSS
  - Contrôle granulaire du timing et des easing

### Communication API
- **Axios** (v1.6.7) - Client HTTP pour communiquer avec le backend Spring Boot
  - Intercepteurs intégrés
  - Gestion automatique des erreurs
  - Support des timeouts

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button/
│   │   │   │   ├── Button.vue          # Composant Button réutilisable
│   │   │   │   └── index.js            # Exports du button
│   │   │   └── (autres composants UI)
│   │   ├── HeroPage.vue                # Page d'accueil avec hero section
│   │   ├── Dashboard.vue               # Tableau de bord avec animations
│   │   └── (autres composants)
│   ├── lib/
│   │   └── utils.js                    # Utilitaires (cn pour classes CSS)
│   ├── services/
│   │   └── api.js                      # Configuration Axios et instance API
│   ├── assets/
│   │   ├── Logo-Seul-Couleur-AUXO.png # Logo du projet
│   │   └── vue.svg                     # Logo Vue.js
│   ├── App.vue                         # Composant racine
│   ├── main.js                         # Point d'entrée
│   └── style.css                       # Styles globaux Tailwind
├── index.html                          # HTML d'entrée
├── vite.config.js                      # Configuration Vite
├── tailwind.config.js                  # Configuration Tailwind CSS
├── postcss.config.js                   # Configuration PostCSS
├── package.json                        # Dépendances et scripts
└── README.md                           # Ce fichier
```

## 🏗️ Détails des dossiers

### `src/components/`
Contient tous les composants Vue réutilisables :
- **ui/** - Composants UI low-level (Button, Card, etc.)
- **HeroPage.vue** - Page d'accueil avec section hero, navigation, features
- **Dashboard.vue** - Tableau de bord avec statistiques et animations GSAP

### `src/lib/`
Fonctions utilitaires partagées :
- **utils.js** - Fonction `cn()` pour fusionner les classes Tailwind intelligemment

### `src/services/`
Couche d'abstraction pour la communication API :
- **api.js** - Instance Axios configurée avec proxy et intercepteurs

### `src/assets/`
Ressources statiques (images, icons, logos)

## 🔧 Configuration détaillée

### Vite (vite.config.js)
```javascript
- Alias '@' → './src/' pour imports propres
- Proxy '/api' → 'http://localhost:8080' (Spring Boot)
- Plugin Vue pour support .vue files
- Port de développement : 5173
```

### Tailwind CSS (tailwind.config.js)
```javascript
- Mode dark supporté
- Thème personnalisé avec variables CSS
- Support des couleurs customisées (primary, secondary, accent, etc.)
```

### PostCSS (postcss.config.js)
```javascript
- Plugin Tailwind v4 (@tailwindcss/postcss)
- Autoprefixer pour compatibilité navigateur
```

## 🎨 Design & Styling

### Tailwind CSS
Le projet utilise exclusivement **Tailwind CSS** pour le styling :
- **Utility-first** : Classes prédéfinies pour construction rapide
- **Responsive** : Breakpoints mobiles (mobile-first)
- **Dark mode** : Support natif du mode sombre
- **Configuration centralisée** : Tous les styles dans `tailwind.config.js`

### Couleurs personnalisées
Définies en variables CSS et utilisables via Tailwind :
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--accent` / `--accent-foreground`
- `--destructive` / `--destructive-foreground`
- `--muted` / `--muted-foreground`

## 🎬 Animations avec GSAP

### Utilisation
```javascript
import { gsap } from 'gsap'

// Timeline d'animations
const tl = gsap.timeline()
tl.to(element, { opacity: 1, duration: 0.8 })
  .to(anotherElement, { x: 100 }, '-=0.4') // Overlap
```

### Cas d'usage dans le projet
- **HeroPage.vue** : Animations d'entrée (fade-in, scale, stagger)
- **Dashboard.vue** : Statistiques animées avec stagger
- **Interactions** : Animations au clic des boutons

## 🔗 API & Backend

### Configuration du proxy
Les appels à `/api/**` sont redirigés vers `http://localhost:8080` (Spring Boot).

**Exemple d'utilisation** :
```javascript
import api from '@/services/api.js'

// Appel vers GET /api/quizzes sur Spring Boot
const quizzes = await api.get('/quizzes')

// Appel vers POST /api/quizzes avec données
await api.post('/quizzes', { title: 'Mon Quiz' })
```

### Erreurs API
Les erreurs sont interceptées et loggées globalement via les intercepteurs Axios.

## 📱 Responsive Design

Le projet est **mobile-first** :
- Breakpoints Tailwind par défaut
- Navigation adaptative (masquée sur mobile, visible sur md+)
- Grilles responsives (1 colonne mobile, 2+ colonnes desktop)

## ♿ Accessibilité

- Composants **radix-vue** : Supportent ARIA et clavier natif
- Sémantique HTML correcte
- Contraste de couleurs vérifié
- Support des lecteurs d'écran

## 🔍 Développement

### Scripts disponibles

```bash
# Serveur de développement avec HMR
npm run dev

# Build de production optimisé
npm run build

# Prévisualiser le build de production
npm run preview

# Ajouter/mettre à jour dépendances
npm install <package>
npm update <package>
```

### Débogage
- **Vue DevTools** : Extension Chrome/Firefox pour inspecter les composants
- **Vite DevTools** : Dashboard de performance intégré
- **Console navigateur** : Logs et erreurs

## 🚢 Déploiement

### Variables d'environnement
Créer un fichier `.env` à la racine du frontend :
```env
VITE_API_URL=https://api.production.com
VITE_APP_NAME=AUXO
```

Utiliser dans le code :
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

### Build de production
```bash
npm run build
# Résultat dans ./dist/

# Servir le dossier dist avec un serveur web
# (Nginx, Apache, Vercel, Netlify, etc.)
```

## 📊 Performance

- **Vite** : ~200-300ms de compilation initiale
- **HMR** : Mise à jour en <100ms
- **Bundle size** : ~150KB gzippé (avant optimization)
- **GSAP** : ~40KB gzippé
- **Vue 3** : ~34KB gzippé

## 🐛 Troubleshooting

### Port 5173 déjà utilisé
```bash
npm run dev -- --port 5174
```

### Erreurs de modules manquants
```bash
rm -rf node_modules package-lock.json
npm install
```

### Cache Vite corrompu
```bash
rm -rf node_modules/.vite
npm run dev
```

### Backend Spring Boot non accessible
Vérifier que :
1. Spring Boot s'exécute sur `http://localhost:8080`
2. CORS est configuré pour accepter `localhost:5173`

## 📚 Ressources

- [Documentation Vue.js 3](https://vuejs.org/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/)
- [Documentation GSAP](https://gsap.com/)
- [Documentation Axios](https://axios-http.com/)
- [Documentation Radix UI](https://www.radix-ui.com/)

## 📝 Licence

Voir LICENSE à la racine du projet
