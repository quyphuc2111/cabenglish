"use client";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { navbarAnimations } from "@/constants/animation-variants";
import { useModal } from "@/hooks/useModalStore";
import { useUserTheme, useUserMode } from "@/store/useUserStore";
import { useTranslation } from "@/hooks/useTranslation";
import { NavbarControls } from "./navbar-com/NavbarControls";
import { LogoDecorations } from "./navbar-com/LogoDecorations";
// import { logout as apiLogout } from "@/hooks/client/userApi"; // Replaced by server action
import { signOut, useSession } from "next-auth/react";
import { logoutAction } from "@/actions/authAction"; // Import the server action

interface NavbarProps {
  title: string;
  type?: string;
}

export function Navbar({ title, type }: NavbarProps) {
  const { t } = useTranslation("", "common");
  const currentTheme = useUserTheme() ?? "theme-gold";
  const { onOpen } = useModal();
  const router = useRouter();
  const currentTeachingMode = useUserMode() ?? "defaultMode";
  const { data: session } = useSession();

  const handleChangeTheme = () => {
    onOpen("changeTheme");
  };

  const handleLogout = async () => {
    console.log("Initiating logout...");
    try {
      // Call the server action to handle backend API logout
      const result = await logoutAction();
      if (!result.success) {
        // Log the error from the server action, but proceed with client-side logout anyway
        console.error("Server action logout failed:", result.message);
        // Optionally: Show a notification to the user here
      } else {
        console.log("Server action logout successful.");
      }
    } catch (error) {
      // Catch errors during the server action call itself
      console.error("Error calling logout action:", error);
      // Optionally: Show a notification to the user here
    }

    try {
      // Perform client-side sign out regardless of server action outcome
      console.log("Performing client-side signOut...");
      await signOut({ redirect: false }); // Prevent default redirect
      console.log("Client-side signOut successful.");
    } catch (error) {
      console.error("Next-auth signOut failed:", error);
      // Optionally: Show a notification to the user here
    }

    // Manually redirect to the sign-in page
    console.log("Redirecting to /signin...");
    router.push("/signin");
    router.refresh();
  };

  return (
    <motion.header
      className="z-10 w-full max-w-[1920px] mx-auto "
      variants={navbarAnimations.container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 lg:gap-10">
        <SheetMenu />
        <LogoDecorations currentTheme={currentTheme} />
        <NavbarControls
          t={t}
          currentTeachingMode={currentTeachingMode}
          onChangeTheme={handleChangeTheme}
          onLogout={handleLogout}
        />
      </div>
    </motion.header>
  );
}
