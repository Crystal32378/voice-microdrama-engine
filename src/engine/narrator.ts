// Sentence Streaming Narrator
// Streams LLM output sentence-by-sentence, queues TTS for each.
//
// This is a simplified public version. Production has:
// - TTS semaphore (concurrency limiting)
// - TTS circuit breaker (429 handling)
// - Background TTS with player interrupt
// - Generation ID tracking for stale event discard

import { LLMProvider, ChatMessage } from '../providers/llm'
import { TTSProvider } from '../providers/tts'
import { detectEnding, isEnteringEndingBlock, EndingMeta } from './ending'

export interface NarrationResult {
  fullText: string
  isEnding: boolean
  meta?: EndingMeta
}

export interface NarrationCallbacks {
  onTextChunk?: (text: string, seq: number) => void
  onAudioChunk?: (audio: Buffer, seq: number) => void
  onEnding?: (meta: EndingMeta) => void
}

/**
 * Simple sentence splitter — splits on Chinese/English punctuation.
 */
export function splitIntoSentences(text: string): string[] {
  const parts = text.match(/[^，。！？；,!?;]+[，。！？；,!?;]?/g)
  if (!parts) return [text]

  const sentences: string[] = []
  let buffer = ''

  for (const part of parts) {
    buffer += part
    if (/[。！？.!?]/.test(part)) {
      const trimmed = buffer.trim()
      if (trimmed) sentences.push(trimmed)
      buffer = ''
    } else if (buffer.length >= 40) {
      const trimmed = buffer.trim()
      if (trimmed) sentences.push(trimmed)
      buffer = ''
    }
  }

  if (buffer.trim()) sentences.push(buffer.trim())
  return sentences.filter(s => s.length > 0)
}

/**
 * Stream narration: LLM streaming → sentence split → TTS per sentence.
 */
export async function streamNarration(
  llm: LLMProvider,
  tts: TTSProvider,
  messages: ChatMessage[],
  callbacks: NarrationCallbacks,
  options?: { signal?: AbortSignal },
): Promise<NarrationResult> {
  let buffer = ''
  let fullText = ''
  let seq = 0
  let isEnding = false
  let endingMeta: EndingMeta | undefined
  let endingBlockStarted = false

  const flushSentence = (sentence: string) => {
    const trimmed = sentence.trim()
    if (!trimmed || endingBlockStarted) return

    const { content, isEnding: ending, meta } = detectEnding(trimmed)
    if (ending) {
      isEnding = true
      endingMeta = meta
    }

    const cleanSentence = content
    if (!cleanSentence) return

    const currentSeq = seq++

    // Emit text chunk (subtitle)
    callbacks.onTextChunk?.(cleanSentence, currentSeq)

    // Queue TTS (fire and forget for demo simplicity)
    tts.synthesize(cleanSentence).then(result => {
      if (result.buffer && result.buffer.length > 0) {
        callbacks.onAudioChunk?.(result.buffer, currentSeq)
      }
    }).catch(err => {
      console.error('[TTS error]', err)
    })
  }

  await llm.streamChat(
    messages,
    (delta) => {
      buffer += delta
      fullText += delta

      // Check for ending block
      if (!endingBlockStarted && isEnteringEndingBlock(fullText)) {
        endingBlockStarted = true
        // Flush any pre-ending text
        const endIdx = fullText.indexOf('[[')
        const metaIdx = fullText.indexOf('META:')
        let cutIdx = Math.min(
          endIdx >= 0 ? endIdx : Infinity,
          metaIdx >= 0 ? metaIdx : Infinity,
        )
        if (cutIdx === Infinity) cutIdx = fullText.length
        const preEnding = buffer.slice(0, cutIdx)
        if (preEnding.trim()) {
          const sentences = splitIntoSentences(preEnding)
          for (const s of sentences) flushSentence(s)
        }
        buffer = ''
        return
      }

      if (endingBlockStarted) return

      // Split and flush sentences
      const sentences = splitIntoSentences(buffer)
      if (sentences.length > 1) {
        for (let i = 0; i < sentences.length - 1; i++) {
          flushSentence(sentences[i])
        }
        buffer = sentences[sentences.length - 1]
      }
    },
    { signal: options?.signal },
  )

  // Flush remaining buffer
  if (!endingBlockStarted && buffer.trim()) {
    flushSentence(buffer)
  }

  // Final ending parse
  if (endingBlockStarted) {
    const { isEnding: detected, meta } = detectEnding(fullText)
    if (detected) {
      isEnding = true
      endingMeta = meta
    }
  }

  if (isEnding && endingMeta) {
    callbacks.onEnding?.(endingMeta)
  }

  return { fullText, isEnding, meta: endingMeta }
}
