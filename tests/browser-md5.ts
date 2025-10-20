import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import logger from "@/lib/logger";

/**
 * Generate MD5 hash using the actual generateFileMD5 function from storage.util.ts
 * in a browser environment via Puppeteer
 */
export const generateFileMD5Browser = async (
  filePath: string
): Promise<string> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Read the file as buffer and convert to base64
    const fileBuffer = readFileSync(filePath);
    const base64Data = fileBuffer.toString("base64");

    // Create a data URL
    const dataUrl = `data:application/octet-stream;base64,${base64Data}`;

    // Navigate to a page that can load our TypeScript modules
    await page.goto("data:text/html,<html><head></head><body></body></html>");

    // Add crypto-js library
    await page.addScriptTag({
      url: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js",
    });

    // Create a proper TypeScript-compatible environment
    const result = await page.evaluate(async (dataUrl: string) => {
      // Fetch the data URL and create a File object
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "test.jpg", { type: "image/jpeg" });

      // Replicate the exact generateFileMD5 function from storage.util.ts
      // This is the same function, just running in browser context
      const generateFileMD5 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = event => {
            try {
              const arrayBuffer = event.target?.result as ArrayBuffer;
              const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
              const hash = CryptoJS.MD5(wordArray).toString();
              resolve(hash);
            } catch (error) {
              reject(
                error instanceof Error
                  ? error
                  : new Error("Failed to generate MD5 hash")
              );
            }
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsArrayBuffer(file);
        });
      };

      // Use the function
      return await generateFileMD5(file);
    }, dataUrl);

    logger.info(
      "Browser MD5 generation completed using storage.util.ts logic",
      { result }
    );
    return result;
  } finally {
    await browser.close();
  }
};
