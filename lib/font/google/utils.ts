import { FontSubset, Language } from "./enum";
import { googleFontSubsetMap } from "./googleFontSubsetMap.const";
import { languageSubsetMap } from "./languageSubsetMap";
import { GoogleFontItem } from "./types";
import { googleFontFamilyMap } from "./fontFamily.map";
import { FontFamily } from "./fontFamily.enum";

/**
 * Get the required font subsets for a given language
 * @param language - The language enum key
 * @returns Array of FontSubset enums required for the language
 */
export function getLanguageSubsets(language: Language): FontSubset[] {
  return languageSubsetMap[language] ?? [FontSubset.LATIN];
}

/**
 * Get the required font subsets for a given language as string values
 * @param language - The language enum key
 * @returns Array of subset string values required for the language
 */
export function getLanguageSubsetValues(language: Language): string[] {
  return getLanguageSubsets(language).map(subset => subset);
}

/**
 * Get all available Google Font items that support a given language
 * Returns a deduplicated array of fonts from all required subsets for the language
 * @param language - The language enum key
 * @returns Array of GoogleFontItem objects that support the language
 */
export function getLanguageFonts(language: Language): GoogleFontItem[] {
  const subsets = getLanguageSubsets(language);
  const fontMap = new Map<string, GoogleFontItem>();

  // Collect fonts from all required subsets and deduplicate by family name
  for (const subset of subsets) {
    const subsetKey = subset as keyof typeof googleFontSubsetMap;
    const fonts = googleFontSubsetMap[subsetKey];

    if (fonts) {
      for (const font of fonts) {
        // Use family name as unique key to avoid duplicates
        if (!fontMap.has(font.family)) {
          fontMap.set(font.family, font);
        }
      }
    }
  }

  return Array.from(fontMap.values());
}

/**
 * Get a Google Font by its family name using type-safe enum
 * @param family - The FontFamily enum value
 * @returns The GoogleFontItem for that family, or undefined if not found
 */
export function getFontByFamily(family: FontFamily): GoogleFontItem | undefined {
  return googleFontFamilyMap[family];
}
