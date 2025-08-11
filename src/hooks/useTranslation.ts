'use client'

import { useEffect, useState, useCallback } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions } from '@/locales/i18next.config'
import { useSession } from 'next-auth/react'
import { useTranslations } from '@/components/context/TranslationContext'

const runsOnServerSide = typeof window === 'undefined'

// Khởi tạo i18next một lần với cấu hình cải thiện
if (!i18next.isInitialized) {
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
        caches: ['localStorage', 'cookie'],
      },
      preload: runsOnServerSide ? ['vi', 'en'] : [],
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      }
    })
}

// Hook thống nhất cho translation
export function useTranslation(lng?: string, ns: string = 'common', options: any = {}) {
  const [currentLang, setCurrentLang] = useState<string>('vi')
  const { data: session } = useSession()
  const contextTranslations = useTranslations()

  // Sử dụng i18next cho client-side
  const i18nextResult = useTranslationOrg(ns, options)
  const { i18n } = i18nextResult

  // Xác định ngôn ngữ hiện tại
  const determineLanguage = useCallback(() => {
    if (runsOnServerSide) return 'vi'

    // Ưu tiên: session > URL params > i18next detected > default
    const sessionLang = session?.user?.language
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang')
    const detectedLang = i18n.resolvedLanguage || i18n.language

    return sessionLang || urlLang || lng || detectedLang || 'vi'
  }, [session?.user?.language, lng, i18n.resolvedLanguage, i18n.language])

  useEffect(() => {
    if (runsOnServerSide) return

    const languageToUse = determineLanguage()

    if (languageToUse !== currentLang) {
      setCurrentLang(languageToUse)

      // Chỉ thay đổi i18next nếu thực sự khác
      if (i18n.resolvedLanguage !== languageToUse) {
        i18n.changeLanguage(languageToUse)
      }
    }
  }, [session?.user?.language, lng, i18n, currentLang, determineLanguage])

  // Trả về function t thống nhất
  const t = useCallback((key: string, options?: any) => {
    if (runsOnServerSide) {
      // Server-side: sử dụng contextTranslations fallback
      return contextTranslations.t(key)
    } else {
      // Client-side: sử dụng i18next
      return i18nextResult.t(key, options)
    }
  }, [contextTranslations, i18nextResult.t])

  return {
    ...i18nextResult,
    t,
    i18n,
    currentLanguage: currentLang,
    ready: !runsOnServerSide ? i18nextResult.ready : true
  }
}