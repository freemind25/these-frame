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