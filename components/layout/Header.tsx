'use client'

import { motion } from 'framer-motion'
import type { Mode } from '@/types'

interface HeaderProps {
  mode: Mode
  onModeChange: (m: Mode) => void
  onClearKey: () => void
  tier: string
  conversationTitle?: string
}

const TIER_COLORS: Record<string, string> = {
  free: '#6B7A99',
  standard: '#4D8FE8',
  full: '#D966D9',
}

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  standard: 'Standard',
  full: 'Full NucleusAI',
}

export default function Header({ mode, onModeChange, onClearKey, tier, conversationTitle }: HeaderProps) {
  const tierColor = TIER_COLORS[tier] ?? '#4D8FE8'
  const tierLabel = TIER_LABELS[tier] ?? tier

  return (
    <header
      className="flex items-center justify-between px-5 py-2.5 shrink-0"
      style={{
        background: 'rgba(8,12,24,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(46,111,204,0.1)',
        minHeight: 52,
      }}
    >
      {/* Left — conversation title or LUMS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 min-w-0"
      >
        {conversationTitle && conversationTitle !== 'New conversation' ? (
          <p className="text-sm font-medium truncate max-w-xs" style={{ color: '#C8D3E8' }}>
            {conversationTitle}
          </p>
        ) : (
          <p className="text-[11px] text-gray-500 tracking-wide">
            <span className="font-semibold" style={{ color: 'rgba(122,176,245,0.8)' }}>Tariq Lab</span>
            {' · '}
            <span>Dept. of Life Sciences · LUMS, Lahore</span>
          </p>
        )}
      </motion.div>

      {/* Right — tier badge + mode toggle */}
      <div className="flex items-center gap-3">
        {/* Tier badge */}
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: tierColor + '18',
            color: tierColor,
            border: `1px solid ${tierColor}33`,
          }}
        >
          {tierLabel}
        </span>

        {/* Mode toggle */}
        <div
          className="flex items-center rounded-full p-0.5"
          style={{
            background: 'rgba(6,11,24,0.8)',
            border: '1px solid rgba(46,111,204,0.2)',
          }}
        >
          <ModeButton label="Chatty" active={mode === 'chatty'} color="#7AB0F5"
            onClick={() => onModeChange('chatty')} />
          <ModeButton label="Work" active={mode === 'work'} color="#D966D9"
            onClick={() => onModeChange('work')} />
        </div>

        {/* Settings */}
        <button
          onClick={onClearKey}
          className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
          title="Change API key"
        >
          ⚙
        </button>
      </div>
    </header>
  )
}

function ModeButton({
  label, active, color, onClick,
}: {
  label: string
  active: boolean
  color: string
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{
        color: active ? 'white' : '#6B7A99',
      }}
    >
      {active && (
        <motion.div
          layoutId="mode-pill"
          className="absolute inset-0 rounded-full"
          style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)`, border: `1px solid ${color}44` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </motion.button>
  )
}
