'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useChat } from '@/hooks/useChat'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import MessageList from '@/components/chat/MessageList'
import InputBar from '@/components/chat/InputBar'
import type { Mode } from '@/types'

const DNABackground = dynamic(() => import('@/components/ui/DNABackground'), { ssr: false })

export default function ChatPage() {
  const router = useRouter()
  const [tier, setTier] = useState('standard')
  const [mounted, setMounted] = useState(false)

  const {
    mode,
    isStreaming,
    setMode,
    createConversation,
    setActiveConversation,
    sendMessage,
    activeConversation,
  } = useChat()

  useEffect(() => {
    setMounted(true)
    const key = localStorage.getItem('nucleus_api_key')
    if (!key) {
      router.push('/')
      return
    }
    const storedTier = localStorage.getItem('nucleus_tier') ?? 'standard'
    setTier(storedTier)
  }, [router])

  const handleNewChat = () => {
    const id = createConversation()
    setActiveConversation(id)
  }

  const handleClearKey = () => {
    if (confirm('Change your API key? This will return you to the setup screen.')) {
      localStorage.removeItem('nucleus_api_key')
      localStorage.removeItem('nucleus_tier')
      localStorage.removeItem('nucleus_model')
      router.push('/')
    }
  }

  if (!mounted) return null

  return (
    <div className="flex h-full w-full overflow-hidden" style={{ background: 'var(--bg-deep)' }}>
      {/* Subtle background — lower opacity in chat view */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <DNABackground />
      </div>

      {/* Neural grid overlay */}
      <div className="absolute inset-0 neural-grid pointer-events-none" />

      {/* Sidebar */}
      <div className="relative z-10 shrink-0">
        <Sidebar onNewChat={handleNewChat} />
      </div>

      {/* Main area */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0">
        <Header
          mode={mode}
          onModeChange={(m: Mode) => setMode(m)}
          onClearKey={handleClearKey}
          tier={tier}
        />

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          <MessageList
            messages={activeConversation?.messages ?? []}
            isStreaming={isStreaming}
          />
          <InputBar
            onSend={sendMessage}
            disabled={isStreaming}
            mode={mode}
          />
        </div>
      </div>
    </div>
  )
}
