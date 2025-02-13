"use client";

import { FC, useState } from "react";
import SocialIcons from "./SocialIcons";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";

interface AuthFormProps {
  type: "signup" | "signin";
  animated: boolean;
}

const AuthForm: FC<AuthFormProps> = ({ type, animated }) => {
  const router = useRouter();
  const { onOpen } = useModal();
  const { t } = useTranslation("", "common");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formVariants = {
    hidden: { opacity: 0, x: type === "signin" ? -100 : 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onOpen("teachingMode");
  };

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
      <h1 className="text-3xl font-bold">{t(`${type}`)}</h1>

      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="fullname">Họ và tên</Label>
            <Input
              id="fullname"
              type="text"
              placeholder="Họ và tên"
              className="bg-gray-100"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email của bạn"
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {type === "signin" && (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember_password" />
              <Label htmlFor="remember_password">Nhớ mật khẩu</Label>
            </div>
            <Button variant="link" className="text-[#3454E6] p-0">
              Quên mật khẩu?
            </Button>
          </div>
        )}

        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                className="bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        <div className={`flex ${type == "signup" ? "justify-end" : "justify-start" }`}>
          <Button
            type="submit"
            className="w-3/4 bg-purple-700 hover:bg-purple-800"
          >
            {t(`${type}`)}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AuthForm;