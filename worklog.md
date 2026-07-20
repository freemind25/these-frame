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