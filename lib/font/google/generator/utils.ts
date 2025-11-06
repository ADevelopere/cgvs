import { GoogleFontItem, GoogleFontList } from "../types";

/**
 * Parses a Google Fonts API JSON response string and organizes fonts by subset.
 *
 * @param jsonString - The raw JSON string from the Google Fonts API.
 * @returns A Map where each key is a subset name (e.g., "latin", "cyrillic")
 * and the value is an array of GoogleFontItem objects that support that subset.
 */
export function processFontList(jsonString: string): Map<string, GoogleFontItem[]> {
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
