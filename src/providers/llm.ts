// LLM Provider Abstraction
// Modular layer for swapping LLM backends: mock | fireworks | amd (OpenAI-compatible)
//
// The public demo defaults to MockLLMProvider so it runs without any API keys.
// Real providers can be enabled via .env (LLM_PROVIDER=fireworks | amd).

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMProvider {
  /** Stream a chat completion. Calls onChunk for each text delta. Returns full text. */
  streamChat(
    messages: ChatMessage[],
    onChunk: (delta: string) => void,
    options?: { signal?: AbortSignal; temperature?: number },
  ): Promise<string>
}

// ====== Factory ======

export function createLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || 'mock'
  switch (provider) {
    case 'fireworks':
      return new FireworksProvider()
    case 'amd':
      return new AMDProvider()
    case 'mock':
    default:
      return new MockLLMProvider()
  }
}

// ====== Mock Provider (default — no API key needed) ======

const MOCK_NARRATIONS = [
  '你睜開眼，發現自己身處一個陌生的房間。空氣中瀰漫著一股古老的氣息，牆上掛著你從未見過的畫像。',
  '遠處傳來鐘聲，一下、兩下、三下。你意識到，這不是夢。你真的來到了這裡。',
  '一個聲音在耳邊響起：「歡迎來到你的新人生。」你轉頭，卻看不見任何人。',
  '門外的腳步聲越來越近。你會打開門，還是躲起來？',
  '你的選擇將決定這段人生的走向。每一次開口，都是一次命運的擲骰。',
]

export class MockLLMProvider implements LLMProvider {
  async streamChat(
    messages: ChatMessage[],
    onChunk: (delta: string) => void,
    options?: { signal?: AbortSignal },
  ): Promise<string> {
    // Pick a narration based on message count (deterministic for demo)
    const idx = (messages.length - 1) % MOCK_NARRATIONS.length
    const text = MOCK_NARRATIONS[idx]

    // Simulate streaming by emitting word by word
    const words = text.split('')
    for (const word of words) {
      if (options?.signal?.aborted) break
      await new Promise(r => setTimeout(r, 30))  // 30ms per char
      onChunk(word)
    }

    return text
  }
}

// ====== Fireworks Provider (AMD-compatible, recommended for hackathon) ======

export class FireworksProvider implements LLMProvider {
  private apiKey = process.env.FIREWORKS_API_KEY
  private model = process.env.FIREWORKS_MODEL || 'accounts/fireworks/models/llama-v3-70b-instruct'
  private baseURL = 'https://api.fireworks.ai/inference/v1'

  async streamChat(
    messages: ChatMessage[],
    onChunk: (delta: string) => void,
    options?: { signal?: AbortSignal; temperature?: number },
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('FIREWORKS_API_KEY not set. Set LLM_PROVIDER=mock or provide a key.')
    }

    // OpenAI-compatible streaming endpoint
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: true,
        temperature: options?.temperature ?? 0.9,
      }),
      signal: options?.signal,
    })

    if (!response.ok) {
      throw new Error(`Fireworks API error: ${response.status} ${await response.text()}`)
    }

    // Parse SSE stream
    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') continue
        try {
          const obj = JSON.parse(data)
          const delta = obj?.choices?.[0]?.delta?.content || ''
          if (delta) {
            fullText += delta
            onChunk(delta)
          }
        } catch {
          // skip malformed lines
        }
      }
    }

    return fullText
  }
}

// ====== AMD / OpenAI-compatible Provider ======

export class AMDProvider implements LLMProvider {
  private apiKey = process.env.OPENAI_API_KEY
  private baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  private model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  async streamChat(
    messages: ChatMessage[],
    onChunk: (delta: string) => void,
    options?: { signal?: AbortSignal; temperature?: number },
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not set. Set LLM_PROVIDER=mock or provide a key.')
    }

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: true,
        temperature: options?.temperature ?? 0.9,
      }),
      signal: options?.signal,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`)
    }

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') continue
        try {
          const obj = JSON.parse(data)
          const delta = obj?.choices?.[0]?.delta?.content || ''
          if (delta) {
            fullText += delta
            onChunk(delta)
          }
        } catch {
          // skip
        }
      }
    }

    return fullText
  }
}
