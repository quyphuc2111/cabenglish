"use client";

import { useEffect, useState } from "react";
import TeachingModeModal from "@/components/modal/teaching-mode-modal";

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
      {/* <CoinHistory /> */}
    </>
  );
};