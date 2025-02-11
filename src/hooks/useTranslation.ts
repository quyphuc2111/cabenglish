'use client'

import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions } from '@/locales/i18next.config'

const runsOnServerSide = typeof window === 'undefined'

// Khởi tạo i18next một lần
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`@/locales/${language}/${namespace}.json`))
  )
  .init({
    ...getOptions('vi', 'common'),
    lng: undefined, // Để cho language detector xác định
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? ['vi', 'en'] : []
  })

export function useTranslation(lng: string, ns: string, options: any = {}) {
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret

  useEffect(() => {
    if (runsOnServerSide) return
    if (i18n.resolvedLanguage === lng) return

    i18n.changeLanguage(lng)
  }, [lng, i18n])

  return ret
}