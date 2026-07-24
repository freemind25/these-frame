# ThesisFrame — Suivi de Projet

> **Dernière mise à jour** : Session 7 (contexte restauré)
> **Objectif** : Permettre la reprise rapide en cas de changement de contexte IA

---

## 1. Architecture du projet

### Stack technique
| Couche | Technologie | Version/Note |
|---|---|---|
| Framework | Next.js 16 (App Router) | build: `prisma generate && next build` |
| Langage | TypeScript 5 | strict mode |
| Styling | Tailwind CSS 4 + shadcn/ui | New York style |
| Base de données | Prisma ORM → PostgreSQL | Supabase eu-north-1, pooler port 6543 |
| Auth | NextAuth.js v4 | disponible mais non utilisé pour l'instant |
| State client | React useState | pas de Zustand pour le moment |
| IA | z-ai-web-dev-sdk (backend) | multi-fournisseur coté client |

### Structure des dossiers clés
```
src/
├── app/
│   ├── page.tsx              ← PAGE PRINCIPALE (toute l'UI)
│   ├── layout.tsx            ← Metadata, fonts
│   ├── api/
│   │   ├── directeur/route.ts          ← IA directeur de these
│   │   ├── ai-writing/route.ts         ← IA redaction (10 modes)
│   │   ├── literature-search/route.ts  ← Recherche multi-sources
│   │   ├── thesis/route.ts             ← CRUD these
│   │   ├── thesis/seed/route.ts        ← Seeding 6 chapitres
│   │   ├── thesis/chapters/[id]/route.ts ← PATCH chapitre
│   │   ├── references/route.ts         ← References biblio CRUD
│   │   ├── export-pdf/route.ts         ← Export PDF via Playwright
│   │   └── ...
│   └── globals.css
├── components/
│   ├── ui/                   ← shadcn/ui (Button, Dialog, Tabs, etc.)
│   └── thesis/
│       ├── literature-search.tsx    ← Recherche litterature
│       ├── references-tab.tsx       ← References biblio
│       ├── export-pdf-tab.tsx       ← Export PDF
│       ├── articles-tab.tsx         ← Guide redaction
│       ├── directeur-tab.tsx        ← Directeur (standalone, pas utilise dans page.tsx)
│       └── ...
├── data/
│   ├── chapters-structure.ts   ← 6 chapitres (I-VI) avec metadata
│   ├── directeur-prompt.ts     ← System prompt directeur + helpers
│   ├── methodology-guide.ts
│   └── ...
└── lib/
    ├── db.ts                 ← PrismaClient + hack .env (voir ci-dessous)
    └── utils.ts
prisma/
└── schema.prisma             ← 6 modeles (User, Post, MendeleyConfig, Reference, Thesis, Chapter)
```

---

## 2. Points critiques a connaitre

### 2.1. DATABASE_URL — Hack obligatoire dans `src/lib/db.ts`
Le sandbox definit une variable systeme `DATABASE_URL=file:...custom.db` qui **ecrase** le fichier `.env`.
**Fix** : `db.ts` lit explicitement le fichier `.env` et ne garde que les URLs `postgresql://`.
```typescript
// Dans db.ts — NE PAS SUPPRIMER CE BLOC
import { readFileSync } from 'fs'
import { resolve } from 'path'
try {
  const envPath = resolve(process.cwd(), '.env')
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('DATABASE_URL=')) {
      const val = trimmed.slice('DATABASE_URL='.length)
      if (val.startsWith('postgresql://') || val.startsWith('postgres://')) {
        process.env.DATABASE_URL = val
      }
    }
  }
} catch {}
```

### 2.2. Auto-save — PATCH response
Le PATCH `/api/thesis/chapters/[id]` retourne le chapitre directement (pas `{chapter:...}`).
**Fix** : `const updated = data.chapter || data` dans `handleContentChange`.

### 2.3. Sidebar layout — shrink-0 obligatoire
Les boutons Outils et User dans la sidebar doivent avoir `shrink-0` pour ne pas etre compresses par le `flex-1` de la nav des chapitres.

### 2.4. Supabase PostgreSQL
- **URL** : `postgresql://postgres.moxnabimsszrjrqatnqc:***@aws-0-eu-north-1.pooler.supabase.com:6543/postgres`
- **Pooler** : port 6543 (connection pooling)
- **Tables creees via SQL brut `pg`** (pas `prisma db push` en prod)
- `ensureDb()` est un **no-op** (les tables existent deja)

