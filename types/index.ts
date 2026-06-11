export type Mode = 'chatty' | 'work'

export type EvidenceType =
  | 'primary_paper'
  | 'textbook'
  | 'reasoning'
  | 'analogy'
  | 'unknown'
  | 'speculative'

export interface EpistemicTag {
  certainty: number
  evidenceType: EvidenceType
}

export interface ParsedTag {
  type: 'certainty' | 'evidence_type' | 'speculative' | 'retracted' | 'unreplicated' | 'fallacy' | 'low_power' | 'user_override'
  value: string
  raw: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  cleanContent: string
  tags: ParsedTag[]
  mode: Mode
  timestamp: number
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: Message[]
}

export interface UserCorrection {
  id: string
  conversationId: string
  original: string
  correction: string
  timestamp: number
  propagated: boolean
}

export interface SentimentVector {
  frustration: number
  curiosity: number
  urgency: number
}

export interface ModeDetectionResult {
  mode: Mode
  confidence: number
  triggerPhrase?: string
}
