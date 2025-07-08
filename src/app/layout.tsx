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
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
  const session = await getServerSession(authOptions);
  // Ưu tiên ngôn ngữ từ session nếu có, sau đó đến params, cuối cùng là mặc định
  const sessionLang = session?.user?.language;
  const currentLang = sessionLang || lang || "vi";
  
  const { t, resources } = await initTranslations(currentLang, ["common"]);

  const translations = resources?.[currentLang]?.common || {};

  return (
    <html lang={currentLang} suppressHydrationWarning>
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



// <iframe
//     src="https://lms.bkt.net.vn/h5p/embed.php?url=https%3A%2F%2Flms.bkt.net.vn%2Fpluginfile.php%2F46968%2Fmod_h5pactivity%2Fpackage%2F0%2Fflashcards-2573.h5p&amp;component=mod_h5pactivity"
//     name="h5player"
//     width="1761"
//     height="806"
//     allowfullscreen="allowfullscreen"
//     class="h5p-player w-100 border-0"
//     style="height: 0px;"
//     id="6867981562c886867981562c8b1-h5player"
// ></iframe><script src="https://lms.bkt.net.vn/h5p/h5plib/v127/joubel/core/js/h5p-resizer.js"></script>


{/* <div class="d-flex justify-content-end mb-3">
</div>

<iframe
    src="https://lms.bkt.net.vn/h5p/embed.php?url=https%3A%2F%2Flms.bkt.net.vn%2Fpluginfile.php%2F46958%2Fmod_h5pactivity%2Fpackage%2F0%2Finteractive-video-2559.h5p&amp;component=mod_h5pactivity"
    name="h5player"
    width="1761"
    height="1052"
    allowfullscreen="allowfullscreen"
    class="h5p-player w-100 border-0"
    style="height: 0px;"
    id="686798f33f8f6686798f33f8f91-h5player"
></iframe><script src="https://lms.bkt.net.vn/h5p/h5plib/v127/joubel/core/js/h5p-resizer.js"></script> */}