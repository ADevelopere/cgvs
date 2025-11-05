"use client";

import React from "react";
import WebFont from "webfontloader";
import logger from "@/client/lib/logger";

export type FontContextValue = {
  fontsLoaded: boolean;
  families: string[];
};

export const FontContext = React.createContext<FontContextValue>({
  fontsLoaded: false,
  families: [],
});

export interface FontProviderProps {
  families: string[];
  children: React.ReactNode;
}

export const FontProvider: React.FC<FontProviderProps> = ({ families, children }) => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!families || families.length === 0) {
      setFontsLoaded(true);
      return;
    }

    setFontsLoaded(false);
    try {
      WebFont.load({
        google: { families },
        active: () => {
          logger.debug("FontProvider: Fonts active", { families });
          setFontsLoaded(true);
        },
        inactive: () => {
          logger.warn("FontProvider: Fonts inactive", { families });
          setFontsLoaded(true); // allow rendering to proceed with fallbacks
        },
      });
    } catch (e) {
      logger.error("FontProvider: Failed to load fonts", { error: e });
      setFontsLoaded(true);
    }
  }, [families]);

  const value = React.useMemo(() => ({ fontsLoaded, families }), [fontsLoaded, families]);

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
};


