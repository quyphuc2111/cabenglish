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
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import axios from "axios";

interface AuthFormProps {
  type: "signup" | "signin" | "forgot_password" | "reset_password";
  animated: boolean;
  onSwitchForm?: (type: AuthFormProps["type"]) => void;
}

interface FormData {
  fullname?: string;
  email: string;
  password: string;
  confirm_password?: string;
  remember_password?: boolean;
}

interface LoginResponse {
  success: boolean;
  message?: string;
}

const AuthForm: FC<AuthFormProps> = ({ type, animated, onSwitchForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<FormData>();
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
        ease: "easeInOut"
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    if (type === "signin") {
      try {
      //   const login  = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`, {
      //     username: data.email,
      //     password: data.password,
      //     rememberMe: true
      //   });
      //   console.log(login.data);

      //   if (login.data) {
      //     router.push("/tong-quan");
      //     router.refresh();
      //   } else {
      //     setError("root", {
      //       type: "manual",
      //       message: login.data.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      //     });
      //   }


        
        const result = await signIn("credentials", {
          username: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError("root", {
            type: "manual",
            message: result.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
          });
        } else {
          router.push("/tong-quan");
          router.refresh();
        }
      } catch (error) {
        setError("root", {
          type: "manual",
          message: error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại sau."
        });
      }
    }
  };

  const renderForgotPasswordForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Quên mật khẩu?</h2>
        <p className="text-gray-600">
          Nhập email của bạn để nhận link đặt lại mật khẩu
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email", {
            required: "Email là bắt buộc",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email không hợp lệ"
            }
          })}
          id="email"
          type="email"
          placeholder="Nhập email của bạn"
          className="bg-gray-100"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800"
          onClick={() => onSwitchForm?.("reset_password")}
        >
          Gửi yêu cầu
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSwitchForm?.("signin")}
          className="w-full"
        >
          Quay lại đăng nhập
        </Button>
      </div>
    </div>
  );

  const renderResetPasswordForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h2>
        <p className="text-gray-600">Tạo mật khẩu mới cho tài khoản của bạn</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="new_password">Mật khẩu mới</Label>
        <div className="relative">
          <Input
            id="new_password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
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

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Xác nhận mật khẩu mới</Label>
        <div className="relative">
          <Input
            id="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
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

      <Button
        type="submit"
        className="w-full bg-purple-700 hover:bg-purple-800"
      >
        Đặt lại mật khẩu
      </Button>
    </div>
  );

  const renderAuthForm = () => (
    <>
      <h1 className="text-3xl font-bold">{t(`${type}`)}</h1>

      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="fullname">Họ và tên</Label>
            <Input
              {...register("fullname", {
                required: "Họ và tên là bắt buộc"
              })}
              id="fullname"
              type="text"
              placeholder="Họ và tên"
              className="bg-gray-100"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname.message}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email", {
              required: "Email là bắt buộc"
              // pattern: {
              //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              //   message: "Email không hợp lệ"
              // }
            })}
            id="email"
            // type="email"
            placeholder="Email của bạn 123"
            className="bg-gray-100"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Input
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 3,
                  message: "Mật khẩu phải có ít nhất 3 ký tự"
                }
              })}
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
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {type === "signin" && (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                {...register("remember_password")}
                id="remember_password"
              />
              <Label htmlFor="remember_password">Nhớ mật khẩu</Label>
            </div>
            <Button
              type="button"
              variant="link"
              className="text-[#3454E6] p-0"
              onClick={() => onSwitchForm?.("forgot_password")}
            >
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

        {errors.root && (
          <p className="text-red-500 text-sm text-center">
            {errors.root.message}
          </p>
        )}

        <div
          className={`flex ${
            type === "signup" ? "justify-end" : "justify-start"
          }`}
        >
          <Button
            type="submit"
            className="w-3/4 bg-purple-700 hover:bg-purple-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : t(`${type}`)}
          </Button>
        </div>
      </form>
    </>
  );

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
      {type === "forgot_password"
        ? renderForgotPasswordForm()
        : type === "reset_password"
        ? renderResetPasswordForm()
        : renderAuthForm()}
    </motion.div>
  );
};

export default AuthForm;
