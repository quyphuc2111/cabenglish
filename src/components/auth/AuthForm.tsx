"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import axios from "axios";
import { GoogleReCaptchaCheckbox } from "@google-recaptcha/react";
import { showToast } from "@/utils/toast-config";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/useModalStore";

import ForgotPasswordForm from "./forms/ForgotPasswordForm";
import ResetPasswordForm from "./forms/ResetPasswordForm";
import SignInForm from "./forms/SignInForm";
import SignUpForm from "./forms/SignUpForm";

interface AuthFormProps {
  type: "signup" | "signin" | "forgot_password" | "reset_password";
  animated: boolean;
  onSwitchForm?: (type: AuthFormProps["type"]) => void;
}

const domain = `${process.env.NEXT_PUBLIC_BKT_ACCOUNT_API_URL}`;

const AuthForm: FC<AuthFormProps> = ({ type, animated, onSwitchForm }) => {
  const router = useRouter();
  const { onOpen } = useModal();
  const { t } = useTranslation("", "common");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("1234567890");
  const [isActive, setIsActive] = useState(true);
  const [recaptchaKey, setRecaptchaKey] = useState(Date.now());

  const formVariants = {
    hidden: { opacity: 0, x: type === "signin" ? -100 : 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const handleSignIn = async (data: any) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (result?.error) {
        showToast.error(
          result.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        );
      } else {
        router.push("/tong-quan");
        router.refresh();
      }
    } catch (error) {
      showToast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    }
  };

  const handleSignUp = async (data: any) => {
    try {
      const recaptchaToken = localStorage.getItem("recapt_token");
      if (!recaptchaToken) {
        showToast.error("Vui lòng xác nhận reCAPTCHA trước khi đăng ký.");
        return;
      }
      const username = data.email.split("@")[0];
      const signupResponse = await axios.post(
        `${domain}/api/Account/register`,
        {
          username: username,
          email: data.email,
          password: data.password,
          full_name: data.fullname,
          phone_number: phoneNumber,
          app_id: 1,
          recaptcha_token: recaptchaToken
        }
      );
      if (signupResponse.data.success) {
        showToast.success("Đăng ký thành công. Vui lòng đăng nhập.");
        setTimeout(() => {
          router.push("/signin");
          router.refresh();
        }, 2000);
      } else {
        showToast.error(signupResponse.data.message || "Đăng ký thất bại.");
        localStorage.removeItem("recapt_token");
      }
    } catch (error: any) {
      showToast.error(
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
      localStorage.removeItem("recapt_token");
    }
  };

  const handleForgotPassword = async (data: any) => {
    // TODO: Implement forgot password API call
    showToast.success("Yêu cầu đặt lại mật khẩu đã được gửi (giả lập).");
    onSwitchForm?.("reset_password");
  };

  const handleResetPassword = async (data: any) => {
    // TODO: Implement reset password API call
    showToast.success("Mật khẩu đã được đặt lại thành công (giả lập).");
    onSwitchForm?.("signin");
  };

  useEffect(() => {
    setIsActive(
      (type === "signin" && !animated) ||
        (type === "signup" && animated) ||
        type === "forgot_password" ||
        type === "reset_password"
    );

    const token = localStorage.getItem("recapt_token");
    if (token) {
      localStorage.removeItem("recapt_token");
    }
  }, [type, animated]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className={cn(
        "absolute top-0 h-full w-1/2 flex items-center justify-center gap-2 flex-col p-10 transition-all duration-700 ease-in-out",
        type === "signin" ? "" : "right-0"
      )}
    >
      {type === "forgot_password" && (
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          onSwitchForm={(t) => onSwitchForm?.(t as AuthFormProps["type"])}
        />
      )}

      {type === "reset_password" && (
        <ResetPasswordForm
          onSubmit={handleResetPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
        />
      )}

      {type === "signin" && (
        <SignInForm
          onSubmit={handleSignIn}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSwitchForm={(t) => onSwitchForm?.(t as AuthFormProps["type"])}
        />
      )}

      {type === "signup" && (
        <>
          <SignUpForm
            onSubmit={handleSignUp}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
          {isActive && (
            <div className="mb-2">
              <GoogleReCaptchaCheckbox
                key={`recaptcha-${type}-${recaptchaKey}`}
                onChange={(token) => {
                  try {
                    localStorage.setItem("recapt_token", token);
                  } catch (error) {
                    console.error("Lỗi khi đặt token:", error);
                  }
                }}
                onExpired={() => {
                  try {
                    localStorage.removeItem("recapt_token");
                  } catch (error) {
                    console.error("Lỗi khi xóa token:", error);
                  }
                }}
              />
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AuthForm;
