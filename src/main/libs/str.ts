import { char_width } from './east_asian_with'

const segmenter = new Intl.Segmenter()
const defaultIgnorableCodePointRegex = /^\p{Default_Ignorable_Code_Point}$/u
export function getStrWidth(text: string): number {
  text = (text || '').trim()
  let width = 0
  for (const { segment: character } of segmenter.segment(text)) {
    const codePoint = character.codePointAt(0)
    // Ignore control characters
    if (codePoint <= 0x1f || (codePoint >= 0x7f && codePoint <= 0x9f)) {
      continue
    }
    // Ignore zero-width characters
    if (
      (codePoint >= 0x20_0b && codePoint <= 0x20_0f) || // Zero-width space, non-joiner, joiner, left-to-right mark, right-to-left mark
      codePoint === 0xfe_ff // Zero-width no-break space
    ) {
      continue
    }

    // Ignore combining characters
    if (
      (codePoint >= 0x3_00 && codePoint <= 0x3_6f) || // Combining diacritical marks
      (codePoint >= 0x1a_b0 && codePoint <= 0x1a_ff) || // Combining diacritical marks extended
      (codePoint >= 0x1d_c0 && codePoint <= 0x1d_ff) || // Combining diacritical marks supplement
      (codePoint >= 0x20_d0 && codePoint <= 0x20_ff) || // Combining diacritical marks for symbols
      (codePoint >= 0xfe_20 && codePoint <= 0xfe_2f) // Combining half marks
    ) {
      continue
    }

    // Ignore surrogate pairs
    if (codePoint >= 0xd8_00 && codePoint <= 0xdf_ff) {
      continue
    }

    // Ignore variation selectors
    if (codePoint >= 0xfe_00 && codePoint <= 0xfe_0f) {
      continue
    }

    // This covers some of the above cases, but we still keep them for performance reasons.
    if (defaultIgnorableCodePointRegex.test(character)) {
      continue
    }

    width += char_width(codePoint)
  }
  return width
}
