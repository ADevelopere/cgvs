import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { TableLocale, SupportedLocale } from './tableLocale.types';
import { defaultLocaleResources } from './defaultTableLocales';

interface TableLocaleContextValue {
  locale: SupportedLocale;
  strings: TableLocale;
}

const TableLocaleContext = createContext<TableLocaleContextValue | undefined>(undefined);

interface TableLocaleProviderProps {
  children: ReactNode;
  locale?: SupportedLocale;
  customStrings?: Partial<TableLocale>;
}

export const TableLocaleProvider: React.FC<TableLocaleProviderProps> = ({
  children,
  locale: activeLocale = 'en',
  customStrings,
}) => {
  const strings = useMemo(() => {
    const baseStrings = defaultLocaleResources[activeLocale] || defaultLocaleResources.en;

    if (!customStrings) {
      return baseStrings;
    }

    const mergeDeep = (target: any, source: any): TableLocale => {
      const output = { ...target };
      if (target && typeof target === 'object' && source && typeof source === 'object') {
        Object.keys(source).forEach(key => {
          if (source[key] && typeof source[key] === 'object') {
            if (!(key in target)) Object.assign(output, { [key]: source[key] });
            else output[key] = mergeDeep(target[key], source[key]);
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
      }
      return output as TableLocale;
    };

    return mergeDeep(baseStrings, customStrings) as TableLocale;
  }, [activeLocale, customStrings]);

  const contextValue = useMemo(() => ({
    locale: activeLocale,
    strings,
  }), [activeLocale, strings]);

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
      locale: 'en',
      strings: defaultLocaleResources.en,
    };
  }
  return context;
};
