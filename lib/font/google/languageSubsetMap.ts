import { LanguageSubsetMap } from "./types";
import { FontSubset, Language } from "./enum";

/**
 * Hardcoded mapping of languages to their required font subsets.
 *
 * This revised map aims for maximum robustness.
 *
 * LOGIC:
 * 1. CJK Languages (Chinese, Japanese, Korean):
 * - Mapped to their specific subset + 'latin'.
 * - These fonts are monolithic and bundle their own Latin characters.
 * - Requiring 'latin-ext' might incorrectly filter out valid CJK fonts.
 * 2. Latin-based Languages (English, Spanish, French, Polish, etc.):
 * - Mapped to 'latin' and 'latin-ext' to cover all characters.
 * 3. All Other Languages (Arabic, Hindi, Greek, Russian, etc.):
 * - Mapped to their specific script subset(s) + 'latin' + 'latin-ext'.
 * - This ensures they can render their own script, plus basic Latin (for URLs,
 * brand names) and extended Latin (for transliteration, loanwords).
 */
export const languageSubsetMap: LanguageSubsetMap = {
  // Latin-based
  [Language.ENGLISH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.SPANISH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.FRENCH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.GERMAN]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.ITALIAN]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.PORTUGUESE]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.TURKISH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.POLISH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.CZECH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.DUTCH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.SWEDISH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.NORWEGIAN]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.DANISH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.FINNISH]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.HUNGARIAN]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.ROMANIAN]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.CROATIAN]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.SLOVAK]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.SLOVENE]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.ESTONIAN]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.LATVIAN]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.LITHUANIAN]: [FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.VIETNAMESE]: [
    FontSubset.VIETNAMESE,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],

  // CJK (Special case)
  [Language.CHINESE_SIMPLIFIED]: [
    FontSubset.CHINESE_SIMPLIFIED,
    FontSubset.LATIN,
  ],
  [Language.CHINESE_TRADITIONAL]: [
    FontSubset.CHINESE_TRADITIONAL,
    FontSubset.LATIN,
  ],
  [Language.CHINESE_HONGKONG]: [FontSubset.CHINESE_HONGKONG, FontSubset.LATIN],
  [Language.JAPANESE]: [FontSubset.JAPANESE, FontSubset.LATIN],
  [Language.KOREAN]: [FontSubset.KOREAN, FontSubset.LATIN],

  // Cyrillic-based
  [Language.RUSSIAN]: [
    FontSubset.CYRILLIC,
    FontSubset.CYRILLIC_EXT,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.UKRAINIAN]: [
    FontSubset.CYRILLIC,
    FontSubset.CYRILLIC_EXT,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.BULGARIAN]: [
    FontSubset.CYRILLIC,
    FontSubset.CYRILLIC_EXT,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.SERBIAN]: [
    FontSubset.CYRILLIC,
    FontSubset.CYRILLIC_EXT, // Added for completeness
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.MONGOLIAN]: [
    FontSubset.MONGOLIAN,
    FontSubset.CYRILLIC,
    FontSubset.CYRILLIC_EXT,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],

  // Indic
  [Language.HINDI]: [
    FontSubset.DEVANAGARI,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.MARATHI]: [
    FontSubset.DEVANAGARI,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.BENGALI]: [
    FontSubset.BENGALI,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.PUNJABI]: [
    FontSubset.GURMUKHI,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.TAMIL]: [
    FontSubset.TAMIL,
    FontSubset.TAMIL_SUPPLEMENT, // Kept from original, assuming it's in your enum
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.TELUGU]: [
    FontSubset.TELUGU,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.GUJARATI]: [
    FontSubset.GUJARATI,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.KANNADA]: [
    FontSubset.KANNADA,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.MALAYALAM]: [
    FontSubset.MALAYALAM,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],

  // Middle Eastern / Arabic Script
  [Language.ARABIC]: [
    FontSubset.ARABIC,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.URDU]: [FontSubset.ARABIC, FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.PERSIAN]: [
    FontSubset.ARABIC,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.HEBREW]: [
    FontSubset.HEBREW,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],

  // Other
  [Language.THAI]: [FontSubset.THAI, FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.GREEK]: [
    FontSubset.GREEK,
    FontSubset.GREEK_EXT,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.ARMENIAN]: [
    FontSubset.ARMENIAN,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.GEORGIAN]: [
    FontSubset.GEORGIAN,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.BURMESE]: [
    FontSubset.MYANMAR,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.KHMER]: [FontSubset.KHMER, FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.LAO]: [FontSubset.LAO, FontSubset.LATIN, FontSubset.LATIN_EXT],
  [Language.SINHALA]: [
    FontSubset.SINHALA,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.ETHIOPIC]: [
    FontSubset.ETHIOPIC,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.CHEROKEE]: [
    FontSubset.CHEROKEE,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
  [Language.TIBETAN]: [
    FontSubset.TIBETAN,
    FontSubset.LATIN,
    FontSubset.LATIN_EXT,
  ],
};

