"use client";

import React from "react";
import logger from "@/client/lib/logger";
import { FontFamily, getFontByFamily } from "@/lib/font/google";
import type { Font as OpentypeFont } from "opentype.js";
import { useCanvasFontStore } from "../stores/useCanvasFontStore";

type OpentypeModule = typeof import("opentype.js");

async function loadOpentype(): Promise<OpentypeModule> {
  // Dynamic import to avoid bundling issues if not yet installed
  const mod = await import("opentype.js");
  return mod;
}

async function fetchFontBuffer(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch font: ${res.status} ${res.statusText}`);
  }
  return await res.arrayBuffer();
}

export function useOpentypeMetrics(families: string[]) {
  const [ready, setReady] = React.useState(false);
  const { getFont, hasFont, setFont, getInflight, setInflight, removeInflight } = useCanvasFontStore();

  React.useEffect(() => {
    let cancelled = false;
    
    const ensureFontInternal = async (family: string): Promise<void> => {
      if (hasFont(family)) return;
      const existingInflight = getInflight(family);
      if (existingInflight) return existingInflight;

      const promise = (async () => {
        try {
          const fontItem = getFontByFamily(family as FontFamily);
          if (!fontItem) {
            logger.warn({ caller: "useOpentypeMetrics" }, "Unknown font family, skipping", { family });
            return;
          }
          const fileUrl = fontItem.files.regular || Object.values(fontItem.files)[0];
          if (!fileUrl) {
            logger.warn({ caller: "useOpentypeMetrics" }, "No file URL for family", { family });
            return;
          }
          const buffer = await fetchFontBuffer(fileUrl);
          const opentype = await loadOpentype();
          const font: OpentypeFont = opentype.parse(buffer);
          setFont(family, font);
          logger.debug({ caller: "useOpentypeMetrics" }, "Parsed font", { family });
        } catch (error) {
          logger.error({ caller: "useOpentypeMetrics" }, "Failed ensuring font", { family, error });
        } finally {
          removeInflight(family);
        }
      })();

      setInflight(family, promise);
      return promise;
    };

    (async () => {
      setReady(false);
      const uniq = Array.from(new Set(families)).filter(Boolean);
      
      // Start all font fetches immediately in parallel (don't wait for WebFont)
      // This is safe because we're just preloading the font files
      await Promise.all(uniq.map(f => ensureFontInternal(f)));
      
      if (!cancelled) setReady(true);
    })();
    
    return () => {
      cancelled = true;
    };
  }, [families.join("|"), getFont, hasFont, setFont, getInflight, setInflight, removeInflight]);

  return { metricsReady: ready, getFont };
}

export function getTrueFontMetrics(font: OpentypeFont | undefined, fontSize: number) {
  if (!font) {
    return { lineHeight: fontSize * 1.2, baselineOffset: fontSize * 0.8 };
  }
  const unitsPerEm: number = font.unitsPerEm || 1000;
  const ascender: number = font.ascender ?? 0;
  const descender: number = font.descender ?? 0;
  const lineGap: number = font.tables?.hhea?.lineGap ?? 0;
  const scale = fontSize / unitsPerEm;
  const lineHeight = (ascender - descender + lineGap) * scale;
  const baselineOffset = ascender * scale;
  return { lineHeight, baselineOffset };
}
