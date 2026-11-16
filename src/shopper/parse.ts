import { cleanTitle } from '../../shared/shopper'

const LEADING_FILLER = /^(and|also|then|plus|oh|um|uh|some|a|an)\s+/i
const TRAILING_PUNCTUATION = /[.!?]+$/

function tidy(part: string): string | null {
  let text = part.trim().replace(TRAILING_PUNCTUATION, '')
  // Strip "and", "also", "some" etc. off the front, possibly stacked ("and some eggs").
  while (LEADING_FILLER.test(text)) text = text.replace(LEADING_FILLER, '')
  return cleanTitle(text)
}

/** "eggs, limes\nhot sauce" -> ["eggs", "limes", "hot sauce"] */
export function splitTyped(text: string): string[] {
  return text
    .split(/[,;\n]+/)
    .map(tidy)
    .filter((title): title is string => Boolean(title))
}

/**
 * One finalized speech segment (the recognizer ends a segment when you pause).
 * Also splits on commas and the spoken word "comma", in case the recognizer
 * or the speaker punctuates.
 */
export function splitSpoken(transcript: string): string[] {
  return splitTyped(transcript.replace(/\s+comma\b/gi, ',')).map((title) =>
    // Recognizers capitalize the first word ("Corn tortillas"); keep the list
    // lowercase, but leave acronyms like "AA batteries" alone.
    /^[A-Z][a-z]/.test(title) ? title[0]!.toLowerCase() + title.slice(1) : title,
  )
}
