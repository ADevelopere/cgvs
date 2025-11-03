import { FontSubset, Language } from "./enum";

/**
 * Represents a single font item from the Google Fonts API JSON list.
 * This is the type you asked for to represent any item in the `items` array.
 * example
 *     {
      "family": "Cairo",
      "variants": [
        "200",
        "300",
        "regular",
        "500",
        "600",
        "700",
        "800",
        "900"
      ],
      "subsets": [
        "arabic",
        "latin",
        "latin-ext"
      ],
      "version": "v31",
      "lastModified": "2025-09-16",
      files: {
        200: "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hGA-W1ToLQ-HmkA.ttf",
        300: "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hL4-W1ToLQ-HmkA.ttf",
        regular: "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-W1ToLQ-HmkA.ttf",
        500: "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hNI-W1ToLQ-HmkA.ttf",
        600: "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hD45W1ToLQ-HmkA.ttf",
        700: "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5W1ToLQ-HmkA.ttf",
        800: "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hGA5W1ToLQ-HmkA.ttf",
        900: "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hEk5W1ToLQ-HmkA.ttf"
      },
      "category": "sans-serif",
      "kind": "webfonts#webfont",
      "menu": "https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-a1XiKQ.ttf"
    },
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
  colorCapabilities?: string[];
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
 * Type mapping language keys to their required font subsets
 */
export type LanguageSubsetMap = Record<Language, FontSubset[]>;
