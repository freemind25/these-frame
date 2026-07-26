export interface ChapterData {
  id: string
  thesisId: string
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
  chapters: ChapterData[]
}

export interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}
