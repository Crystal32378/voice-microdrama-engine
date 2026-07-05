# Browser ASR Usage

The `BrowserASRProvider` in `src/providers/asr.ts` is a placeholder. For actual browser-based speech recognition, use the Web Speech API directly on the client side.

## Example (client-side JavaScript)

```javascript
// Check if browser supports Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

if (!SpeechRecognition) {
  console.warn('Browser does not support Speech Recognition')
  // Fall back to MockASRProvider or text input
}

const recognition = new SpeechRecognition()
recognition.lang = 'zh-TW'  // or 'en-US', 'zh-CN', etc.
recognition.continuous = false
recognition.interimResults = false

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript
  console.log('Heard:', transcript)
  // Send transcript to LLM
}

recognition.onerror = (event) => {
  console.error('ASR error:', event.error)
}

// Start recording
recognition.start()

// Stop recording (e.g., on button release)
// recognition.stop()
```

## Integration with the engine

1. Record audio in the browser (or use SpeechRecognition directly)
2. Get transcript text
3. Send transcript to `llm.streamChat()` as a user message
4. Stream LLM response through `streamNarration()` for subtitles + TTS

See `src/engine/narrator.ts` for the narration pipeline.
