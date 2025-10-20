import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import initTranslations from "@/locales/i18n";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true
});

import "react-toastify/dist/ReactToastify.css";
import "../app/globals.css";
import "../styles/lesson-optimize.css";
import Providers from "@/providers/providers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Lớp học BKT"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export default async function RootLayout({
  children,
  params: { lang }
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const session = await getServerSession(authOptions);
  // Ưu tiên ngôn ngữ từ session nếu có, sau đó đến params, cuối cùng là mặc định
  const sessionLang = session?.user?.language;
  const currentLang = sessionLang || lang || "vi";

  const { t, resources } = await initTranslations(currentLang, ["common"]);

  const translations = resources?.[currentLang]?.common || {};
  
  // ✅ Lấy theme từ session để tránh FOUC
  const userTheme = session?.user?.theme || "theme-red";

  return (
    <html lang={currentLang} suppressHydrationWarning className="h-full">
      <head>
        {/* ✅ Inline script để set theme ngay lập tức, tránh FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = '${userTheme}';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  console.error('Theme init error:', e);
                }
              })();
            `
          }}
        />
      </head>
      <body
        className={`${inter.className} ${inter.variable} font-inter h-full overscroll-none performance-mode toast-enabled modal-enabled`}
        data-theme={userTheme}
      >
        <Providers translations={translations} currentLanguage={currentLang}>
          <div className="min-h-full flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
