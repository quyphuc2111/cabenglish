"use client";

import { useSession } from "next-auth/react";
import { useModal } from "@/hooks/useModalStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface FirstLoginGuardProps {
  children: React.ReactNode;
}

/**
 * Component để kiểm tra first login và hiển thị modal chọn chế độ
 * ở tất cả các route khi user đăng nhập lần đầu
 */
export function FirstLoginGuard({ children }: FirstLoginGuardProps) {
  const { data: session, status } = useSession();
  const { onOpen, isOpen, type } = useModal();
  const pathname = usePathname();

  useEffect(() => {
    // Chỉ kiểm tra khi session đã load và user đã đăng nhập
    if (status === "loading") return;
    if (!session) return;
    
    // Bỏ qua các route không cần thiết
    const excludedRoutes = [
      "/signin-v2",
      "/login/callback",
      "/api",
      "/_next"
    ];
    
    const shouldExclude = excludedRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    if (shouldExclude) return;
    
    // Kiểm tra first login và modal chưa mở
    if (session.user.is_firstlogin && (!isOpen || type !== "teachingMode")) {
      onOpen("teachingMode");
    }
  }, [session, status, pathname, onOpen, isOpen, type]);

  return <>{children}</>;
}
