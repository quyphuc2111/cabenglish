"use client";

import { useEffect, useState } from "react";
import TeachingModeModal from "@/components/modal/teaching-mode-modal";
import ChangeTheme from "@/components/modal/change-theme";
import ResetUnitModal from "@/components/modal/reset-unit-modal";
import ResetSchoolYearModal from "@/components/modal/reset-schoolyear-modal";
import ChangeTeachingModeModal from "@/components/modal/change-teaching-mode-modal";
import CompleteLessonModal from "@/components/modal/complete-lesson-modal";
import NextSectionModal from "@/components/modal/next-section-modal";
import NextLessonModal from "@/components/modal/next-lesson-modal";
import NotificationModal from "@/components/modal/notification-modal";
import LogoutModal from "@/components/modal/logout-modal";
import ExpertDetailModal from "@/components/modal/expert-detail-modal";
import { useModal } from "@/hooks/useModalStore";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, type, data, onClose } = useModal();

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
      <NextSectionModal />
      <NextLessonModal />
      <NotificationModal />
      <LogoutModal />
      <ExpertDetailModal
        isOpen={isOpen && type === "expertDetail"}
        onClose={onClose}
        expert={data?.expert || null}
      />
      {/* <CoinHistory /> */}
    </>
  );
};
