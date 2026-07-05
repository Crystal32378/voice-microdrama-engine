// Ending Card Parser
// Detects [[END]] + META:{...} signal from LLM output, parses to ending card.
//
// This is a simplified public version. Production has more robust parsing
// with brace-matching, fallback endings, and forced ending on max turn.

export interface EndingMeta {
  title: string
  endingType: string  // "好結局" | "壞結局" | "懸念結局"
  verdict: string
}

export const FALLBACK_ENDING: EndingMeta = {
  title: '未完的篇章',
  endingType: '懸念結局',
  verdict: '故事在這裡斷了線',
}

/**
 * Detect ending signal in text.
 * Returns { content, isEnding, meta } — content has [[END]]/META stripped.
 */
export function detectEnding(text: string): {
  content: string
  isEnding: boolean
  meta?: EndingMeta
} {
  const hasEndMarker = text.includes('[[END]]')
  const hasMetaMarker = text.includes('META:')

  if (!hasEndMarker && !hasMetaMarker) {
    return { content: text, isEnding: false }
  }

  let content = text
  let meta: EndingMeta | undefined

  // Try to parse META JSON
  if (hasMetaMarker) {
    const metaStart = text.indexOf('META:')
    const afterMeta = text.slice(metaStart + 5).trim()
    const braceStart = afterMeta.indexOf('{')
    if (braceStart !== -1) {
      // Simple brace matching
      let depth = 0
      let braceEnd = -1
      for (let i = braceStart; i < afterMeta.length; i++) {
        if (afterMeta[i] === '{') depth++
        else if (afterMeta[i] === '}') {
          depth--
          if (depth === 0) { braceEnd = i; break }
        }
      }
      if (braceEnd !== -1) {
        const jsonStr = afterMeta.slice(braceStart, braceEnd + 1)
        try {
          const parsed = JSON.parse(jsonStr)
          if (parsed?.title && parsed?.endingType && parsed?.verdict) {
            meta = parsed
          }
        } catch {
          // JSON parse failed — will use fallback
        }
      }
    }
    content = text.slice(0, metaStart)
  }

  // Strip [[END]]
  if (hasEndMarker) {
    content = content.replace(/\[\[END\]\]/g, '')
  }

  content = content.trim()

  return {
    content,
    isEnding: true,
    meta: meta || FALLBACK_ENDING,
  }
}

/**
 * Check if text contains ending markers (for streaming detection).
 */
export function isEnteringEndingBlock(text: string): boolean {
  return text.includes('[[END]]') || text.includes('META:')
}
