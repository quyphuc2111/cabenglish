import type { Metadata } from "next";
import { Inter } from "next/font/google";

import initTranslations from "@/locales/i18n";

const inter = Inter({ 
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

import "react-toastify/dist/ReactToastify.css";
import "../app/globals.css";
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
  title: "Lớp học BKT",
  description:
    "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lớp học BKT"
  },
  formatDetection: {
    telephone: false
  }
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

  return (
    <html lang={currentLang} suppressHydrationWarning className="h-full">
      <head>
        {/* Use Next.js metadata instead of direct meta tags */}
      </head>
      <body className={`${inter.className} ${inter.variable} font-inter h-full overscroll-none`}>
        <Providers translations={translations}>
          <div className="min-h-full flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}