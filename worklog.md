---
Task ID: 1
Agent: main
Task: Integrate Mendeley API for bibliographic reference management into ThesisFrame

Work Log:
- Read and analyzed Mendeley API documentation from https://dev.mendeley.com/methods/#introduction
- Identified key endpoints: Documents, BibTeX export, Folders, Catalog Search, OAuth 2.0 auth
- Updated Prisma schema with MendeleyConfig and Reference models
- Created 7 API routes: mendeley/auth, mendeley/callback, mendeley/documents, mendeley/search, mendeley/disconnect, references (CRUD), references/bibtex, references/import-bibtex
- Built complete ReferencesTab frontend with: Mendeley connection panel (OAuth + manual token), Mendeley document browser with selection, local reference manager with search/filter, add reference dialog, BibTeX export, copy-to-clipboard per reference
- Fixed React lint error: renamed `ref` prop to `item` (reserved name in React)
- Fixed set-state-in-effect lint warnings with proper useEffect patterns
- Verified all API endpoints work correctly (POST, GET, DELETE, BibTeX export)

Stage Summary:
- Mendeley OAuth 2.0 flow integrated with client_id/secret configuration
- Manual access token fallback for sandbox/development use
- Full CRUD for local references stored in SQLite via Prisma
- BibTeX export generates valid .bib file compatible with the LaTeX template
- Mendeley document import with deduplication via mendeleyId
- New "Références biblio." tab added to the main navigation (3 tabs total)
- All API routes tested and working

---
Task ID: 2
Agent: fullstack-dev
Task: Add MethodologyTab to page.tsx

Work Log:
- Added `Database` and `HelpCircle` icon imports from lucide-react (alphabetically placed)
- Added import block for 17 named exports from `@/data/methodology-guide` after the articles-guide import
- Added full `MethodologyTab` component (~510 lines) before the `export default function Home()` line, with 4 sub-tabs: Démarche, Problématique, Outils de collecte, Documentation
- Updated main `TabsList` from `grid-cols-3` to `grid-cols-4`, prepending a new "Méthodologie" trigger with FlaskConical icon
- Added `<TabsContent value="methodology"><MethodologyTab /></TabsContent>` before existing tab contents
- Ran `bun run lint` — passed with zero errors

Stage Summary:
- Main tab navigation expanded from 3 to 4 tabs (Méthodologie, Articles, Références, Thèse)
- MethodologyTab renders nested tabs with research cycle, research types, induction/deduction, disciplinarities, problématique guide, operationalisation, hypotheses, introduction structure, titre conseils, collect tools, document types, databases, catalogs, and web resources
- No breaking changes — all existing functionality preserved
- Lint passes cleanly

---
Task ID: 3
Agent: main
Task: Integrate AI writing assistant tool into ThesisFrame (inspired by K-Dense scientific-agent-skills)

Work Log:
- Analyzed GitHub repo k-dense-ai/scientific-agent-skills (148 scientific agent skills for AI coding agents)
- Identified that the repo provides SKILL.md definitions for Claude Code/Cursor agents — not directly integrable as web service
- Extracted key concepts from 4 relevant skills: scientific-writing, literature-review, peer-review, hypothesis-generation
- Designed 6 AI writing modes for ThesisFrame using z-ai-web-dev-sdk LLM (free, built-in):
  1. Rédaction scientifique (IMRaD structure, academic prose)
  2. Revue de littérature (synthesis, research gaps, thematic organization)
  3. Relecture critique (peer review, methodology assessment, constructive feedback)
  4. Paraphrase & Amélioration (reformulation, vocabulary enrichment, style correction)
  5. Résumé & Abstract (structured summaries, keywords, bilingual abstracts)
  6. Génération d'hypothèses (testable hypotheses, variable identification, predictions)
- Created `/api/ai-writing/route.ts` with POST (chat with mode-specific system prompts, session-based conversation history, auto history trimming) and DELETE (clear conversation)
- Built `AIWritingTab` component with: 6-mode selector cards with color coding, chat interface with user/assistant message bubbles, loading spinner, copy-to-clipboard per response, clear conversation, error handling, Enter-to-send, disclaimer text
- Fixed TypeScript errors: `BookSearch` and `FileSummarize` icons don't exist in lucide-react → replaced with `BookOpenText` and `ScrollText`
- Fixed duplicate `Lightbulb` import (alias conflict) → used single import
- Updated main tab navigation from grid-cols-4 to grid-cols-5, added "Assistant IA" tab as first item
- Verified via curl: API returns 200 with AI-generated academic French text
- Verified via Agent Browser: tab renders correctly, all 6 modes visible, chat sends/receives messages, mode switching works, other tabs unaffected, mobile responsive with abbreviated labels

Stage Summary:
- New "Assistant IA" tab (first in navigation) with AI writing assistant
- 6 specialized modes with distinct system prompts inspired by K-Dense Scientific Agent Skills
- Free AI powered by z-ai-web-dev-sdk (no external API keys needed)
- Multi-turn conversation support with session management
- Fully responsive: 5-col grid on desktop, abbreviated labels on mobile
- Lint passes cleanly, TypeScript compiles successfully