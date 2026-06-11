import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message, Conversation, Mode } from '@/types'
import { parseTags } from '@/lib/tagParser'
import { v4 as uuidv4 } from 'uuid'

interface ChatStore {
  conversations: Conversation[]
  activeConversationId: string | null
  mode: Mode
  isStreaming: boolean

  // Actions
  setMode: (mode: Mode) => void
  createConversation: () => string
  setActiveConversation: (id: string) => void
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'cleanContent' | 'tags'>) => string
  updateStreamingMessage: (conversationId: string, messageId: string, chunk: string) => void
  finaliseMessage: (conversationId: string, messageId: string) => void
  setIsStreaming: (value: boolean) => void
  deleteConversation: (id: string) => void
  getActiveConversation: () => Conversation | null
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      mode: 'chatty',
      isStreaming: false,

      setMode: (mode) => set({ mode }),

      createConversation: () => {
        const id = uuidv4()
        const conversation: Conversation = {
          id,
          title: 'New conversation',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [],
        }
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }))
        return id
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, messageData) => {
        const id = uuidv4()
        const { cleanContent, tags } = parseTags(messageData.content)
        const message: Message = { ...messageData, id, cleanContent, tags }

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  title:
                    conv.messages.length === 0 && messageData.role === 'user'
                      ? messageData.content.slice(0, 50)
                      : conv.title,
                  updatedAt: Date.now(),
                }
              : conv
          ),
        }))
        return id
      },

      updateStreamingMessage: (conversationId, messageId, chunk) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId
                      ? { ...msg, content: msg.content + chunk }
                      : msg
                  ),
                }
              : conv
          ),
        }))
      },

      finaliseMessage: (conversationId, messageId) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) => {
                    if (msg.id !== messageId) return msg
                    const { cleanContent, tags } = parseTags(msg.content)
                    return { ...msg, cleanContent, tags, isStreaming: false }
                  }),
                }
              : conv
          ),
        }))
      },

      setIsStreaming: (value) => set({ isStreaming: value }),

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        }))
      },

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get()
        return conversations.find((c) => c.id === activeConversationId) ?? null
      },
    }),
    {
      name: 'nucleusai-chat',
      partialize: (state) => ({
        conversations: state.conversations,
        mode: state.mode,
      }),
    }
  )
)
