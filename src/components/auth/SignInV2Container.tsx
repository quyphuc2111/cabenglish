"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { showToast } from "@/utils/toast-config";
import SignInV2Form from "./forms/SignInV2Form";

const SignInV2Container = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (result?.error) {
        setErrorMessage(
          result.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        );
        showToast.error(
          result.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        );
      } else {
        setErrorMessage(null);
        // Call external API as per user request
        try {
          // lấy moodle cookies
          const domain = process.env.NEXT_PUBLIC_BKT_ACCOUNT_API_URL;
          if (!domain) {
            console.error("API domain is not set");
            return;
          }
          const url = `${domain}/api/Moodle/login-default`;
          await axios.post(url, {}, { withCredentials: true });
        } catch (apiError) {
          // Optionally handle API error, but do not block login flow
          console.error("External API login error:", apiError);
        }

        // Save remember_password + email if checked
        if (data.remember_password) {
          localStorage.setItem("remember_password", "true");
          localStorage.setItem("remember_email", data.email);
        } else {
          localStorage.removeItem("remember_password");
          localStorage.removeItem("remember_email");
        }
        router.push("/tong-quan");
        router.refresh();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
      showToast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirectUri = `${window.location.origin}/login/callback`;

    fetch(`/api/auth/google?redirectUri=${encodeURIComponent(redirectUri)}`, {
      method: "GET",
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.authUrl) {
          window.open(data.authUrl, "_self");
        } else {
          showToast.error(data.message || "Lỗi khi khởi tạo đăng nhập Google.");
        }
      })
      .catch((err) => {
        console.error("Google login error:", err);
        showToast.error("Không thể kết nối đến máy chủ để đăng nhập Google.");
      });
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/bkt_logo.png"
              alt="Smart Kids Logo"
              width={150}
              height={60}
              className="object-contain"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Đăng nhập vào Smart Kids
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục.
            </p>
          </motion.div>

          <SignInV2Form
            onSubmit={handleSignIn}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            errorMessage={errorMessage}
            onGoogleLogin={handleGoogleLogin}
            isLoading={isLoading}
          />
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-4 hidden">
          <div className="flex items-center justify-between">
            <p className="text-white text-sm">Chưa có tài khoản?</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white text-sm font-medium hover:underline"
              onClick={() => router.push("/signin-v2")}
            >
              Đăng ký ngay
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Smart Kids. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default SignInV2Container;
