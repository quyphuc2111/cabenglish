"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AuthForm from "./AuthForm";
import Image from "next/image";

interface AuthFormProps {
  type: "signup" | "signin" | "forgot_password" | "reset_password";
  animated: boolean;
  onSwitchForm: (
    type: "signin" | "signup" | "forgot_password" | "reset_password"
  ) => void;
}

const AuthContainer = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [formType, setFormType] = useState<
    "signin" | "signup" | "forgot_password" | "reset_password"
  >("signin");

  const handleSwitchForm = (
    type: "signin" | "signup" | "forgot_password" | "reset_password"
  ) => {
    // Clear any existing recaptcha token before switching forms
    localStorage.removeItem("recapt_token");

    setFormType(type);
    if (type === "forgot_password") {
      setIsSignIn(true);
    }
    if (type === "signin") {
      setIsSignIn(false);
    }
  };

  const handleToggleForm = () => {
    // Clear any existing recaptcha token before toggling
    localStorage.removeItem("recapt_token");

    setIsSignIn(!isSignIn);
    setFormType(isSignIn ? "signin" : "signup");
  };

  return (
    <div className="relative w-full max-w-3xl bg-white shadow-lg overflow-hidden rounded-3xl">
      <div className="flex w-full min-h-[620px]">
        <AuthForm
          type={formType}
          animated={isSignIn}
          onSwitchForm={handleSwitchForm}
        />
        {(formType === "signin" || formType === "signup") && (
          <AuthForm
            type={formType === "signin" ? "signup" : "signin"}
            animated={isSignIn}
            onSwitchForm={handleSwitchForm}
          />
        )}
      </div>
      <motion.div
        className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-purple-500 to-indigo-600"
        initial={false}
        animate={{
          x: isSignIn ? "-100%" : "0%",
          borderTopRightRadius: isSignIn ? "150px" : "0px",
          borderBottomRightRadius: isSignIn ? "150px" : "0px",
          borderTopLeftRadius: isSignIn ? "0px" : "150px",
          borderBottomLeftRadius: isSignIn ? "0px" : "150px"
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <div className="absolute w-full h-full flex items-start justify-center flex-col p-10 pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white"
          >
            Chào mừng bạn tham gia SmartKid
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white mt-4"
          >
            Đăng ký với thông tin cá nhân của bạn để sử dụng tất cả các tính
            năng của trang web.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              animate={{
                width: isSignIn ? 120 : 110,
                rotate: isSignIn ? 360 : 0,
                transition: {
                  duration: 0.5,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }
              }}
            >
              <Button
                variant="outline"
                className="mt-4 hover:text-white border-white hover:bg-white/20 bg-white w-full"
                onClick={handleToggleForm}
              >
                {isSignIn ? "Đến đăng nhập" : "Đến đăng ký"}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-0 w-full"
            animate={{
              x: isSignIn ? "-10%" : "50%"
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <Image
              src="/auth/tree.png"
              width={150}
              height={150}
              quality={100}
              priority
              className="object-contain"
              alt="child_with_tree"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthContainer;
