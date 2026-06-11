import { useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { detectMode } from '@/lib/modeDetector'
import { v4 as uuidv4 } from 'uuid'

export function useChat() {
  const {
    conversations,
    activeConversationId,
    mode,
    isStreaming,
    setMode,
    createConversation,
    setActiveConversation,
    addMessage,
    updateStreamingMessage,
    finaliseMessage,
    setIsStreaming,
    getActiveConversation,
  } = useChatStore()

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return

      // Detect mode from message
      const detected = detectMode(content)
      if (detected.confidence > 0.7) {
        setMode(detected.mode)
      }

      // Get or create conversation
      let convId = activeConversationId
      if (!convId) {
        convId = createConversation()
      }

      const conversation = getActiveConversation()
      const history = (conversation?.messages ?? []).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      // Add user message
      addMessage(convId, {
        role: 'user',
        content,
        mode,
        timestamp: Date.now(),
      })

      // Add empty assistant message for streaming
      const assistantId = uuidv4()
      addMessage(convId, {
        role: 'assistant',
        content: '',
        mode,
        timestamp: Date.now(),
        isStreaming: true,
      })

      setIsStreaming(true)

      try {
        const apiKey = typeof window !== 'undefined' ? localStorage.getItem('nucleus_api_key') ?? '' : ''
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({
            messages: [...history, { role: 'user', content }],
            mode,
          }),
        })

        if (!response.ok) throw new Error('API request failed')
        if (!response.body) throw new Error('No response body')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        // Get the real assistant message id (last message in conversation)
        const conv = useChatStore.getState().getActiveConversation()
        const lastMsg = conv?.messages[conv.messages.length - 1]
        const msgId = lastMsg?.id ?? assistantId

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value)
          const lines = text.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  updateStreamingMessage(convId!, msgId, parsed.text)
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        }

        finaliseMessage(convId!, msgId)
      } catch (error) {
        console.error('Send message error:', error)
        finaliseMessage(convId!, assistantId)
      } finally {
        setIsStreaming(false)
      }
    },
    [
      activeConversationId,
      isStreaming,
      mode,
      setMode,
      createConversation,
      getActiveConversation,
      addMessage,
      updateStreamingMessage,
      finaliseMessage,
      setIsStreaming,
    ]
  )

  return {
    conversations,
    activeConversationId,
    mode,
    isStreaming,
    setMode,
    setActiveConversation,
    createConversation,
    sendMessage,
    activeConversation: getActiveConversation(),
  }
}
