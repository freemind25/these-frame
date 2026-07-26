'use client'

import { Library, Download, BookOpen, Cloud, Scale, Search, Newspaper } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ReferencesTab from '@/components/thesis/references-tab'
import ExportPdfContent from '@/components/thesis/export-pdf-tab'
import ArticlesGuideContent from '@/components/thesis/articles-tab'
import LiteratureSearch from '@/components/thesis/literature-search'
import ChapterBalance from '@/components/thesis/chapter-balance'
import CloudDriveBackup from '@/components/thesis/cloud-drive-backup'
import JournalFinder from '@/components/thesis/journal-finder'
import type { ThesisData } from '@/types/thesis'

interface FeatureDialogsProps {
  thesis: ThesisData | null
  refsOpen: boolean
  setRefsOpen: (v: boolean) => void
  exportOpen: boolean
  setExportOpen: (v: boolean) => void
  resourcesOpen: boolean
  setResourcesOpen: (v: boolean) => void
  cloudDriveOpen: boolean
  setCloudDriveOpen: (v: boolean) => void
  balanceOpen: boolean
  setBalanceOpen: (v: boolean) => void
  literatureOpen: boolean
  setLiteratureOpen: (v: boolean) => void
  journalFinderOpen: boolean
  setJournalFinderOpen: (v: boolean) => void
  s2ApiKey: string
  consensusApiKey: string
}

export default function FeatureDialogs({
  thesis, refsOpen, setRefsOpen, exportOpen, setExportOpen, resourcesOpen, setResourcesOpen,
  cloudDriveOpen, setCloudDriveOpen, balanceOpen, setBalanceOpen, literatureOpen, setLiteratureOpen,
  journalFinderOpen, setJournalFinderOpen, s2ApiKey, consensusApiKey,
}: FeatureDialogsProps) {
  return (
    <>
      <Dialog open={refsOpen} onOpenChange={setRefsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Library className="h-4 w-4 text-emerald-600" />Références bibliographiques</DialogTitle>
          </DialogHeader>
          <ReferencesTab />
        </DialogContent>
      </Dialog>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Download className="h-4 w-4 text-emerald-600" />Export PDF</DialogTitle>
          </DialogHeader>
          <ExportPdfContent />
        </DialogContent>
      </Dialog>

      <Dialog open={resourcesOpen} onOpenChange={setResourcesOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><BookOpen className="h-4 w-4 text-emerald-600" />Guide de rédaction scientifique</DialogTitle>
          </DialogHeader>
          <ArticlesGuideContent />
        </DialogContent>
      </Dialog>

      <Dialog open={cloudDriveOpen} onOpenChange={setCloudDriveOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Cloud className="h-4 w-4 text-emerald-600" />Sauvegarde Google Drive</DialogTitle>
          </DialogHeader>
          <CloudDriveBackup />
        </DialogContent>
      </Dialog>

      <Dialog open={balanceOpen} onOpenChange={setBalanceOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Scale className="h-4 w-4 text-emerald-600" />Bilan d'équilibre des chapitres</DialogTitle>
          </DialogHeader>
          {thesis && <ChapterBalance chapters={thesis.chapters} />}
        </DialogContent>
      </Dialog>

      <Dialog open={literatureOpen} onOpenChange={setLiteratureOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Search className="h-4 w-4 text-emerald-600" />Recherche de littérature scientifique</DialogTitle>
          </DialogHeader>
          <LiteratureSearch s2ApiKey={s2ApiKey} consensusApiKey={consensusApiKey} />
        </DialogContent>
      </Dialog>

      <Dialog open={journalFinderOpen} onOpenChange={setJournalFinderOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base"><Newspaper className="h-4 w-4 text-emerald-600" />Trouver un journal en accès ouvert</DialogTitle>
          </DialogHeader>
          <JournalFinder />
        </DialogContent>
      </Dialog>
    </>
  )
}
