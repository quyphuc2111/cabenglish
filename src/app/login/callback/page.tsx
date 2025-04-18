"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { signInWithGoogleToken } from "@/lib/auth-helpers";

export default function LoginCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!searchParams) {
      console.error("Search params not available");
      setIsProcessing(false);
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
              roles: data.roles || []
            });

            if (authResult.success) {
              toast.success("Đăng nhập thành công!");
              router.push("/");
            } else {
              toast.error(
                "Không thể tạo phiên đăng nhập: " +
                  (authResult.error || "Lỗi không xác định")
              );
              setIsProcessing(false);
            }
          } else {
            toast.error(data.message || "Đăng nhập thất bại");
            setIsProcessing(false);
          }
        })
        .catch((err) => {
          console.error("Google callback error:", err);
          toast.error("Không thể xử lý đăng nhập Google");
          setIsProcessing(false);
        });
    } else {
      toast.error("Thiếu thông tin xác thực cần thiết");
      setIsProcessing(false);
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
          Đang xử lý đăng nhập...
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "24px",
            fontSize: "16px"
          }}
        >
          Vui lòng đợi trong khi chúng tôi đang xác thực thông tin của bạn.
        </p>

        {/* Loading spinner */}
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
