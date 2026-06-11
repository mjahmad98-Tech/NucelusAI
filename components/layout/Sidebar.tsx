'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '@/store/chatStore'
import LogoMark from '@/components/ui/LogoMark'
import type { Conversation } from '@/types'

interface SidebarProps {
  onNewChat: () => void
}

export default function Sidebar({ onNewChat }: SidebarProps) {
  const { conversations, activeConversationId, setActiveConversation, deleteConversation } =
    useChatStore()

  const grouped = groupByDate(conversations)

  return (
    <aside
      className="flex flex-col h-full w-72 shrink-0"
      style={{
        background: 'rgba(8,12,24,0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(46,111,204,0.1)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid rgba(46,111,204,0.08)' }}>
        <LogoMark size={32} animated />
        <div>
          <h1 className="font-bold text-white text-base leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}>
            Nucleus<span className="gradient-text">AI</span>
          </h1>
          <p className="text-[10px] text-gray-500">Biology Research Partner</p>
        </div>
      </div>

      {/* New Chat button */}
      <div className="px-3 pt-3 pb-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(46,111,204,0.25), rgba(192,64,192,0.15))',
            border: '1px solid rgba(46,111,204,0.25)',
          }}
        >
          <span className="text-lg leading-none" style={{ color: '#7AB0F5' }}>+</span>
          New conversation
        </motion.button>
      </div>

      {/* Conversation list */}
      {/* Search hint */}
      {conversations.length > 3 && (
        <div className="px-3 pb-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(46,111,204,0.05)', border: '1px solid rgba(46,111,204,0.08)' }}>
            <span className="text-gray-600 text-xs">🔍</span>
            <span className="text-[11px] text-gray-600">Recent conversations</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {conversations.length === 0 && (
          <div className="flex flex-col items-center py-10 gap-2">
            <span className="text-2xl">🧬</span>
            <p className="text-xs text-gray-600 text-center">
              No conversations yet.<br />Start a new chat above.
            </p>
          </div>
        )}

        {grouped.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-2 mb-1.5">
              {label}
            </p>
            <AnimatePresence>
              {items.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  active={conv.id === activeConversationId}
                  onSelect={() => setActiveConversation(conv.id)}
                  onDelete={() => deleteConversation(conv.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(46,111,204,0.08)' }}>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-600">
            <span style={{ color: 'rgba(122,176,245,0.7)', fontWeight: 600 }}>Tariq Lab</span>
            {' · '}LUMS
          </span>
        </div>
        <span className="text-[10px] text-gray-700">
          {conversations.length} chat{conversations.length !== 1 ? 's' : ''}
        </span>
      </div>
    </aside>
  )
}

function ConversationItem({
  conv, active, onSelect, onDelete,
}: {
  conv: Conversation
  active: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5"
      style={{
        background: active
          ? 'linear-gradient(135deg, rgba(46,111,204,0.18), rgba(192,64,192,0.1))'
          : 'transparent',
        border: active ? '1px solid rgba(46,111,204,0.2)' : '1px solid transparent',
      }}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <p className="truncate" style={{
          fontSize: '0.85rem',
          fontWeight: active ? 600 : 400,
          color: active ? '#F0F4FF' : '#9BAAC4',
        }}>
          {conv.title}
        </p>
        <p className="truncate" style={{ fontSize: '0.71rem', color: '#4A5568', marginTop: 2 }}>
          {conv.messages.length > 0
            ? conv.messages[conv.messages.length - 1]?.content?.slice(0, 42) + '…'
            : 'No messages yet'}
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs shrink-0"
      >
        ✕
      </button>
    </motion.div>
  )
}

function groupByDate(convs: Conversation[]) {
  const now = Date.now()
  const day = 86400000
  const today: Conversation[] = []
  const yesterday: Conversation[] = []
  const older: Conversation[] = []

  for (const c of convs) {
    const age = now - c.updatedAt
    if (age < day) today.push(c)
    else if (age < day * 2) yesterday.push(c)
    else older.push(c)
  }

  const result = []
  if (today.length) result.push({ label: 'Today', items: today })
  if (yesterday.length) result.push({ label: 'Yesterday', items: yesterday })
  if (older.length) result.push({ label: 'Earlier', items: older })
  return result
}
