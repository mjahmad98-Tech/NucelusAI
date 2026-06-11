'use client'

import { motion } from 'framer-motion'
import { getCertaintyColor, getEvidenceLabel } from '@/lib/tagParser'
import type { ParsedTag } from '@/types'

interface ConfidenceBadgeProps {
  tag: ParsedTag
}

export function ConfidenceBadge({ tag }: ConfidenceBadgeProps) {
  if (tag.type === 'certainty') {
    const val = parseFloat(tag.value)
    const pct = Math.round(val * 100)
    const colorClass = getCertaintyColor(val)
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.7, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}
        title={`Certainty: ${pct}%`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        {pct}% confidence
      </motion.span>
    )
  }

  if (tag.type === 'evidence_type') {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.7, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
        className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full"
        style={{
          background: 'rgba(77,143,232,0.12)',
          border: '1px solid rgba(77,143,232,0.25)',
          color: '#7AB0F5',
        }}
      >
        {getEvidenceLabel(tag.value)}
      </motion.span>
    )
  }

  if (tag.type === 'speculative') {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.7, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full"
        style={{
          background: 'rgba(251,191,36,0.12)',
          border: '1px solid rgba(251,191,36,0.25)',
          color: '#fbbf24',
        }}
      >
        speculative
      </motion.span>
    )
  }

  if (tag.type === 'retracted') {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.7, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{
          background: 'rgba(248,113,113,0.15)',
          border: '1px solid rgba(248,113,113,0.35)',
          color: '#f87171',
        }}
      >
        ⚠ RETRACTED
      </motion.span>
    )
  }

  if (tag.type === 'unreplicated') {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.7, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full"
        style={{
          background: 'rgba(251,146,60,0.12)',
          border: '1px solid rgba(251,146,60,0.25)',
          color: '#fb923c',
        }}
      >
        unreplicated
      </motion.span>
    )
  }

  if (tag.type === 'low_power') {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.7, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full"
        style={{
          background: 'rgba(251,146,60,0.12)',
          border: '1px solid rgba(251,146,60,0.25)',
          color: '#fb923c',
        }}
      >
        low power
      </motion.span>
    )
  }

  return null
}

export function BadgeRow({ tags }: { tags: ParsedTag[] }) {
  const visible = tags.filter((t) =>
    ['certainty', 'evidence_type', 'speculative', 'retracted', 'unreplicated', 'low_power'].includes(t.type)
  )
  if (visible.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {visible.map((tag, i) => (
        <ConfidenceBadge key={i} tag={tag} />
      ))}
    </div>
  )
}
