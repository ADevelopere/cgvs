// This script fetches the live font list from Google and then generates subset files.
// Run this from the project root: ts-node ./scripts/fetch-and-generate-fonts.ts

import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// This function is imported from your other script
import { generateFontSubsetFiles } from "./generateFontSubsetFiles";
import { logger } from "../simpleLogger";

// --- Setup __dirname and .env ---
// This is the modern ES Module way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the project root (one level up from '/scripts')
// This uses the exact path you specified.
config({ path: resolve(__dirname, "../.env") });

// --- Main Execution ---

/**
 * Fetches the Google Fonts list and triggers the file generation.
 */
async function main() {
  const API_KEY = process.env.GOOGLE_FONTS_API_KEY;

  if (!API_KEY) {
    logger.error("❌ ERROR: GOOGLE_FONTS_API_KEY is not set.");
    logger.error("Please add it to your .env file at the project root.");
    process.exit(1);
  }

  const API_URL = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`;

  try {
    logger.log("Fetching Google Fonts list from API...");
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    // Get the response as a single string
    const jsonString = await response.text();

    if (!jsonString) {
      throw new Error("API returned an empty response.");
    }

    logger.log("✅ Fetch successful. Starting file generation...");

    // Pass the raw JSON string to your generator function
    generateFontSubsetFiles(jsonString);
  } catch (error) {
    logger.error(
      "❌ An error occurred during the fetch-and-generate process:",
      error
    );
    process.exit(1);
  }
}

// Run the main function
main();
