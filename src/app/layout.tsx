import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
// import {Popin} from "geist/font/"

import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import initTranslations from "@/locales/i18n";
import { TranslationProvider } from "@/components/context/TranslationContext";
import { ModalProvider } from "@/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

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
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "Lớp học BKT",
    description:
      "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Lớp học BKT",
    description:
      "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness."
  }
};

export default async function RootLayout({
  children,
  params: { lang }
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { t, resources } = await initTranslations(lang, ["common"]);

  const translations = resources?.[lang]?.common || {};

  return (
    <html lang={lang} suppressHydrationWarning>
      {/* className={GeistSans.className} */}
      <body className={`${inter.className} font-poppins`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TranslationProvider translations={translations}>
            {children}
          </TranslationProvider>
        </ThemeProvider>
        <ModalProvider />
      </body>
    </html>
  );
}
