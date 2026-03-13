import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
// import {Popin} from "geist/font/"

import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "CAB English - Học tiếng Anh trực tuyến",
  description:
    "Hệ thống học tiếng Anh trực tuyến CAB English dành cho học sinh tiểu học từ lớp 1 đến lớp 5.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "CAB English - Học tiếng Anh trực tuyến",
    description:
      "Hệ thống học tiếng Anh trực tuyến CAB English dành cho học sinh tiểu học từ lớp 1 đến lớp 5.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "CAB English - Học tiếng Anh trực tuyến",
    description:
      "Hệ thống học tiếng Anh trực tuyến CAB English dành cho học sinh tiểu học từ lớp 1 đến lớp 5."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* className={GeistSans.className} */}
      <body  className="">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
