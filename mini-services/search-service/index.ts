import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('*', cors())

interface SearchDoc {
  id: string; chapterId: string; chapterTitle: string; chapterNumber: string; content: string; wordCount: number
}

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'est', 'en', 'que', 'qui',
  'dans', 'ce', 'il', 'ne', 'sur', 'se', 'pas', 'plus', 'par', 'je', 'avec', 'tout',
  'faire', 'son', 'mais', 'sont', 'au', 'aux', 'ou', 'si', 'leur', 'y', 'nous', 'vous',
  'ils', 'elle', 'on', 'pour', 'cette', 'donc', 'aussi', 'comme', 'entre',
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'can', 'it', 'its', 'this', 'that', 'these', 'those', 'not', 'no', 'as', 'if',
])

let documents: SearchDoc[] = []

function stem(word: string): string {
  return word.replace(/ement$/, '').replace(/tion$/, '').replace(/ment$/, '')
    .replace(/aux$/, 'al').replace(/eaux$/, 'al').replace(/ée?s?$/, '').toLowerCase()
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-zàâéèêëïîôùûüÿçœæ0-9\s-]/g, ' ')
    .split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w)).map(stem)
}

function search(query: string, limit = 20) {
  if (!query.trim() || documents.length === 0) return []
  const queryTerms = tokenize(query)
  if (queryTerms.length === 0) return []
  const N = documents.length
  const index = new Map<string, { docId: string; tf: number }[]>()
  for (const doc of documents) {
    const tokens = tokenize(doc.content + ' ' + doc.chapterTitle)
    const tf = new Map<string, number>()
    for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1)
    for (const [term, count] of tf) {
      const postings = index.get(term) || []
      postings.push({ docId: doc.id, tf: count / tokens.length })
      index.set(term, postings)
    }
  }
  const scores = new Map<string, number>()
  for (const term of queryTerms) {
    const postings = index.get(term)
    if (!postings) continue
    const idf = Math.log((N + 1) / (postings.length + 1)) + 1
    for (const posting of postings) scores.set(posting.docId, (scores.get(posting.docId) || 0) + posting.tf * idf)
  }
  return Array.from(scores.entries()).map(([docId, score]) => {
    const doc = documents.find(d => d.id === docId)!
    const lowerContent = doc.content.toLowerCase()
    const queryIdx = lowerContent.indexOf(query.toLowerCase().split(' ')[0])
    let snippet = doc.content.slice(0, 200)
    if (queryIdx >= 0) snippet = doc.content.slice(Math.max(0, queryIdx - 80), Math.min(doc.content.length, queryIdx + 120))
    return { doc, score, snippet }
  }).sort((a, b) => b.score - a.score).slice(0, limit)
}

app.post('/index', async (c) => {
  const { docs } = await c.req.json()
  if (!Array.isArray(docs)) return c.json({ error: 'docs array required' }, 400)
  documents = docs
  return c.json({ indexed: docs.length, totalDocuments: documents.length })
})

app.get('/search', async (c) => {
  const q = c.req.query('q') || ''
  const results = search(q)
  return c.json({ results, total: results.length, query: q })
})

app.get('/', (c) => c.json({ service: 'ThesisFrame Search', status: 'ok', documents: documents.length }))

const searchApp = { port: 3031, fetch: app.fetch }
export default searchApp
