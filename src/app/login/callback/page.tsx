"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function LoginCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams) {
      // Handle the case where searchParams is null, maybe show an error or wait
      console.error("Search params not available");
      return;
    }
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      // Call our API route that handles session creation
      fetch(`/api/auth/google/callback?code=${code}&state=${state}`, {
        method: "GET",
        credentials: "include"
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            toast.success(data.message || "Đăng nhập thành công!");

            // Redirect to home page
            router.push("/");
          } else {
            toast.error(data.message || "Đăng nhập thất bại");
          }
        })
        .catch((err) => {
          console.error("Google callback error:", err);
          toast.error("Không thể xử lý đăng nhập Google");
        });
    } else {
      toast.error("Thiếu thông tin xác thực cần thiết");
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
