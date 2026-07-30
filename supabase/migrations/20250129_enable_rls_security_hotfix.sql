/* ==========================================================================
   SECURITY HOTFIX — Activer Row-Level Security sur toutes les tables
   
   ⚠  Exécuter ce script dans le Supabase SQL Editor :
   https://supabase.com/dashboard → votre projet → SQL Editor
   
   Ce script :
   1. Active RLS sur toutes les 11 tables
   2. Bloque TOUT accès anon/public
   3. Autorise le service_role (Prisma) à tout faire
   4. Protège les données sensibles (tokens, clés API)
   ========================================================================== */

-- ─── 1. Activer RLS sur toutes les tables ───────────────────────────────────

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MendeleyConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Thesis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Chapter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Part" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CloudDriveConnection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ResearchSource" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiToolConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NotebookEntry" ENABLE ROW LEVEL SECURITY;


-- ─── 2. Politiques pour service_role (Prisma backend) ──────────────────────
--    Le service_role bypass RLS par défaut dans Supabase,
--    mais on crée des politiques explicites pour documentation.

CREATE POLICY "service_role_all_on_User"
  ON "User" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_Post"
  ON "Post" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_MendeleyConfig"
  ON "MendeleyConfig" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_Reference"
  ON "Reference" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_Thesis"
  ON "Thesis" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_Chapter"
  ON "Chapter" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_Part"
  ON "Part" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_CloudDriveConnection"
  ON "CloudDriveConnection" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_ResearchSource"
  ON "ResearchSource" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_AiToolConfig"
  ON "AiToolConfig" FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_on_NotebookEntry"
  ON "NotebookEntry" FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ─── 3. Politiques pour anon/public (BLOQUER TOUT) ─────────────────────────

CREATE POLICY "anon_deny_all_on_User"
  ON "User" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_Post"
  ON "Post" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_MendeleyConfig"
  ON "MendeleyConfig" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_Reference"
  ON "Reference" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_Thesis"
  ON "Thesis" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_Chapter"
  ON "Chapter" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_Part"
  ON "Part" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_CloudDriveConnection"
  ON "CloudDriveConnection" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_ResearchSource"
  ON "ResearchSource" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_AiToolConfig"
  ON "AiToolConfig" FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "anon_deny_all_on_NotebookEntry"
  ON "NotebookEntry" FOR ALL TO anon USING (false) WITH CHECK (false);


-- ─── 4. Révoquer les grants publics (double protection) ────────────────────

REVOKE ALL ON "User" FROM anon;
REVOKE ALL ON "Post" FROM anon;
REVOKE ALL ON "MendeleyConfig" FROM anon;
REVOKE ALL ON "Reference" FROM anon;
REVOKE ALL ON "Thesis" FROM anon;
REVOKE ALL ON "Chapter" FROM anon;
REVOKE ALL ON "Part" FROM anon;
REVOKE ALL ON "CloudDriveConnection" FROM anon;
REVOKE ALL ON "ResearchSource" FROM anon;
REVOKE ALL ON "AiToolConfig" FROM anon;
REVOKE ALL ON "NotebookEntry" FROM anon;

GRANT ALL ON "User" TO service_role;
GRANT ALL ON "Post" TO service_role;
GRANT ALL ON "MendeleyConfig" TO service_role;
GRANT ALL ON "Reference" TO service_role;
GRANT ALL ON "Thesis" TO service_role;
GRANT ALL ON "Chapter" TO service_role;
GRANT ALL ON "Part" TO service_role;
GRANT ALL ON "CloudDriveConnection" TO service_role;
GRANT ALL ON "ResearchSource" TO service_role;
GRANT ALL ON "AiToolConfig" TO service_role;
GRANT ALL ON "NotebookEntry" TO service_role;


-- ─── 5. Vérification ────────────────────────────────────────────────────────

SELECT 
  schemaname, 
  tablename, 
  rowsecurity AS rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
