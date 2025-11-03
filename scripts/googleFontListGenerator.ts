import { config } from "dotenv";
import { resolve, join } from "path";
import { existsSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { logger } from "@/lib/simpleLogger";

// --- 1. Load Environment Variables ---
// Loads .env file from the root directory (one level up from /scripts)
try {
  config({ path: resolve(__dirname, "../.env") });
} catch (error) {
  logger.error(
    "Failed to load .env file. Make sure it exists in the root directory.",
    error
  );
  process.exit(1);
}

const API_KEY = process.env.GOOGLE_FONTS_API_KEY;

// --- 2. Define Types ---

/**
 * Represents a single font item from the Google Fonts API response.
 */
interface GoogleFontItem {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: string;
  kind: string;
}

/**
 * The expected structure of the API response.
 */
interface GoogleFontsApiResponse {
  kind: "webfonts#webfontList";
  items: GoogleFontItem[];
}

/**
 * The general type for our generated font lists.
 */
export type GoogleFontList = string[];

// --- 3. Configuration ---

// The directory where the generated files will be saved.
// This resolves to `../client/lib/google-fonts-by-lang`
const OUTPUT_DIR = resolve(__dirname, "../client/lib/google-fonts-by-lang");

// --- 4. Helper Functions ---

/**
 * Fetches the complete font list from the Google Fonts API.
 * @param apiKey The Google Fonts API key.
 * @returns A promise that resolves to the list of font items.
 */
async function fetchFontList(apiKey: string): Promise<GoogleFontItem[]> {
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`;
  logger.log("Fetching font list from Google Fonts API...");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }
    const data: GoogleFontsApiResponse = await response.json();
    logger.log(`Successfully fetched ${data.items.length} font families.`);
    return data.items;
  } catch (error) {
    logger.error("Error fetching font list:", error);
    throw error;
  }
}

/**
 * Processes the raw font list into a map of languages (subsets) to font families.
 * @param fontItems The list of font items from the API.
 * @returns A Map where keys are language subsets (e.g., "arabic")
 * and values are arrays of font family names.
 */
function processFontData(fontItems: GoogleFontItem[]): Map<string, string[]> {
  const languageMap = new Map<string, string[]>();

  for (const font of fontItems) {
    const family = font.family;
    for (const subset of font.subsets) {
      if (!languageMap.has(subset)) {
        languageMap.set(subset, []);
      }
      languageMap.get(subset)!.push(family);
    }
  }

  // Sort the font names within each language list
  for (const [_language, fonts] of languageMap.entries()) {
    fonts.sort();
  }

  logger.log(
    `Processed fonts into ${languageMap.size} language (subset) categories.`
  );
  return languageMap;
}

/**
 * Sanitizes a language subset name (e.g., "latin-ext") into a
 * valid TypeScript variable name (e.g., "latinExt").
 * @param subsetName The name of the language subset.
 * @returns A sanitized string for filenames and variable names.
 */
function sanitizeName(subsetName: string): string {
  // Replaces hyphens with underscores, then converts to camelCase
  // e.g., "chinese-hongkong" -> "chinese_hongkong" -> "chineseHongkong"
  return subsetName
    .replace(/-/g, "_")
    .replace(/_([a-z])/g, g => g[1].toUpperCase());
}

/**
 * Writes the processed language-to-font map into individual .ts files.
 * @param languageMap The map of languages to font lists.
 * @param outputDir The directory to write the files to.
 */
function writeFontFiles(languageMap: Map<string, string[]>, outputDir: string) {
  logger.log(`Preparing to write files to: ${outputDir}`);

  // 1. Clean and create the output directory
  if (existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true, force: true });
    logger.log("Cleared existing output directory.");
  }
  mkdirSync(outputDir, { recursive: true });
  logger.log("Created output directory.");

  // 2. Write the shared 'types.ts' file
  const typesContent = `/**
 * A general type for a list of Google Font family names.
 */
export type GoogleFontList = string[];
`;
  writeFileSync(join(outputDir, "types.ts"), typesContent, "utf-8");

  // 3. Write each language file and prepare the 'index.ts' exports
  const indexExportLines: string[] = [];
  indexExportLines.push("export * from './types';\n"); // Export the type

  for (const [language, fonts] of languageMap.entries()) {
    const fileName = sanitizeName(language);
    const variableName = `${fileName}Fonts`;

    const fileContent = `import type { GoogleFontList } from './types';

/**
 * A list of Google Font families that support the "${language}" subset.
 */
export const ${variableName}: GoogleFontList = [
${fonts.map(font => `  '${font.replace(/'/g, "\\'")}'`).join(",\n")}
];
`;
    writeFileSync(join(outputDir, `${fileName}.ts`), fileContent, "utf-8");
    indexExportLines.push(`export * from './${fileName}';`);
  }

  // 4. Write the 'index.ts' barrel file
  writeFileSync(
    join(outputDir, "index.ts"),
    indexExportLines.join("\n"),
    "utf-8"
  );

  logger.log(
    `Successfully generated ${languageMap.size} font files and index.`
  );
}

// --- 5. Main Execution ---

/**
 * Main function to run the script.
 */
async function main() {
  logger.log("Starting Google Font list generator script...");

  if (!API_KEY) {
    logger.error(
      "ERROR: GOOGLE_FONTS_API_KEY is not defined in your .env file."
    );
    logger.error("Please get a key from the Google Cloud logger and add it.");
    process.exit(1); // Exit with an error code
  }

  try {
    const fontItems = await fetchFontList(API_KEY);
    const languageMap = processFontData(fontItems);
    writeFontFiles(languageMap, OUTPUT_DIR);
    logger.log("\nScript finished successfully!");
  } catch (error) {
    logger.error("\nScript failed with an error:", error);
    process.exit(1);
  }
}

main();
