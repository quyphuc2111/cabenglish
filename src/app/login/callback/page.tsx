"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { signInWithGoogleToken } from "@/lib/auth-helpers";
import axios from "axios";

function LoginCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBackToLogin = () => {
    router.push("/signin-v2");
  };

  useEffect(() => {
    if (!searchParams) {
      console.error("Search params not available");
      const errorMsg = "Không thể tải thông tin xác thực";
      setErrorMessage(errorMsg);
      setIsProcessing(false);
      // Auto redirect back to login page after showing error
      setTimeout(() => {
        router.push("/signin-v2");
      }, 5000);
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      // First call our API route to validate the code with the backend
      fetch(`/api/auth/google/callback?code=${code}&state=${state}`, {
        method: "GET",
        credentials: "include"
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success) {
            // Use the returned data to create a NextAuth session
            const authResult = await signInWithGoogleToken({
              accessToken: data.accessToken,
              accountId: data.accountId,
              username: data.username,
              email: data.email,
              roles: data.roles || [],
              authCookie: data.authCookie // Add the auth cookie to the sign-in credentials
            });

            if (authResult.success) {
              toast.success("Đăng nhập thành công!");
              // Redirect to the dashboard or home page
              router.push("/tong-quan");
            } else {
              const errorMsg =
                "Không thể tạo phiên đăng nhập: " +
                (authResult.error || "Lỗi không xác định");
              toast.error(errorMsg);
              setErrorMessage(errorMsg);
              setIsProcessing(false);
              // Auto redirect back to login page after showing error
              setTimeout(() => {
                router.push("/signin-v2");
              }, 5000);
            }
          } else {
            const errorMsg = data.message || "Đăng nhập thất bại";
            toast.error(errorMsg);
            setErrorMessage(errorMsg);
            setIsProcessing(false);
            // Auto redirect back to login page after showing error
            setTimeout(() => {
              router.push("/signin-v2");
            }, 5000);
          }
        })
        .catch((err) => {
          console.error("Google callback error:", err);
          const errorMsg = "Không thể xử lý đăng nhập Google";
          toast.error(errorMsg);
          setErrorMessage(errorMsg);
          setIsProcessing(false);
          // Auto redirect back to login page after showing error
          setTimeout(() => {
            router.push("/signin-v2");
          }, 5000);
        });
    } else {
      const errorMsg = "Thiếu thông tin xác thực cần thiết";
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
      setIsProcessing(false);
      // Auto redirect back to login page after showing error
      setTimeout(() => {
        router.push("/signin-v2");
      }, 5000);
    }
  }, [searchParams, router]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          padding: "40px",
          textAlign: "center",
          maxWidth: "450px",
          width: "90%"
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          {/* Logo placeholder - replace with your actual logo */}
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#4a6fa5",
              marginBottom: "10px"
            }}
          >
            BKT SmartKids
          </div>
        </div>

        <h1
          style={{
            fontSize: "24px",
            color: "#333",
            marginBottom: "16px",
            fontWeight: "600"
          }}
        >
          {isProcessing ? "Đang xử lý đăng nhập..." : "Đăng nhập thất bại"}
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "24px",
            fontSize: "16px"
          }}
        >
          {isProcessing
            ? "Vui lòng đợi trong khi chúng tôi đang xác thực thông tin của bạn."
            : "Có lỗi xảy ra trong quá trình đăng nhập. Bạn sẽ được chuyển về trang đăng nhập."}
        </p>

        {errorMessage && !isProcessing && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "20px",
              color: "#dc2626",
              fontSize: "14px"
            }}
          >
            {errorMessage}
          </div>
        )}

        {isProcessing ? (
          // Loading spinner
          <div
            style={{
              display: "inline-block",
              width: "50px",
              height: "50px",
              border: "5px solid rgba(74, 111, 165, 0.2)",
              borderRadius: "50%",
              borderTop: "5px solid #4a6fa5",
              animation: "spin 1s linear infinite",
              marginTop: "10px"
            }}
          ></div>
        ) : (
          // Error state with manual redirect button
          <button
            onClick={handleBackToLogin}
            style={{
              backgroundColor: "#4a6fa5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
              marginTop: "10px"
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#3d5a94")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#4a6fa5")
            }
          >
            Quay về trang đăng nhập
          </button>
        )}

        {/* Add keyframes for the spinner animation */}
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      }}
    >
      <div style={{ color: "#4a6fa5", fontSize: "18px" }}>Đang tải...</div>
    </div>
  );
}

export default function LoginCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginCallbackContent />
    </Suspense>
  );
}
