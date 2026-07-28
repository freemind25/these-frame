'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, X, ChevronDown, Sparkles, BookOpen, Download, Search, Scale, Cloud, Newspaper, PenLine, SpellCheck, ShieldCheck, PenTool, Library, ToggleLeft, Menu, Layers, LayoutTemplate, Plus, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// ─── CHAPTERS DATA (same as real app) ────────────────────
const CHAPTERS_DEMO = [
  { num: 'I', title: 'Introduction générale', shortTitle: 'Introduction', color: 'emerald', icon: 'FileText', words: 1240, status: 'in_progress' },
  { num: 'II', title: 'Données bibliographiques et cadre théorique', shortTitle: 'Bibliographie', color: 'sky', icon: 'BookOpen', words: 4320, status: 'revised' },
  { num: 'III', title: 'Cadre méthodologique', shortTitle: 'Méthodologie', color: 'amber', icon: 'FlaskConical', words: 2810, status: 'in_progress' },
  { num: 'IV', title: 'Résultats', shortTitle: 'Résultats', color: 'violet', icon: 'BarChart3', words: 0, status: 'draft' },
  { num: 'V', title: 'Discussion', shortTitle: 'Discussion', color: 'rose', icon: 'MessageSquare', words: 0, status: 'draft' },
  { num: 'VI', title: 'Conclusion générale', shortTitle: 'Conclusion', color: 'teal', icon: 'GraduationCap', words: 0, status: 'draft' },
]

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-400', in_progress: 'bg-amber-400', submitted: 'bg-sky-400', revised: 'bg-emerald-400',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'brouillon', in_progress: 'en cours', submitted: 'soumis', revised: 'révisé',
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; light: string; activeBg: string; activeText: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-300', light: 'bg-emerald-50', activeBg: 'bg-emerald-600', activeText: 'text-white' },
  sky:     { bg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-300', light: 'bg-sky-50', activeBg: 'bg-sky-600', activeText: 'text-white' },
  amber:   { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-300', light: 'bg-amber-50', activeBg: 'bg-amber-600', activeText: 'text-white' },
  violet:  { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-300', light: 'bg-violet-50', activeBg: 'bg-violet-600', activeText: 'text-white' },
  rose:    { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-300', light: 'bg-rose-50', activeBg: 'bg-rose-600', activeText: 'text-white' },
  teal:    { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-300', light: 'bg-teal-50', activeBg: 'bg-teal-600', activeText: 'text-white' },
}

const TOOLS = [
  { icon: Library, label: 'Références biblio.' },
  { icon: BookOpen, label: 'Guide rédaction' },
  { icon: Download, label: 'Export PDF' },
  { icon: Search, label: 'Recherche litt.' },
  { icon: Scale, label: 'Équilibre chapitres' },
  { icon: Cloud, label: 'Sauvegarde cloud' },
  { icon: Newspaper, label: 'Journaux OA' },
  { icon: PenLine, label: 'Diagrammes' },
  { icon: SpellCheck, label: 'Grammaire (LT)' },
  { icon: ShieldCheck, label: 'Harper (style)' },
  { icon: PenTool, label: 'Recherche thèse' },
]

// ═══════════════════════════════════════════════════════════
// PROPOSED LAYOUT COMPONENT
// ═══════════════════════════════════════════════════════════
function ProposedLayout() {
  const [activeChapter, setActiveChapter] = useState(2) // Chapter III
  const [toolsOpen, setToolsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [helpTab, setHelpTab] = useState<'guide' | 'ia' | 'director'>('guide')
  const active = CHAPTERS_DEMO[activeChapter]
  const colors = COLOR_MAP[active.color]
  const totalWords = CHAPTERS_DEMO.reduce((s, c) => s + c.words, 0)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* ═══ TOP BAR ═══ */}
      <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-4 shrink-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">ThesisFrame</h1>
            <p className="text-[9px] text-emerald-600 font-medium">Ma thèse de doctorat</p>
          </div>
        </div>

        {/* Progress */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md mx-auto">
          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Progression</span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${Math.min(100, (totalWords / 80000) * 100)}%` }} />
          </div>
          <span className="text-[10px] text-emerald-600 font-bold tabular-nums">{totalWords.toLocaleString()} mots</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Tools dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">Outils</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {toolsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setToolsOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outils</span>
                  </div>
                  {TOOLS.map(t => (
                    <button key={t.label} className="w-full px-3 py-2 flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                      <t.icon className="h-3.5 w-3.5 text-slate-400" />
                      <span>{t.label}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button className="w-full px-3 py-2 flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                      <ToggleLeft className="h-3.5 w-3.5 text-slate-400" />
                      <span>Éditeur → Texte</span>
                    </button>
                    <button className="w-full px-3 py-2 flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      <span>Mode parties</span>
                    </button>
                    <button className="w-full px-3 py-2 flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                      <LayoutTemplate className="h-3.5 w-3.5 text-slate-400" />
                      <span>Modèles</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help toggle */}
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className={cn('p-1.5 rounded-lg transition-colors', helpOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100')}
            title={helpOpen ? "Fermer l'aide" : "Ouvrir l'aide"}
          >
            <Sparkles className="h-4 w-4" />
          </button>

          {/* User avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-[10px] ring-2 ring-emerald-500/20 shrink-0">
            DR
          </div>
        </div>
      </header>

      {/* ═══ HORIZONTAL CHAPTER TABS ═══ */}
      <nav className="bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 shrink-0 overflow-x-auto z-20">
        {CHAPTERS_DEMO.map((ch, i) => {
          const c = COLOR_MAP[ch.color]
          const isActive = i === activeChapter
          return (
            <button
              key={ch.num}
              onClick={() => setActiveChapter(i)}
              className={cn(
                'group relative flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-200 shrink-0 border',
                isActive
                  ? `${c.activeBg} ${c.activeText} border-transparent shadow-sm`
                  : `bg-white ${c.text} ${c.border} hover:${c.bg}`,
              )}
            >
              <span className={cn('text-xs font-bold', isActive ? 'text-white/80' : c.text)}>{ch.num}</span>
              <div className="flex flex-col">
                <span className={cn('text-xs font-semibold leading-tight whitespace-nowrap', isActive && 'text-white')}>{ch.shortTitle}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={cn('h-1.5 w-1.5 rounded-full', STATUS_COLORS[ch.status])} />
                  <span className={cn('text-[9px] tabular-nums', isActive ? 'text-white/70' : 'text-slate-400')}>{ch.words.toLocaleString()}m</span>
                </div>
              </div>
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-emerald-500" />
              )}
            </button>
          )
        })}
        {/* Add chapter button */}
        <button className="shrink-0 p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-dashed border-slate-300 hover:border-emerald-400">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </nav>

      {/* ═══ CHAPTER INFO BAR ═══ */}
      <div className={cn('bg-white/90 backdrop-blur-sm border-b px-4 sm:px-6 py-2 flex items-center gap-3 shrink-0', colors.border)}>
        <div className={cn('p-1.5 rounded-lg flex items-center justify-center', colors.light, colors.text)}>
          <FlaskConical className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Chapitre {active.num}. {active.title}</h2>
          <p className="text-[10px] text-slate-500 truncate">Design de recherche, outils de collecte et techniques d'analyse.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-[10px] gap-1">
            <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_COLORS[active.status])} />
            {STATUS_LABELS[active.status]}
          </Badge>
          <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">{active.words.toLocaleString()} mots</Badge>
          <span className="text-emerald-500 text-xs font-medium hidden sm:inline">✓ Enregistré</span>
        </div>
      </div>

      {/* ═══ EDITOR + HELP ═══ */}
      <div className="flex flex-1 min-h-0">
        {/* Editor area */}
        <main className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Chapitre {active.num}. {active.title}</h1>
            <p className="text-sm text-slate-500 mb-8">{active.num === 'III' ? "Design de recherche, outils de collecte et techniques d'analyse." : 'Description du chapitre...'}</p>

            <h2 className="text-lg font-bold text-slate-800 mb-4">3.1 Approche épistémologique et design de recherche</h2>
            <p className="text-[15px] leading-[1.8] font-serif text-slate-700 mb-6">
              La présente étude s'inscrit dans une démarche de recherche qualitative, ancrée dans le paradigme interprétativiste. Cette approche épistémologique a été retenue en raison de sa pertinence pour explorer les phénomènes complexes liés à notre objet d'étude. Le design de recherche adopté combine une approche de type étude de cas multiples avec une analyse thématique des données recueillies.
            </p>
            <p className="text-[15px] leading-[1.8] font-serif text-slate-700 mb-6">
              Cette section détaille les choix méthodologiques qui guident notre investigation, en justifiant chaque décision au regard des objectifs de recherche formulés dans le chapitre d'introduction. Nous présentons successivement l'approche épistémologique retenue, le design de recherche, ainsi que les considérations éthiques qui encadrent notre démarche.
            </p>

            <h2 className="text-lg font-bold text-slate-800 mb-4">3.2 Population et stratégie d'échantillonnage</h2>
            <p className="text-[15px] leading-[1.8] font-serif text-slate-700 mb-6">
              L'échantillon de cette recherche a été constitué selon une procédure d'échantillonnage purposif. Cette méthode non probabiliste permet de sélectionner des participants dont les caractéristiques sont pertinentes pour la problématique étudiée...
            </p>
          </div>
        </main>

        {/* Help panel */}
        {helpOpen && (
          <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
            <div className="flex border-b border-slate-200">
              {(['guide', 'ia', 'director'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setHelpTab(tab)}
                  className={cn(
                    'flex-1 py-2.5 text-xs font-medium transition-colors border-b-2',
                    helpTab === tab ? 'text-emerald-600 border-emerald-500' : 'text-slate-400 border-transparent hover:text-slate-600',
                  )}
                >
                  {tab === 'guide' ? 'Guide' : tab === 'ia' ? 'IA' : 'Directeur'}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {helpTab === 'guide' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Attendus du chapitre</h3>
                  <ul className="space-y-1.5">
                    {['Justifier le choix du design de recherche', 'Décrire la population et l\'échantillon', 'Présenter les instruments de collecte', 'Expliquer les techniques d\'analyse', 'Aborder les considérations éthiques'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <h3 className="text-sm font-bold text-slate-900 mt-4">Structure suggérée</h3>
                  <ul className="space-y-1">
                    {['3.1 Approche épistémologique', '3.2 Population et échantillonnage', '3.3 Instruments de collecte', '3.4 Techniques d\'analyse', '3.5 Considérations éthiques'].map((s, i) => (
                      <li key={i} className="text-xs text-slate-500 pl-4 py-0.5 border-l-2 border-slate-200">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {helpTab === 'ia' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Posez une question sur ce chapitre...</p>
                  <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 italic">
                    "Comment structurer la section échantillonnage ?"
                  </div>
                </div>
              )}
              {helpTab === 'director' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Soumettez votre chapitre pour une évaluation...</p>
                  <button className="w-full py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                    Soumettre au directeur
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t bg-white/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <p>ThesisFrame © 2025 — Université de démonstration</p>
        <p>Sciences · {(totalWords / 1000).toFixed(1)}k mots rédigés</p>
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// PROPOSAL OVERVIEW PAGE
// ═══════════════════════════════════════════════════════════
export default function ProposalPage() {
  const [view, setView] = useState<'proposal' | 'current'>('proposal')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Proposal header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Proposition de refonte — Navigation horizontale</h1>
              <p className="text-sm text-slate-500">ThesisFrame · Restructuration de l'interface</p>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-xs font-medium text-slate-500">Aperçu :</span>
            <button
              onClick={() => setView('proposal')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
                view === 'proposal' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              Nouvelle interface (horizontale)
            </button>
            <button
              onClick={() => setView('current')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
                view === 'current' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              Interface actuelle (sidebar)
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {view === 'proposal' && <>
          {/* Benefits section */}
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🎯', title: 'Navigation intuitive', desc: 'Tous les chapitres visibles d\'un coup — plus besoin de scroller dans la sidebar' },
                { icon: '📐', title: 'Espace de rédaction maximisé', desc: 'Suppression de la sidebar 256px — l\'éditeur gagne ~20% de largeur utile' },
                { icon: '🧰', title: 'Outils accessibles', desc: 'Menu déroulant compact pour les 11 outils + actions de structure' },
              ].map(b => (
                <div key={b.title} className="bg-white rounded-xl border border-slate-200 p-4">
                  <span className="text-lg">{b.icon}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{b.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Live preview */}
          <div className="flex-1 border-t border-slate-200 bg-slate-100">
            <div className="text-center py-2 bg-slate-200/60 border-b border-slate-200">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Aperçu en direct — Nouvelle interface proposée</span>
            </div>
            <div className="h-[calc(100vh-340px)]">
              <ProposedLayout />
            </div>
          </div>
        </>}

        {view === 'current' && <>
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">Problèmes identifiés avec l'interface actuelle</h3>
                <ul className="mt-2 space-y-1 text-xs text-amber-800">
                  <li>• La navigation verticale dans la sidebar rend difficile la vue d'ensemble des chapitres</li>
                  <li>• 11 boutons d'outils + 6 chapitres + actions de gestion = sidebar surchargée</li>
                  <li>• La sidebar consomme 256px de largeur, réduisant l'espace de rédaction</li>
                  <li>• Sur mobile, la sidebar est un overlay qui cache totalement l'éditeur</li>
                  <li>• Les actions par chapitre (renommer, réordonner, supprimer) sont cachées au hover</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex-1 border-t border-slate-200 bg-slate-100">
            <div className="text-center py-2 bg-slate-200/60 border-b border-slate-200">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Interface actuelle — avec sidebar verticale</span>
            </div>
            <CurrentLayoutMock />
          </div>
        </>}
      </div>

      {/* Footer */}
      <footer className="border-t bg-white px-4 py-3 text-center text-xs text-slate-400 mt-auto">
        <p>Ceci est une proposition de maquette. Cliquez sur les boutons ci-dessus pour comparer les deux interfaces.</p>
      </footer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// CURRENT LAYOUT MOCK (simplified reproduction)
// ═══════════════════════════════════════════════════════════
function CurrentLayoutMock() {
  return (
    <div className="h-[calc(100vh-380px)] flex bg-slate-200">
      {/* Dark sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white">ThesisFrame</h1>
            <p className="text-[10px] text-emerald-400">Ma thèse de doctorat</p>
          </div>
        </div>
        {/* Progress */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500 font-medium">PROGRESSION</span>
            <span className="text-[10px] text-emerald-400 font-bold">8 370 mots</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '10.5%' }} />
          </div>
        </div>
        {/* Chapters header */}
        <div className="px-3 pt-2 pb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Structure</span>
          <div className="flex items-center gap-0.5">
            <Layers className="h-3 w-3 text-slate-600" />
            <Plus className="h-3 w-3 text-emerald-500" />
          </div>
        </div>
        {/* Chapters (vertical list - cramped) */}
        <nav className="flex-1 overflow-y-auto space-y-0.5 px-2 min-h-0">
          {CHAPTERS_DEMO.map((ch, i) => {
            const isActive = i === 2
            return (
              <button
                key={ch.num}
                className={cn(
                  'w-full p-2.5 flex items-start gap-2.5 rounded-xl text-left transition-all relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-900/80 to-slate-900 text-white border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent',
                )}
              >
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                  isActive ? 'bg-emerald-500/20' : 'bg-slate-800',
                )}>
                  <span className={cn('text-[10px] font-bold', isActive ? 'text-emerald-400' : 'text-slate-400')}>{ch.num}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-[11px] font-semibold leading-tight truncate', isActive && 'text-white')}>{ch.shortTitle}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={cn('h-1.5 w-1.5 rounded-full', STATUS_COLORS[ch.status])} />
                    <span className="text-[9px] text-slate-600">{ch.words.toLocaleString()} mots</span>
                  </div>
                </div>
              </button>
            )
          })}
        </nav>
        {/* Tools (cramped list) */}
        <div className="shrink-0 px-3 pt-2 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Outils</span>
        </div>
        <div className="shrink-0 px-2 pb-3 space-y-0.5 max-h-60 overflow-y-auto">
          {TOOLS.map(t => (
            <button key={t.label} className="w-full p-2 flex items-center gap-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs">
              <t.icon className="h-3.5 w-3.5" /><span>{t.label}</span>
            </button>
          ))}
        </div>
        {/* User */}
        <div className="shrink-0 p-3 border-t border-slate-800">
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-[10px]">DR</div>
            <div className="overflow-hidden flex-1">
              <div className="text-[10px] font-medium text-slate-200">Doctorant</div>
              <div className="text-[9px] text-slate-500">Université de démonstration</div>
            </div>
          </div>
        </div>
      </aside>
      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chapter header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-3 shrink-0">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <FlaskConical className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Chapitre III. Cadre méthodologique</h2>
            <p className="text-[10px] text-slate-500 truncate">Design de recherche, outils de collecte et techniques d'analyse.</p>
          </div>
          <Badge variant="outline" className="text-[10px] gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            en cours
          </Badge>
          <Badge variant="secondary" className="text-[10px]">2 810 mots</Badge>
        </header>
        {/* Editor */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Chapitre III. Cadre méthodologique</h1>
            <p className="text-sm text-slate-500 mb-8">Design de recherche, outils de collecte et techniques d'analyse.</p>
            <p className="text-[15px] leading-[1.8] font-serif text-slate-700 mb-6">
              La présente étude s'inscrit dans une démarche de recherche qualitative, ancrée dans le paradigme interprétativiste...
            </p>
          </div>
        </main>
        <footer className="border-t bg-white/80 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
          <p>ThesisFrame © 2025 — Université de démonstration</p>
          <p>Sciences · 8.4k mots rédigés</p>
        </footer>
      </div>
    </div>
  )
}

function AlertTriangle(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  )
}

function FlaskConical(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" /><path d="M7 16.5h10" />
    </svg>
  )
}
