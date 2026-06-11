import { anthropic, CLAUDE_MODEL, MAX_TOKENS } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/systemPrompt'
import { detectMode } from '@/lib/modeDetector'
import type { Mode } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { messages, mode: clientMode } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages required', { status: 400 })
    }

    // Detect mode from last user message or use client-provided mode
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    const detectedMode = clientMode ?? detectMode(lastUserMessage?.content ?? '').mode
    const mode: Mode = detectedMode

    const systemPrompt = buildSystemPrompt(mode)

    const stream = anthropic.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({ text: chunk.delta.text })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
