"use client";

import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { TableLocale, SupportedLocale } from "./tableLocale.types";
import { defaultLocaleResources } from "./defaultTableLocales";

interface TableLocaleContextValue {
  locale: SupportedLocale;
  strings: TableLocale;
}

const TableLocaleContext = createContext<TableLocaleContextValue | undefined>(
  undefined,
);

interface TableLocaleProviderProps {
  children: ReactNode;
  locale?: SupportedLocale;
  customStrings?: Partial<TableLocale>;
}

export const TableLocaleProvider: React.FC<TableLocaleProviderProps> = ({
  children,
  locale: activeLocale = "ar",
  customStrings,
}) => {
  const strings = useMemo(() => {
    const baseStrings =
      defaultLocaleResources[activeLocale] || defaultLocaleResources.en;

    if (!customStrings) {
      return baseStrings;
    }

    const isObject = (obj: unknown): obj is Record<string, unknown> => {
      return obj !== null && typeof obj === "object";
    };

    const mergeDeep = (target: unknown, source: unknown): TableLocale => {
      const output: Record<string, unknown> = isObject(target)
        ? { ...target }
        : {};
      if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
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
  }, [activeLocale, customStrings]);

  const contextValue = useMemo(
    () => ({
      locale: activeLocale,
      strings,
    }),
    [activeLocale, strings],
  );

  return (
    <TableLocaleContext.Provider value={contextValue}>
      {children}
    </TableLocaleContext.Provider>
  );
};

export const useTableLocale = (): TableLocaleContextValue => {
  const context = useContext(TableLocaleContext);
  if (context === undefined) {
    return {
      locale: "en",
      strings: defaultLocaleResources.en,
    };
  }
  return context;
};
