"use client";

import { useEffect, useState } from "react";
import TeachingModeModal from "@/components/modal/teaching-mode-modal";
import ChangeTheme from "@/components/modal/change-theme";
import ResetUnitModal from "@/components/modal/reset-unit-modal";
import ResetSchoolYearModal from "@/components/modal/reset-schoolyear-modal";
import ChangeTeachingModeModal from "@/components/modal/change-teaching-mode-modal";
import CompleteLessonModal from "@/components/modal/complete-lesson-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* <UserInfoModal /> */}
      <TeachingModeModal />
      <ChangeTheme />
      <ResetUnitModal />
      <ResetSchoolYearModal />
      <ChangeTeachingModeModal />
      <CompleteLessonModal />
      {/* <CoinHistory /> */}
    </>
  );
};