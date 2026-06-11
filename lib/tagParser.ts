import type { ParsedTag } from '@/types'

const TAG_PATTERNS: { pattern: RegExp; type: ParsedTag['type'] }[] = [
  { pattern: /\[certainty:\s*([\d.]+)\]/gi, type: 'certainty' },
  { pattern: /\[evidence_type:\s*([^\]]+)\]/gi, type: 'evidence_type' },
  { pattern: /\[speculative\]/gi, type: 'speculative' },
  { pattern: /\[retracted[^\]]*\]/gi, type: 'retracted' },
  { pattern: /\[unreplicated\]/gi, type: 'unreplicated' },
  { pattern: /\[fallacy:\s*([^\]]+)\]/gi, type: 'fallacy' },
  { pattern: /\[low_power\]/gi, type: 'low_power' },
  { pattern: /\[user_override:\s*([^\]]*)\]/gi, type: 'user_override' },
]

export function parseTags(text: string): { cleanContent: string; tags: ParsedTag[] } {
  const tags: ParsedTag[] = []
  let cleanContent = text

  for (const { pattern, type } of TAG_PATTERNS) {
    const matches = [...text.matchAll(pattern)]
    for (const match of matches) {
      tags.push({
        type,
        value: match[1] ?? 'true',
        raw: match[0],
      })
    }
    cleanContent = cleanContent.replace(pattern, '')
  }

  cleanContent = cleanContent.trim()
  return { cleanContent, tags }
}

export function getCertaintyColor(certainty: number): string {
  if (certainty >= 0.8) return 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10'
  if (certainty >= 0.5) return 'text-blue-400 border-blue-400/40 bg-blue-400/10'
  if (certainty >= 0.3) return 'text-amber-400 border-amber-400/40 bg-amber-400/10'
  return 'text-rose-400 border-rose-400/40 bg-rose-400/10'
}

export function getEvidenceLabel(type: string): string {
  const labels: Record<string, string> = {
    primary_paper: 'Primary Paper',
    textbook: 'Textbook',
    reasoning: 'Reasoning',
    analogy: 'Analogy',
    unknown: 'Unknown',
    speculative: 'Speculative',
  }
  return labels[type] ?? type
}
