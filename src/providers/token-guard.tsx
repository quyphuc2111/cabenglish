"use client";

import { useTokenValidation } from "./token-validation-provider";
import { ReactNode } from "react";

interface TokenGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function TokenGuard({ children, fallback = null }: TokenGuardProps) {
  const { isTokenValid, isSigningOut } = useTokenValidation();

  // Nếu đang sign out hoặc token không hợp lệ, không render children
  if (isSigningOut || !isTokenValid) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
