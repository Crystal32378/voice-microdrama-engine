// ASR Provider Abstraction
// Modular layer for swapping ASR backends: mock | browser
//
// The public demo defaults to MockASRProvider so it runs without any API keys.
// Browser provider uses the Web Speech API (client-side, no key needed).

export interface ASRProvider {
  /** Transcribe audio to text. audioBase64 is base64-encoded audio. */
  transcribe(audioBase64: string, mimeType: string): Promise<string>
}

// ====== Factory ======

export function createASRProvider(): ASRProvider {
  const provider = process.env.ASR_PROVIDER || 'mock'
  switch (provider) {
    case 'browser':
      return new BrowserASRProvider()
    case 'mock':
    default:
      return new MockASRProvider()
  }
}

// ====== Mock Provider (default — no API key needed) ======

const MOCK_TRANSCRIPTIONS = [
  '我想先看看四周的環境。',
  '我會選擇謹慎行事，先觀察一下。',
  '這聽起來很有趣，我想試試看。',
  '讓我想一想，再決定下一步。',
  '我覺得應該先找到更多線索。',
]

export class MockASRProvider implements ASRProvider {
  async transcribe(_audioBase64: string, _mimeType: string): Promise<string> {
    // Simulate latency
    await new Promise(r => setTimeout(r, 500))
    // Return a deterministic mock transcription
    const idx = Math.floor(Date.now() / 1000) % MOCK_TRANSCRIPTIONS.length
    return MOCK_TRANSCRIPTIONS[idx]
  }
}

// ====== Browser Provider (Web Speech API, client-side) ======
// Note: This provider is intended to be called from the browser, not the server.
// The server-side interface is kept for API consistency, but actual browser
// speech recognition should be done client-side via the Web Speech API directly.

export class BrowserASRProvider implements ASRProvider {
  async transcribe(_audioBase64: string, _mimeType: string): Promise<string> {
    throw new Error(
      'BrowserASRProvider should be used client-side via Web Speech API directly. ' +
      'See examples/browser-asr.md for usage.'
    )
  }
}
