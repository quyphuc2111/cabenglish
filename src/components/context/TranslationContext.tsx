'use client'

import { createContext, useContext } from 'react'

const TranslationContext = createContext<{
  t: (key: string) => string
}>({
  t: (key) => key,
})

export function TranslationProvider({ 
  children, 
  translations 
}: { 
  children: React.ReactNode
  translations: any 
}) {
  const t = (key: string) => {
    return translations[key] || key
  }

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslations = () => useContext(TranslationContext)