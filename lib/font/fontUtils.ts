import { FontFamily, getFontByFamily } from "./google";

/**
 * Fetches a single font file and converts it to a base64 data URL.
 * @param url - The URL of the font file to fetch.
 * @returns A promise that resolves to the base64 data URL.
 */
async function fetchFontAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    // Assuming ttf, but woff2 is more common for web. This is a simplification.
    return `data:font/ttf;base64,${base64}`;
  } catch (error) {
    console.error(`Error fetching font from ${url}:`, error);
    throw error;
  }
}

/**
 * Creates a <style> tag with embedded @font-face rules for the given font families.
 * Fetches only the "regular" variant for each font family.
 * @param fontFamilies - An array of font family names to embed.
 * @returns A promise that resolves to a string containing the <style> tag.
 */
export async function embedGoogleFonts(fontFamilies: FontFamily[]): Promise<string> {
  const fontFaceRules = await Promise.all(
    fontFamilies.map(async family => {
      const fontItem = getFontByFamily(family);
      if (!fontItem) {
        console.warn(`Font family "${family}" not found.`);
        return "";
      }

      // Prioritize "regular" variant, otherwise take the first available.
      const fontUrl = fontItem.files.regular || Object.values(fontItem.files)[0];
      if (!fontUrl) {
        console.warn(`No font file found for family "${family}".`);
        return "";
      }

      try {
        const base64Url = await fetchFontAsBase64(fontUrl);
        return `
          @font-face {
            font-family: "${family}";
            src: url(${base64Url}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `;
      } catch {
        return ""; // Return empty string if a font fails to load
      }
    })
  );

  return `<style>${fontFaceRules.join("")}</style>`;
}
