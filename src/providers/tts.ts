// TTS Provider Abstraction
// Modular layer for swapping TTS backends: mock | browser
//
// The public demo defaults to MockTTSProvider (text-only mode, no audio).
// Browser provider uses speechSynthesis API (client-side, no key needed).

export interface TTSResult {
  buffer: Buffer | null  // null = no audio (text-only mode)
  provider: string
}

export interface TTSProvider {
  /** Synthesize text to speech. Returns buffer (or null for text-only). */
  synthesize(text: string): Promise<TTSResult>
}

// ====== Factory ======

export function createTTSProvider(): TTSProvider {
  const provider = process.env.TTS_PROVIDER || 'mock'
  switch (provider) {
    case 'browser':
      return new BrowserTTSProvider()
    case 'mock':
    default:
      return new MockTTSProvider()
  }
}

// ====== Mock Provider (default — text-only, no audio) ======

export class MockTTSProvider implements TTSProvider {
  async synthesize(_text: string): Promise<TTSResult> {
    // Simulate latency
    await new Promise(r => setTimeout(r, 200))
    return { buffer: null, provider: 'mock' }
  }
}

// ====== Browser Provider (speechSynthesis API, client-side) ======
// Note: This provider is intended to be called from the browser.
// Server-side calls will return null; client should use speechSynthesis directly.

export class BrowserTTSProvider implements TTSProvider {
  async synthesize(_text: string): Promise<TTSResult> {
    // Server-side: return null (client should use speechSynthesis directly)
    // See examples/browser-tts.md for client-side usage
    return { buffer: null, provider: 'browser' }
  }
}
