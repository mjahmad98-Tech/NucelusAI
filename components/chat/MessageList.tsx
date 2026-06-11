'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Message } from '@/types'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

interface MessageListProps {
  messages: Message[]
  isStreaming: boolean
  onSend?: (text: string) => void
}

export default function MessageList({ messages, isStreaming, onSend }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isStreaming])

  const isEmpty = messages.length === 0

  return (
    <div className="flex-1 overflow-y-auto py-6 space-y-5">
      {/* Empty state */}
      {isEmpty && !isStreaming && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full text-center px-8 py-12 space-y-5"
        >
          {/* Icon ring */}
          <motion.div
            className="relative w-16 h-16 mb-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '1.5px solid rgba(77,143,232,0.3)',
                borderTopColor: '#4D8FE8',
              }}
            />
            <div className="absolute inset-2 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'rgba(46,111,204,0.08)' }}>
              🧬
            </div>
          </motion.div>

          <div>
            <p className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              How can I help you today?
            </p>
            <p className="text-sm max-w-md leading-relaxed" style={{ color: '#6B7A99' }}>
              Ask about any biology topic, design an experiment, analyse a figure,
              or type <code style={{ color: '#4D8FE8', background: 'rgba(46,111,204,0.12)', padding: '1px 6px', borderRadius: 4 }}>/</code> to see all skills.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full max-w-lg mt-2">
            {SUGGESTIONS.map((s, i) => (
              <motion.div
                key={s.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <SuggestionChip text={s.text} emoji={s.emoji} onClick={() => onSend?.(s.text)} />
              </motion.div>
            ))}
          </div>

          {/* Skill pills */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-1 max-w-md">
            {['/hypothesis', '/experiment', '/brainstorm', '/peer-review', '/crispr', '/rnaseq'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => onSend?.(cmd + ' ')}
                className="text-[10px] font-mono px-2.5 py-1 rounded-full transition-all"
                style={{
                  background: 'rgba(192,64,192,0.08)',
                  border: '1px solid rgba(192,64,192,0.2)',
                  color: '#D966D9',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(192,64,192,0.18)'
                  e.currentTarget.style.borderColor = 'rgba(217,102,217,0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(192,64,192,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(192,64,192,0.2)'
                }}
              >
                {cmd}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </AnimatePresence>

      {/* Typing indicator — show only when streaming and last message isn't already streaming */}
      <AnimatePresence>
        {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <TypingIndicator key="typing" />
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  )
}

function SuggestionChip({ text, emoji, onClick }: { text: string; emoji: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2.5 rounded-xl text-xs text-gray-400 text-left transition-all hover:text-gray-200"
      style={{
        background: 'rgba(15,24,41,0.5)',
        border: '1px solid rgba(46,111,204,0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(46,111,204,0.12)'
        e.currentTarget.style.borderColor = 'rgba(46,111,204,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(15,24,41,0.5)'
        e.currentTarget.style.borderColor = 'rgba(46,111,204,0.1)'
      }}
    >
      <span className="mr-1.5">{emoji}</span>
      {text}
    </button>
  )
}

const SUGGESTIONS = [
  { emoji: '🔬', text: 'Explain chromatin remodelling' },
  { emoji: '🧬', text: '/hypothesis — CRISPR off-targets' },
  { emoji: '📊', text: '/figure-review — upload a gel image' },
  { emoji: '📝', text: '/peer-review my methods section' },
  { emoji: '⚗️', text: '/experiment — test H3K27ac role' },
  { emoji: '🧮', text: '/calculate — 10mM → 250µM dilution' },
]
