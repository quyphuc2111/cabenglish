const i18NextConfig = {
    debug: process.env.NODE_ENV === "development",
    i18n: {
      locales: ["vi", "en"],
      defaultLocale: "vi"
    },
    fallbackNS: "common",
    defaultNS: "common",
    ns: ["common"],
    load: "all"
  };
  
  export const getOptions = (lang: string, ns: string | string[]) => {
    // Kiểm tra xem ngôn ngữ có hợp lệ không
    if (!i18NextConfig.i18n.locales.includes(lang)) {
      lang = i18NextConfig.i18n.defaultLocale; 
    }
  
    return {
      supportedLangs: i18NextConfig.i18n.locales,
      lang,
      ns,
      fallbackNS: i18NextConfig.fallbackNS,
      defaultNS: i18NextConfig.defaultNS
    };
  };
  
  export default i18NextConfig;
  