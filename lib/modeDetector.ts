import type { Mode, ModeDetectionResult, SentimentVector } from '@/types'

const WORK_TRIGGERS = [
  'manuscript', 'thesis', 'sop', 'lab meeting', 'conference', 'assignment',
  'ta class', 'peer review', 'figure', 'methods section', 'results section',
  'discussion', 'abstract', 'introduction', 'citation', 'reference', 'paper',
  'protocol', 'experiment', 'hypothesis', 'data', 'analysis', 'statistics',
  'write', 'draft', 'review', 'submit', 'journal', 'publication',
]

const CHATTY_TRIGGERS = [
  'just curious', 'story', 'example', 'just thinking', 'tell me about',
  'what is', 'explain', 'help me understand', 'interesting', 'fun fact',
  'cool', 'wow', 'amazing', 'just exploring', 'out loud',
]

export function detectMode(text: string, history?: string[]): ModeDetectionResult {
  const lower = text.toLowerCase()

  for (const trigger of WORK_TRIGGERS) {
    if (lower.includes(trigger)) {
      return { mode: 'work', confidence: 0.85, triggerPhrase: trigger }
    }
  }

  for (const trigger of CHATTY_TRIGGERS) {
    if (lower.includes(trigger)) {
      return { mode: 'chatty', confidence: 0.8, triggerPhrase: trigger }
    }
  }

  // Infer from message length and formality
  const wordCount = text.split(' ').length
  const hasQuestion = text.includes('?')
  const hasTechnicalTerms = /\b(gene|protein|cell|DNA|RNA|kinase|pathway|expression|mutation)\b/i.test(text)

  if (wordCount > 50 && hasTechnicalTerms) {
    return { mode: 'work', confidence: 0.6 }
  }

  if (wordCount < 15 && hasQuestion) {
    return { mode: 'chatty', confidence: 0.6 }
  }

  return { mode: 'chatty', confidence: 0.5 }
}

export function detectSentiment(text: string): SentimentVector {
  const lower = text.toLowerCase()

  const frustrationWords = ['confused', 'frustrated', "don't understand", 'stuck', 'wrong', 'fail', 'why', 'ugh', 'argh', 'help']
  const curiosityWords = ['interesting', 'wonder', 'curious', 'how', 'why', 'what if', 'could', 'explore']
  const urgencyWords = ['urgent', 'asap', 'deadline', 'today', 'now', 'quickly', 'fast', 'need', 'must']

  const score = (words: string[]) =>
    words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0) / words.length

  return {
    frustration: Math.min(score(frustrationWords) * 3, 1),
    curiosity: Math.min(score(curiosityWords) * 3, 1),
    urgency: Math.min(score(urgencyWords) * 3, 1),
  }
}

export function getModeSystemNote(mode: Mode): string {
  if (mode === 'work') {
    return `[WORK MODE ACTIVE: 90% precision, 10% encouragement. Use structured output: claim → evidence → interpretation. Cite sources. Apply all quality gates.]`
  }
  return `[CHATTY MODE ACTIVE: 70% warmth, 30% facts. Use analogies, stories, conversational tone. Still apply epistemic tagging.]`
}
