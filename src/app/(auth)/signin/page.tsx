
import React from "react";
import AuthContainer from "@/components/auth/AuthContainer";
import initTranslations from "@/locales/i18n";

async function Auth({ params: { lang } }: { params: { lang: string } }) {
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-blue bg-gradient-to-r from-gradient-start to-gradient-end">
      <AuthContainer />
      
    </div>
  );
}

export default Auth;
