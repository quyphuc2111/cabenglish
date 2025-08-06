import { createInstance, i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import i18NextConfig from "./i18next.config";

export default async function initTranslations(
  lang: string,
  ns: string[],
  i18nInstance?: i18n,
  resources?: any
) {
  i18nInstance = i18nInstance || createInstance();

  if (!resources) {
    i18nInstance.use(resourcesToBackend((language: string, namespace: string) => 
      import(`./${language}/${namespace}.json`))
    );
  }

  if (!i18NextConfig.i18n.locales.includes(lang)) {
    lang = i18NextConfig.i18n.defaultLocale;
  }

  const namespaces = Array.isArray(ns) ? ns : [ns];

  if (!i18nInstance.isInitialized) {
    await i18nInstance.init({
      debug: false,
      lng: lang,
      resources,
      fallbackLng: i18NextConfig.i18n.defaultLocale,
      supportedLngs: i18NextConfig.i18n.locales,
      ns: namespaces,
      defaultNS: namespaces[0],
      preload: resources ? [] : i18NextConfig.i18n.locales,
      load: "all",
    });
  }

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}
