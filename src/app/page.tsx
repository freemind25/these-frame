'use client'

import { createElement, useState, useCallback } from 'react'
import {
  FileText,
  GraduationCap,
  Sparkles,
  FlaskConical,
  Library,
  Download,
  ShieldCheck,
  Search,
  Bell,
  HelpCircle,
  BookOpen,
  type LucideIcon,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'
import ReferencesTab from '@/components/thesis/references-tab'
import ThesisPlanTab from '@/components/thesis/thesis-plan-tab'
import ArticlesGuideTab from '@/components/thesis/articles-tab'
import AIWritingTab from '@/components/thesis/ai-writing-tab'
import DirecteurTab from '@/components/thesis/directeur-tab'
import MethodologyTab from '@/components/thesis/methodology-tab'
import ExportPdfContent from '@/components/thesis/export-pdf-tab'

// ─── Navigation config ───────────────────────────────────────
interface NavItem {
  id: string
  label: string
  shortLabel: string
  icon: LucideIcon
  badge?: string
  badgeColor?: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'articles', label: 'Articles scientifiques', shortLabel: 'Articles', icon: FileText, badge: '7 onglets', badgeColor: 'text-emerald-400' },
  { id: 'ai-writing', label: 'Assistant IA', shortLabel: 'IA', icon: Sparkles },
  { id: 'methodology', label: 'Méthodologie', shortLabel: 'Méthodo.', icon: FlaskConical, badge: '6 onglets', badgeColor: 'text-sky-400' },
  { id: 'references', label: 'Références biblio.', shortLabel: 'Réf.', icon: Library },
  { id: 'thesis', label: 'Plan de thèse', shortLabel: 'Thèse', icon: BookOpen },
  { id: 'export-pdf', label: 'Export PDF', shortLabel: 'PDF', icon: Download },
]

const SECTION_TITLES: Record<string, { title: string; desc: string; color: string }> = {
  'articles': { title: 'Articles scientifiques', desc: 'Guide de rédaction - Ecarnot et al. (2015)', color: 'text-emerald-700 bg-emerald-100' },
  'ai-writing': { title: 'Assistant IA', desc: "Rédaction assistée & Direction de thèse", color: 'text-violet-700 bg-violet-100' },
  'methodology': { title: 'Méthodologie de la recherche', desc: 'IGTU-Cne3 - Université Constantine 3', color: 'text-sky-700 bg-sky-100' },
  'references': { title: 'Références bibliographiques', desc: 'BibTeX, Mendeley et gestion des sources', color: 'text-amber-700 bg-amber-100' },
  'thesis': { title: 'Plan de these', desc: 'Structure IMRaD - Doctorat LMD', color: 'text-rose-700 bg-rose-100' },
  'export-pdf': { title: 'Export PDF', desc: 'Génération de documents formatés', color: 'text-red-700 bg-red-100' },
}

export default function Home() {
  const [activeView, setActiveView] = useState('articles')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  // Close mobile menu when switching view
  const handleNavClick = useCallback((id: string) => {
    setActiveView(id)
    setMobileMenuOpen(false)
  }, [])

  const sectionInfo = SECTION_TITLES[activeView]

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* ── MOBILE OVERLAY ── */}
      {mobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={cn(
          'bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-40 shrink-0 transition-all duration-300 shadow-2xl',
          'w-[72px] md:w-64',
          isMobile && !mobileMenuOpen && 'fixed -translate-x-full md:relative md:translate-x-0',
          isMobile && mobileMenuOpen && 'fixed translate-x-0',
          !isMobile && 'relative',
        )}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-3 py-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="hidden md:block overflow-hidden">
              <h1 className="font-bold text-base text-white tracking-tight leading-tight">ThesisFrame</h1>
              <p className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase">Université Constantine 3</p>
            </div>
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-auto text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation Label */}
          <div className="px-3 pb-2 hidden md:block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Navigation</span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full p-2.5 md:p-3 flex items-center gap-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-900/80 to-slate-900 text-white border border-emerald-500/40 shadow-[0_0_16px_rgba(16,185,129,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/50',
                  )}
                >
                  {/* Glow sweep on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                    isActive ? 'bg-emerald-500/20' : 'bg-slate-800 group-hover:bg-slate-700',
                  )}>
                    <Icon className={cn('h-4 w-4', isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400')} />
                  </div>
                  <div className="hidden md:flex flex-col min-w-0 flex-1">
                    <span className={cn('text-xs font-semibold leading-tight truncate', isActive && 'text-white')}>
                      {item.label}
                    </span>
                  </div>
                  {item.badge && (
                    <span className={cn('hidden md:block text-[9px] font-medium', item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800">
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xs ring-2 ring-emerald-500/30 shrink-0">
              DR
            </div>
            <div className="hidden md:block overflow-hidden flex-1">
              <div className="text-xs font-medium text-slate-200 truncate">Doctorant Arch.</div>
              <div className="text-[10px] text-slate-500 truncate">Constantine 3</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center gap-4 shrink-0 z-20">
          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Section info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn('p-2 rounded-xl hidden sm:flex items-center justify-center', sectionInfo?.color)}>
              {createElement(NAV_ITEMS.find(i => i.id === activeView)?.icon || FileText, { className: 'h-4 w-4' })}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                  {sectionInfo?.title}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 hidden sm:inline-block">
                  Architecture & Urbanisme
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                {sectionInfo?.desc}
              </p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <div className="relative hidden lg:block w-48">
              <input
                placeholder="Rechercher"
                className="pl-8 h-8 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full"
              />
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative hidden sm:block" title="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            </button>
            <button className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200">
              <HelpCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Aide</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeView === 'articles' && <ArticlesGuideTab />}
            {activeView === 'ai-writing' && (
              <div className="space-y-4">
                <Tabs defaultValue="redaction" className="w-full">
                  <TabsList className="mb-4 bg-slate-100 rounded-xl p-1 h-auto">
                    <TabsTrigger value="redaction" className="text-xs sm:text-sm flex items-center gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      Rédaction IA
                    </TabsTrigger>
                    <TabsTrigger value="directeur" className="text-xs sm:text-sm flex items-center gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Directeur de thèse
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="redaction"><AIWritingTab /></TabsContent>
                  <TabsContent value="directeur"><DirecteurTab /></TabsContent>
                </Tabs>
              </div>
            )}
            {activeView === 'methodology' && <MethodologyTab />}
            {activeView === 'references' && <ReferencesTab />}
            {activeView === 'thesis' && <ThesisPlanTab />}
            {activeView === 'export-pdf' && <ExportPdfContent />}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>{'ThesisFrame © 2025 - Université Constantine 3, Faculté d\'Architecture et d\'Urbanisme'}</p>
          <p>Basé sur le squelette IMRaD · Guide Ecarnot et al. (2015)</p>
        </footer>
      </div>
    </div>
  )
}
