"use client";

import { Fragment } from "react";
import dynamic from "next/dynamic";

import { TranslationProvider } from "@/components/context/TranslationContext";
import { ModalProvider } from "./modal-provider";
import { ThemeProvider } from "./theme-provider";
// import { SocketProvider } from "./socket-provider";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./query-provider";

const ToastContainerClient = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

function Providers({
  children,
  translations
}: {
  children: React.ReactNode;
  translations: any;
}) {
  return (
    <Fragment>
      <SessionProvider>
        <QueryProvider>
        {/* <SocketProvider> */}
          <ThemeProvider>
            <TranslationProvider translations={translations}>
              {children}
            </TranslationProvider>
          </ThemeProvider>
        {/* </SocketProvider> */}
        <ModalProvider />
        <ToastContainerClient />
        </QueryProvider>
      </SessionProvider>
    </Fragment>
  );
}

export default Providers;
