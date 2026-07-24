# ThesisFrame — Version Desktop Windows (Tauri)

## 🎯 Objectif

ThesisFrame peut être installé comme une application Windows classique grâce à [Tauri v2](https://tauri.app/). L'application s'exécute dans une fenêtre native avec WebView2, tout en conservant toutes les fonctionnalités web (API routes, Prisma, IA).

## 🤖 Build automatique via GitHub Actions (.exe sans machine Windows)

Vous n'avez **pas besoin** d'une machine Windows pour obtenir le `.exe`. Le pipeline CI/CD le construit automatiquement.

### Méthode rapide — Déclenchement manuel

1. Allez sur votre repo GitHub → **Actions** → **Build Windows .exe (Tauri v2)**
2. Cliquez **Run workflow**
3. (Optionnel) Entrez un tag de release (ex: `v0.2.1`)
4. Attendez ~10-15 minutes
5. Téléchargez l'artifact **ThesisFrame-Setup** → `*.exe`

### Méthode automatique — Via un tag Git

```bash
git tag v0.2.1
git push origin v0.2.1
```

Le build se lance automatiquement et crée une **GitHub Release** avec le `.exe` attaché.

### Secrets GitHub requis

Aucun secret n'est requis pour le build. Le workflow utilise le `GITHUB_TOKEN` intégré.

## 🖥️ Build local (sur votre machine Windows)

### Prérequis

| Outil | Version | Lien |
|-------|---------|------|
| Node.js | 20+ | https://nodejs.org |
| Bun (optionnel) | 1.x | https://bun.sh |
| Rust | stable | https://rustup.rs |
| WebView2 | préinstallé | Win10/11 inclus |
| Visual Studio Build Tools | 2022 | [vs_buildtools.exe](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (cocher « C++ build tools ») |

### Développement (avec hot-reload)

```bash
# Depuis la racine du projet
bun run tauri:dev
```

Cela lance simultanément :
1. Le serveur Next.js dev (port 3000)
2. La fenêtre Tauri qui se connecte à `http://localhost:3000`

### Build de production (installateur .exe)

**Option A : Script automatisé**
```bash
# Double-cliquer sur scripts/build-windows.bat
# Ou depuis CMD :
scripts\build-windows.bat
```

**Option B : Manuel**
```bash
bun install
bun run db:generate
bun run build          # Génère .next/standalone/
npx tauri build       # Compile Rust + crée l'installateur NSIS
```

Le fichier `.exe` sera dans :
```
src-tauri/target/release/bundle/nsis/ThesisFrame_0.2.0_x64-setup.exe
```

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│              Tauri (Rust)                     │
│  ┌────────────────────────────────────────┐  │
│  │         WebView2 (Edge Chromium)       │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │     Next.js (port 3000)          │  │  │
│  │  │  ┌────────────┐ ┌────────────┐  │  │  │
│  │  │  │ Frontend   │ │ API Routes │  │  │  │
│  │  │  │ React      │ │ /api/*     │  │  │  │
│  │  │  └────────────┘ └────────────┘  │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Tauri Commands (Rust)                 │  │
│  │  - get_app_version()                   │  │
│  │  - get_documents_dir()                 │  │
│  │  - get_desktop_dir()                   │  │
│  │  - is_desktop()                        │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Pourquoi un serveur Next.js ?

ThesisFrame utilise de nombreuses **API routes** côté serveur :
- `/api/thesis` — CRUD pour les thèses
- `/api/ai-writing` — Génération IA
- `/api/literature-search` — Recherche multi-sources
- `/api/journal-finder` — Trouver des journaux OA
- `/api/references/verify` — Vérification des citations
- `/api/export-pdf` — Génération PDF
- `/api/cloud-drive/*` — Sauvegarde Google Drive

Ces routes nécessitent Node.js + Prisma + le SDK IA. L'approche **Next.js standalone + Tauri** permet de tout faire fonctionner sans modification du code backend.

## 📁 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `src-tauri/tauri.conf.json` | Config Tauri (fenêtre, CSP, bundle) |
| `src-tauri/Cargo.toml` | Dépendances Rust |
| `src-tauri/src/lib.rs` | Commandes Tauri (version, chemins) |
| `src-tauri/capabilities/default.json` | Permissions Tauri v2 |
| `src-tauri/icons/` | Icônes pour toutes plateformes |
| `scripts/start-server.js` | Lanceur du serveur Next.js |
| `scripts/build-windows.bat` | Script de build complet |
| `scripts/launch-desktop.bat` | Lanceur pour l'utilisateur final |
| `src/lib/tauri.ts` | Utilitaires frontend (détection desktop) |

## 🔧 Commandes Tauri disponibles (depuis le frontend)

```typescript
import { isDesktop, getAppVersion, getDocumentsDir } from '@/lib/tauri'

// Détecter si on est dans l'app desktop
if (isDesktop()) { /* mode desktop */ }

// Obtenir la version depuis Rust
const version = await getAppVersion() // "0.2.0"

// Obtenir le dossier Documents
const docsDir = await getDocumentsDir() // "C:\Users\...\Documents"
```

## 🔒 Sécurité (CSP)

La politique de sécurité (Content Security Policy) autorise les connexions vers :
- APIs académiques : OpenAlex, DOAJ, Crossref, Semantic Scholar, arXiv, PubMed, HAL
- Fournisseurs IA : OpenAI, Mistral, Anthropic, Groq, Google Gemini
- Google OAuth (Drive)
- `http://localhost:*` (serveur local)

## 🌍 Langues de l'installateur

L'installateur NSIS supporte : Français, English, العربية

## ⚡ Performance

- Le build Rust utilise LTO + strip + codegen-units=1 pour un binaire optimisé
- Le serveur Next.js standalone est minimal (pas de node_modules complet)
- WebView2 est préinstallé sur Windows 10/11 (pas de bundle Chromium nécessaire)
- Taille estimée de l'installateur : ~15-25 MB
