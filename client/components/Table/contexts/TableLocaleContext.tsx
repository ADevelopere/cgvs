"use client";

import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { TableLocale, SupportedLocale } from "../types/locale.types";
import { defaultLocaleResources } from "../locale/defaultTableLocales";
import { useAppTheme } from "@/client/contexts";

interface TableLocaleContextValue {
  locale: SupportedLocale;
  strings: TableLocale;
}

const TableLocaleContext = createContext<TableLocaleContextValue | undefined>(undefined);

interface TableLocaleProviderProps {
  children: ReactNode;
  initialLocale?: SupportedLocale;
  customStrings?: Partial<TableLocale>;
}

export const TableLocaleProvider: React.FC<TableLocaleProviderProps> = ({ children, customStrings }) => {
  const { language } = useAppTheme();
  const strings = useMemo(() => {
    const baseStrings = defaultLocaleResources[language] || defaultLocaleResources.en;

    if (!customStrings) {
      return baseStrings;
    }

    const isObject = (obj: unknown): obj is Record<string, unknown> => {
      return obj !== null && typeof obj === "object";
    };

    const mergeDeep = (target: unknown, source: unknown): TableLocale => {
      const output: Record<string, unknown> = isObject(target) ? { ...target } : {};
      if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
          const sourceValue = source[key];
          const targetValue = target[key];
          if (isObject(sourceValue)) {
            if (!(key in target)) {
              output[key] = sourceValue;
            } else {
              output[key] = mergeDeep(targetValue, sourceValue);
            }
          } else {
            output[key] = sourceValue;
          }
        });
      }
      return output as unknown as TableLocale;
    };

    return mergeDeep(baseStrings, customStrings);
  }, [language, customStrings]);

  const contextValue = useMemo(
    () => ({
      locale: language,
      strings,
    }),
    [language, strings]
  );

  return <TableLocaleContext.Provider value={contextValue}>{children}</TableLocaleContext.Provider>;
};

export const useTableLocale = (): TableLocaleContextValue => {
  const context = useContext(TableLocaleContext);
  if (context === undefined) {
    return {
      locale: "ar",
      strings: defaultLocaleResources.ar,
    };
  }
  return context;
};
