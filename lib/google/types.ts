/**
 * Represents a single font item from the Google Fonts API JSON list.
 * This is the type you asked for to represent any item in the `items` array.
 */
export interface GoogleFontItem {
  /** The font family name (e.g., "ABeeZee", "Zilla Slab"). */
  family: string;

  /** An array of available font variants (e.g., "regular", "italic", "700", "700italic"). */
  variants: string[];

  /** An array of available character subsets (e.g., "latin", "latin-ext"). */
  subsets: string[];

  /** The version of the font (e.g., "v23"). */
  version: string;

  /** The date the font was last modified, in "YYYY-MM-DD" format. */
  lastModified: string;

  /**
   * An object where keys are variant names (like "regular" or "500italic")
   * and values are the URL strings pointing to the corresponding font file (.ttf).
   */
  files: {
    [variant: string]: string;
  };

  /** The font category (e.g., "sans-serif", "serif"). */
  category: string;

  /** The kind identifier, typically "webfonts#webfont" for items. */
  kind: "webfonts#webfont";

  /** A URL string pointing to a menu subset of the font. */
  menu: string;
}

/**
 * Represents the entire top-level object of the Google Fonts API response.
 */
export interface GoogleFontList {
  /** The kind identifier, typically "webfonts#webfontList" for the list. */
  kind: "webfonts#webfontList";

  /** An array of font items, each conforming to the GoogleFontItem interface. */
  items: GoogleFontItem[];
}

/**
 * Parses a Google Fonts API JSON response string and organizes fonts by subset.
 *
 * @param jsonString - The raw JSON string from the Google Fonts API.
 * @returns A Map where each key is a subset name (e.g., "latin", "cyrillic")
 * and the value is an array of GoogleFontItem objects that support that subset.
 */
export function processFontList(
  jsonString: string
): Map<string, GoogleFontItem[]> {
  // 1. Parse the JSON string into our GoogleFontList type
  const fontList: GoogleFontList = JSON.parse(jsonString);

  // 2. Create the subset map to store the results
  const subsetMap = new Map<string, GoogleFontItem[]>();

  if (fontList && fontList.items) {
    // 3. Process each font item in the list
    for (const item of fontList.items) {
      if (item && item.subsets) {
        // 4. For each subset that the font supports...
        for (const subset of item.subsets) {
          // Check if this subset is already in the map
          if (!subsetMap.has(subset)) {
            // If not, add it with an empty array
            subsetMap.set(subset, []);
          }

          // 5. Push the current font item into that subset's array
          // We can use the non-null assertion (!) because we just created the array if it was missing.
          subsetMap.get(subset)!.push(item);
        }
      }
    }
  }

  // 6. Return the completed map
  return subsetMap;
}
