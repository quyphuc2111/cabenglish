"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo
} from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TokenValidationContextType {
  isChecking: boolean;
  isTokenValid: boolean;
  isSigningOut: boolean;
}

const TokenValidationContext = createContext<TokenValidationContextType>({
  isChecking: false,
  isTokenValid: true,
  isSigningOut: false
});

export const useTokenValidation = () => useContext(TokenValidationContext);

interface TokenValidationProviderProps {
  children: React.ReactNode;
}

export function TokenValidationProvider({
  children
}: TokenValidationProviderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingRef = useRef(false);
  const hasSignedOutRef = useRef(false); // Tránh multiple sign outs
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const checkRefreshToken = useCallback(async () => {
    // Tránh check đồng thời hoặc khi đã sign out
    if (isCheckingRef.current || hasSignedOutRef.current) return;

    try {
      isCheckingRef.current = true;

      const response = await fetch("/api/check-refresh-token", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        console.warn("Refresh token invalid or expired, signing out...");

        // Tránh multiple sign outs
        if (hasSignedOutRef.current) return;

        hasSignedOutRef.current = true;
        setIsTokenValid(false);
        setIsSigningOut(true);

        // Clear interval trước khi đăng xuất
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Đăng xuất và chuyển về trang đăng nhập - không await để tránh blocking
        signOut({
          redirect: false,
          callbackUrl: "/signin-v2"
        })
          .then(() => {
            // Sử dụng window.location để force redirect
            window.location.href = "/signin-v2";
          })
          .catch((signOutError) => {
            console.error("Error during sign out:", signOutError);
            // Force redirect nếu signOut fail
            window.location.href = "/signin-v2";
          });

        return;
      }

      const data = await response.json();
      setIsTokenValid(true);
      console.log("Token validation successful:", data);
    } catch (error) {
      console.error("Error checking refresh token:", error);
      // Không đăng xuất nếu là lỗi network, có thể là tạm thời
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Chỉ check khi user đã đăng nhập và có session, và chưa sign out
    if (
      status === "authenticated" &&
      session?.user?.authCookie &&
      !hasSignedOutRef.current
    ) {
      // Check ngay lập tức khi component mount
      checkRefreshToken();

      // Sau đó check mỗi 5 phút (300,000ms)
      intervalRef.current = setInterval(checkRefreshToken, 5 * 60 * 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [status, session?.user?.authCookie, checkRefreshToken]);

  // Reset hasSignedOutRef khi status thay đổi (để handle login lại)
  useEffect(() => {
    if (status === "unauthenticated") {
      hasSignedOutRef.current = false;
      setIsSigningOut(false);
      setIsTokenValid(true);
    }
  }, [status]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Memoize context value để tránh re-render không cần thiết
  const contextValue = useMemo(
    () => ({
      isChecking: isCheckingRef.current,
      isTokenValid,
      isSigningOut
    }),
    [isTokenValid, isSigningOut]
  );

  // Luôn render children để tránh hook errors, chỉ hiển thị loading overlay
  return (
    <TokenValidationContext.Provider value={contextValue}>
      {children}
      {isSigningOut && hasSignedOutRef.current && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>Đang đăng xuất...</p>
          </div>
        </div>
      )}
    </TokenValidationContext.Provider>
  );
}