### 2.5. Vercel deployment
- `serverExternalPackages: ["z-ai-web-dev-sdk", "sharp"]` dans `next.config.ts`
- Pas de `output: "standalone"`
- `vercel.json` : framework nextjs, API maxDuration 30s
- **Variables a ajouter sur le dashboard Vercel** :
  - `DATABASE_URL` (la meme que .env)
  - `ZAI_BASE_URL`, `ZAI_API_KEY`, `ZAI_CHAT_ID`, `ZAI_TOKEN`, `ZAI_USER_ID`

---

## 3. Historique des etapes (sessions)

### Session 1-2 : Nettoyage + Multi-fournisseur IA
- Suppression de toutes les references UC3/IGTU/Constantine 3/Architecture
- Ajout de 7 fournisseurs IA (Z.ai, Mistral, OpenAI, Anthropic, Groq, Ollama, Custom)
- Settings dans localStorage

### Session 3-4 : Deploiement
- Push GitHub via SSH : `git@github.com:freemind25/these-frame.git`
- Force push apres rebase

### Session 5 : Recherche litterature
- Integration 4 APIs academiques (OpenAlex, Crossref, arXiv, PubMed)
- Semantic Scholar desactive par defaut (429 depuis sandbox)
- Composant `LiteratureSearch` dans un Dialog
- Bouton "Recherche litt." dans la sidebar (section Outils)

### Session 6 : Corrections critiques
- Fix DATABASE_URL (hack .env)
- Fix crash auto-save (data.chapter || data)
- Fix bouton "Recherche litt." invisible (shrink-0)

### Session 7 (courante) : Directeur de these — Equilibre des chapitres
- Creation du fichier PROJECT_STATUS.md (ce fichier)
- Ajout de l'analyse d'equilibre des chapitres dans l'onglet Dir.

---

## 4. Fonctionnalites implementees

| # | Feature | Statut | Fichier principal |
|---|---------|--------|-------------------|
| 1 | Editeur de these 6 chapitres | OK | `page.tsx` |
| 2 | Auto-save debounced (2s) | OK | `page.tsx` |
| 3 | Multi-fournisseur IA (7 providers) | OK | `page.tsx` + `api/ai-writing/` |
| 4 | Directeur de these (evaluation chapitre) | OK | `page.tsx` Dir. tab + `api/directeur/` |
| 5 | Guide de redaction | OK | `articles-tab.tsx` |
| 6 | References bibliographiques | OK | `references-tab.tsx` + `api/references/` |
| 7 | Export PDF | OK | `export-pdf-tab.tsx` + `api/export-pdf/` |
| 8 | Recherche litterature scientifique | OK | `literature-search.tsx` + `api/literature-search/` |
| 9 | **Bilan equilibre des chapitres** | OK | `chapter-balance.tsx` + `page.tsx` Dir. tab |
| 10 | **Sauvegarde Google Drive** | OK | `cloud-drive-backup.tsx` + 6 API routes |

---

## 5. Procedural de recovery

Si tout casse ou le contexte est perdu :

1. **Lire** `PROJECT_STATUS.md` (ce fichier) et `worklog.md`
2. **Verifier** que le dev server tourne : `bun run dev &`
3. **Verifier** la DB : `curl -s http://localhost:3000/api/thesis | head -100`
4. **Verifier** le lint : `bun run lint`
5. **Probleme DB** : verifier que `DATABASE_URL` dans `.env` pointe vers Supabase postgresql://
6. **Probleme Vercel** : verifier les variables d'environnement sur le dashboard
7. **Push** : `git add -A && git commit -m "..." && git push origin main`

---

## 6. Taches en attente

- [ ] Ajouter `DATABASE_URL` sur le dashboard Vercel
- [ ] Ajouter les 5 variables ZAI sur Vercel
- [ ] Integration approfondie de l'article apipick.com (agent sans rate limits)
- [ ] Configurer GOOGLE_DRIVE_CLIENT_ID et GOOGLE_DRIVE_CLIENT_SECRET
- [ ] Integrer le composant CloudDriveBackup dans un Dialog sidebar
- [ ] Etendre aux autres fournisseurs (OneDrive, Dropbox)
