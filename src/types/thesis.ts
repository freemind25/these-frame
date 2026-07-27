export interface PartData {
  id: string
  thesisId: string
  title: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface ChapterData {
  id: string
  thesisId: string
  partId: string | null
  order: number
  number: string
  title: string
  content: string
  wordCount: number
  status: string
  directorFeedback: string | null
  directorFeedbackAt: string | null
}

export interface ThesisData {
  id: string
  title: string
  subtitle: string | null
  author: string
  field: string
  university: string
  status: string
  structureMode: 'chapters' | 'parts'
  chapters: ChapterData[]
  parts: PartData[]
}

export interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}
