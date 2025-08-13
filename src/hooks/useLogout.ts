"use client";

import { useCallback } from "react";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/store/useUserStore";
import { logoutAction } from "@/actions/authAction";
import { showToast } from "@/utils/toast-config";
import axios from "axios";

export const useLogout = () => {
  const { logout: logoutFromStore } = useUserStore();

  const handleLogout = useCallback(
    async (options?: { callbackUrl?: string; showToastMessages?: boolean }) => {
      const { callbackUrl = "/", showToastMessages = true } = options || {};

      try {
        // 1. Clear Zustand store đầu tiên
        logoutFromStore();
        console.log("Zustand store cleared.");

        // 2. Logout từ backend
        try {
          const result = await logoutAction();
          if (!result.success) {
            console.error("Server action logout failed:", result.message);
          } else {
            console.log("Server action logout successful.");
          }
        } catch (error) {
          console.error("Error calling logout action:", error);
        }

        // 3. Logout từ Moodle
        try {
          const apiUrl = process.env.NEXT_PUBLIC_BKT_ACCOUNT_API_URL || "";
          if (apiUrl) {
            const response = await axios.post(
              `${apiUrl}/api/Moodle/logout-default`,
              {},
              { withCredentials: true }
            );

            if (response.data.success) {
              console.log("Moodle logout successful:", response.data.message);
            } else {
              console.error("Moodle logout failed:", response.data.message);
            }
          }
        } catch (error) {
          console.error("Error calling logout-default API:", error);
        }

        // 4. Clear localStorage/sessionStorage if needed
        try {
          localStorage.removeItem("remember_password");
          localStorage.removeItem("remember_email");
          localStorage.removeItem("user-storage");
        } catch (error) {
          console.error("Error clearing localStorage:", error);
        }

        // 5. Show success message
        if (showToastMessages) {
          showToast.success("Đăng xuất thành công!");
        }

        // 6. NextAuth signOut với redirect hoàn toàn
        await signOut({
          redirect: true,
          callbackUrl
        });
      } catch (error) {
        console.error("Logout error:", error);

        if (showToastMessages) {
          showToast.error("Có lỗi xảy ra khi đăng xuất");
        }

        // Fallback: force redirect
        try {
          await signOut({
            redirect: true,
            callbackUrl
          });
        } catch (signOutError) {
          console.error("SignOut fallback failed:", signOutError);
          // Last resort: direct redirect
          window.location.href = callbackUrl;
        }
      }
    },
    [logoutFromStore]
  );

  return {
    logout: handleLogout
  };
};
