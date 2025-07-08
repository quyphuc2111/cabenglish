import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
// import {Popin} from "geist/font/"

import initTranslations from "@/locales/i18n";

const inter = Inter({ subsets: ["latin"] });

import "react-toastify/dist/ReactToastify.css";
import "../app/globals.css";
import Providers from "@/providers/providers";
import CookieSetter from "@/components/cookie-setter";
import Head from "next/head";
import Script from 'next/script';

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
  // alternates: {
  //   canonical: "/"
  // },
  // openGraph: {
  //   url: "/",
  //   title: "Lớp học BKT",
  //   description:
  //     "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness.",
  //   type: "website"
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Lớp học BKT",
  //   description:
  //     "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness."
  // }
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
    // <html lang={lang} suppressHydrationWarning>
    //   {/* className={GeistSans.className} */}
    //   <body className={`${inter.className} font-poppins`}>
    //   <QueryProvider>
    //       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    //         <TranslationProvider translations={translations}>
    //           {children}
    //         </TranslationProvider>
    //       </ThemeProvider>
    //       <ModalProvider />
    //       <ToastContainer
    //         position="top-right"
    //         autoClose={3000}
    //         hideProgressBar={false}
    //         closeOnClick
    //         pauseOnHover
    //         theme="light"
    //       />
    //     </QueryProvider>
    //   </body>
    // </html>
    <html lang="vi" suppressHydrationWarning>
      {/* <Script
        src="https://lms.bkt.net.vn/h5p/h5plib/v127/joubel/core/js/h5p-resizer.js"
      /> */}
      <body className={`${inter.className} font-poppins`}>
        <Providers translations={translations}>
          {children}
          {/* <CookieSetter /> */}
        </Providers>
      </body>
    </html>
  );
}
