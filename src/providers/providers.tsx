"use client";

import { Fragment } from "react";
import dynamic from "next/dynamic";

import { TranslationProvider } from "@/components/context/TranslationContext";
import { ModalProvider } from "./modal-provider";
import { ThemeProvider } from "./theme-provider";
// import { SocketProvider } from "./socket-provider";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./query-provider";
import { GoogleReCaptchaProvider } from "@google-recaptcha/react";
import { FirstLoginGuard } from "@/components/first-login-guard";
import { TokenValidationProvider } from "./token-validation-provider";

const ToastContainerClient = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

function Providers({
  children,
  translations,
  currentLanguage = "vi"
}: {
  children: React.ReactNode;
  translations: any;
  currentLanguage?: string;
}) {
  return (
    <Fragment>
      <GoogleReCaptchaProvider
        type="v2-checkbox"
        siteKey="6LfrPQYrAAAAACvE3gCdKyICFMiPcmeFwr7EK-Yq"
      >
        <SessionProvider>
          <TokenValidationProvider>
            <QueryProvider>
              {/* <SocketProvider> */}
              <ThemeProvider>
                <TranslationProvider
                  translations={translations}
                  currentLanguage={currentLanguage}
                >
                  <FirstLoginGuard>{children}</FirstLoginGuard>
                </TranslationProvider>
              </ThemeProvider>
              {/* </SocketProvider> */}
              <ModalProvider />
              <ToastContainerClient 
                position="top-right"
                autoClose={8000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={true}
                draggable={true}
                pauseOnHover={true}
                theme="light"
                limit={5}
              />
            </QueryProvider>
          </TokenValidationProvider>
        </SessionProvider>
      </GoogleReCaptchaProvider>
    </Fragment>
  );
}

export default Providers;
