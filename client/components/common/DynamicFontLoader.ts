// components/DynamicFontLoader.js
"use client"; // This component must be a Client Component

import { logger } from "@/client/lib/logger";
import { GoogleFontItem } from "@/lib/font/google/types";
import { useEffect } from "react";
import WebFont from "webfontloader";

// Helper to format the font string
function getFontFamilyString(fontItem: GoogleFontItem): string | null {
  if (!fontItem) return null;
  const variants = fontItem.variants.join(",");
  return `${fontItem.family}:${variants}`;
}

const useDynamicFontLoader = ({ fontItem }: { fontItem: GoogleFontItem | null | undefined }) => {
  useEffect(() => {
    if (!fontItem) return;

    const fontFamily = getFontFamilyString(fontItem);

    if (fontFamily) {
      WebFont.load({
        google: {
          families: [fontFamily],
        },
        active: () => {
          logger.info(`Font ${fontItem.family} is active!`);
          // You can set a state here to update your UI
        },
      });
    }
  }, [fontItem]);

  return null; // This component doesn't render HTML
};

export default useDynamicFontLoader;
