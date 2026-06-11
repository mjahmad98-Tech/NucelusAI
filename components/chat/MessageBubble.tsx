'use client'

import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from '@/types'
import { BadgeRow } from './ConfidenceBadge'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end max-w-2xl mx-auto w-full px-4"
      >
        <div
          className="max-w-[80%] px-5 py-3.5 rounded-2xl rounded-tr-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(46,111,204,0.28), rgba(192,64,192,0.18))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(77,143,232,0.35)',
            color: '#F0F4FF',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 max-w-2xl mx-auto w-full px-4"
    >
      {/* Avatar */}
      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
        style={{
          background: 'linear-gradient(135deg, rgba(46,111,204,0.35), rgba(192,64,192,0.35))',
          border: '1px solid rgba(46,111,204,0.3)',
          color: '#7AB0F5',
          boxShadow: '0 0 12px rgba(46,111,204,0.2)',
        }}
      >
        N
      </div>

      <div className="flex-1 min-w-0">
        {/* Mode badge */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: message.mode === 'work' ? '#D966D9' : '#7AB0F5' }}
          >
            {message.mode === 'work' ? 'Work Mode' : 'Chatty Mode'}
          </span>
          {message.isStreaming && (
            <motion.span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: '#4D8FE8' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>

        {/* Glass bubble */}
        <div
          className="px-5 py-4 rounded-2xl rounded-tl-sm"
          style={{
            background: 'rgba(12,18,36,0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(77,143,232,0.18)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="prose-nucleus">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.isStreaming ? message.content : message.cleanContent || message.content}
            </ReactMarkdown>
            {message.isStreaming && (
              <motion.span
                className="inline-block w-0.5 h-4 ml-0.5 align-middle rounded"
                style={{ background: '#4D8FE8' }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </div>

          {/* Confidence badges — below the message, non-distracting */}
          {!message.isStreaming && message.tags?.length > 0 && (
            <BadgeRow tags={message.tags} />
          )}
        </div>
      </div>
    </motion.div>
  )
}
