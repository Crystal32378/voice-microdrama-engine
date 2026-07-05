# Browser TTS Usage

The `BrowserTTSProvider` in `src/providers/tts.ts` is a placeholder. For actual browser-based text-to-speech, use the `speechSynthesis` API directly on the client side.

## Example (client-side JavaScript)

```javascript
// Check if browser supports speech synthesis
if (!('speechSynthesis' in window)) {
  console.warn('Browser does not support speech synthesis')
  // Fall back to MockTTSProvider (text-only mode)
}

// Simple TTS
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-TW'  // or 'en-US', etc.
  utterance.rate = 1.0
  utterance.pitch = 1.0

  // Optional: pick a voice
  const voices = speechSynthesis.getVoices()
  const zhVoice = voices.find(v => v.lang.startsWith('zh'))
  if (zhVoice) utterance.voice = zhVoice

  speechSynthesis.speak(utterance)
}

// Queue multiple sentences (they play sequentially by default)
function speakSentences(sentences) {
  sentences.forEach((s, i) => {
    setTimeout(() => speak(s), i * 100)  // small delay between sentences
  })
}

// Stop all speech (e.g., when player interrupts)
function stopSpeaking() {
  speechSynthesis.cancel()
}
```

## Integration with the engine

The `streamNarration()` function in `src/engine/narrator.ts` calls `tts.synthesize(text)` for each sentence. For browser TTS:

1. Override the `onTextChunk` callback to call `speak(text)` directly
2. Or implement a custom `TTSProvider` that wraps `speechSynthesis`

```javascript
import { streamNarration } from './src/engine/narrator'
import { createLLMProvider } from './src/providers/llm'
import { MockTTSProvider } from './src/providers/tts'

const llm = createLLMProvider()
const tts = new MockTTSProvider()  // server-side returns null

await streamNarration(llm, tts, messages, {
  onTextChunk: (text, seq) => {
    // Display subtitle
    document.getElementById('subtitle').textContent = text
    // Speak via browser TTS
    speak(text)
  },
  onEnding: (meta) => {
    // Show ending card
    showEndingCard(meta)
  },
})
```
