'use client'

import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions } from '@/locales/i18next.config'
import { useSession } from 'next-auth/react'

const runsOnServerSide = typeof window === 'undefined'

// Khởi tạo i18next một lần
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`../locales/${language}/${namespace}.json`))
  )
  .init({
    ...getOptions('vi', 'common'),
    lng: 'vi',
    fallbackLng: 'vi',
    detection: {
      order: ['querystring', 'path', 'htmlTag', 'cookie', 'navigator'],
      lookupQuerystring: 'lang',
    },
    preload: runsOnServerSide ? ['vi', 'en'] : []
  })

export function useTranslation(lng: string, ns: string, options: any = {}) {
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  const { data: session } = useSession()

  useEffect(() => {
    if (runsOnServerSide) return

    // Ưu tiên ngôn ngữ từ session nếu có
    const sessionLang = session?.user?.language
    const languageToUse = sessionLang || lng || 'vi'
    
    if (i18n.resolvedLanguage === languageToUse) return

    i18n.changeLanguage(languageToUse)
  }, [lng, i18n, session?.user?.language])

  return ret
}