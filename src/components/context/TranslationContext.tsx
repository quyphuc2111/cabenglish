"use client";

import { createContext, useContext, useMemo } from "react";

interface TranslationContextType {
  t: (key: string) => string;
  translations: any;
  currentLanguage: string;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key) => key,
  translations: {},
  currentLanguage: "vi"
});

export function TranslationProvider({
  children,
  translations,
  currentLanguage = "vi"
}: {
  children: React.ReactNode;
  translations: any;
  currentLanguage?: string;
}) {
  const contextValue = useMemo(() => {
    const t = (key: string) => {
      return translations[key] || key;
    };

    return {
      t,
      translations,
      currentLanguage
    };
  }, [translations, currentLanguage]);

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslations = () => useContext(TranslationContext);
