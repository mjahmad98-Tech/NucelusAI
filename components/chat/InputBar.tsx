'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InputBarProps {
  onSend: (text: string) => void
  disabled?: boolean
  mode: string
}

const SKILL_HINTS = [
  { cmd: '/hypothesis', desc: 'Generate ranked hypotheses' },
  { cmd: '/figure-review', desc: 'Critical figure analysis' },
  { cmd: '/peer-review', desc: 'Simulate peer review' },
  { cmd: '/experiment', desc: 'Design an experiment' },
  { cmd: '/manuscript', desc: 'Write a manuscript' },
  { cmd: '/calculate', desc: 'Lab calculations' },
  { cmd: '/crispr', desc: 'CRISPR guide design' },
  { cmd: '/rnaseq', desc: 'RNA-seq workflow' },
  { cmd: '/brainstorm', desc: 'Divergent ideation' },
]

export default function InputBar({ onSend, disabled, mode }: InputBarProps) {
  const [text, setText] = useState('')
  const [showSkills, setShowSkills] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const filteredSkills = text.startsWith('/')
    ? SKILL_HINTS.filter((s) => s.cmd.startsWith(text.toLowerCase()))
    : []

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px'
    }
  }, [text])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    setShowSkills(false)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Escape') setShowSkills(false)
  }

  const accentColor = mode === 'work' ? '#D966D9' : '#4D8FE8'

  return (
    <div className="relative px-4 py-4">
      {/* Skill autocomplete */}
      <AnimatePresence>
        {filteredSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8,12,24,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(46,111,204,0.2)',
            }}
          >
            {filteredSkills.map((s) => (
              <button
                key={s.cmd}
                onClick={() => { setText(s.cmd + ' '); textareaRef.current?.focus() }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
              >
                <code className="text-xs font-mono" style={{ color: accentColor }}>{s.cmd}</code>
                <span className="text-xs text-gray-400">{s.desc}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input container */}
      <div
        className="relative max-w-2xl mx-auto rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(10,16,32,0.8)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${disabled ? 'rgba(46,111,204,0.1)' : accentColor + '33'}`,
          boxShadow: disabled ? 'none' : `0 0 20px ${accentColor}15`,
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); setShowSkills(e.target.value.startsWith('/')) }}
          onKeyDown={handleKey}
          disabled={disabled}
          rows={1}
          placeholder={
            disabled
              ? 'NucleusAI is thinking...'
              : mode === 'work'
              ? 'Work mode — try /hypothesis, /experiment, /peer-review...'
              : 'Ask NucleusAI anything about biology...'
          }
          className="w-full bg-transparent placeholder-gray-600 px-5 py-4 pr-14 resize-none outline-none"
          style={{
            maxHeight: 160,
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            lineHeight: 1.65,
            color: '#F0F4FF',
          }}
        />

        {/* Send button */}
        <motion.button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-3 bottom-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
          style={{
            background: text.trim() && !disabled
              ? `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`
              : 'rgba(46,111,204,0.1)',
            boxShadow: text.trim() && !disabled ? `0 0 12px ${accentColor}40` : 'none',
          }}
        >
          {disabled ? (
            <motion.div
              className="w-3 h-3 rounded-full border-2 border-t-transparent"
              style={{ borderColor: accentColor }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="white" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Footer hint */}
      <p className="text-center text-[10px] text-gray-700 mt-2">
        Type <code className="text-gray-600">/</code> for skills · <kbd className="text-gray-600">Enter</kbd> to send · <kbd className="text-gray-600">Shift+Enter</kbd> for new line
      </p>
    </div>
  )
}
