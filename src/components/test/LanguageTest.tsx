"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useTranslations } from "@/components/context/TranslationContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import i18next from "i18next";

export function LanguageTest() {
  const { t: hookT, currentLanguage, ready } = useTranslation();
  const { t: contextT, currentLanguage: contextLang } = useTranslations();
  const { data: session } = useSession();
  const [urlLang, setUrlLang] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setUrlLang(params.get("lang") || "");
    }
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
      <h3 className="font-bold text-lg">🔍 Language Debug Info</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold">Hook Translation:</h4>
          <p>Current Language: {currentLanguage}</p>
          <p>Ready: {ready ? "✅" : "❌"}</p>
          <p>i18next Language: {i18next.resolvedLanguage}</p>
          <p>Test Text: {hookT("teacher")}</p>
        </div>
        
        <div>
          <h4 className="font-semibold">Context Translation:</h4>
          <p>Current Language: {contextLang}</p>
          <p>Test Text: {contextT("teacher")}</p>
        </div>
      </div>
      
      <div className="border-t pt-2">
        <h4 className="font-semibold">Sources:</h4>
        <p>Session Language: {session?.user?.language || "None"}</p>
        <p>URL Language: {urlLang || "None"}</p>
        <p>User ID: {session?.user?.userId || "None"}</p>
      </div>
      
      <div className="border-t pt-2">
        <h4 className="font-semibold">Test Translations:</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p>Hook: {hookT("changeTheme")}</p>
            <p>Context: {contextT("changeTheme")}</p>
          </div>
          <div>
            <p>Hook: {hookT("filter")}</p>
            <p>Context: {contextT("filter")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
