import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SignInV2FormProps {
  onSubmit: (data: SignInFormData) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  errorMessage?: string | null;
  onGoogleLogin: () => void;
  isLoading: boolean;
}

interface SignInFormData {
  email: string;
  password: string;
  remember_password: boolean;
}

const SignInV2Form: FC<SignInV2FormProps> = ({
  onSubmit,
  showPassword,
  setShowPassword,
  errorMessage,
  onGoogleLogin,
  isLoading
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>({
    defaultValues: {
      email:
        typeof window !== "undefined"
          ? localStorage.getItem("remember_email") || ""
          : "",
      remember_password:
        typeof window !== "undefined"
          ? localStorage.getItem("remember_password") === "true"
          : false
    }
  });

  return (
    <motion.form
      className="w-full space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">
          Email
        </Label>
        <Input
          id="email"
          placeholder="Nhập email của bạn"
          className="bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg"
          {...register("email", {
            required: "Vui lòng nhập email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Địa chỉ email không hợp lệ"
            }
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Mật khẩu
          </Label>
          <motion.a
            href="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Quên mật khẩu?
          </motion.a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu của bạn"
            className="bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg pr-10"
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
              }
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2 collapse">
        <Checkbox
          id="remember"
          {...register("remember_password")}
          className="text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor="remember"
          className="text-sm text-gray-600 cursor-pointer"
        >
          Ghi nhớ đăng nhập
        </label>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 font-medium shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang đăng
              nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </motion.div>

      <div className="relative flex items-center justify-center">
        <hr className="w-full border-gray-300" />
        <span className="absolute bg-white px-3 text-gray-500 text-sm">
          hoặc
        </span>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="button"
          onClick={onGoogleLogin}
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center gap-2 rounded-lg py-2.5 font-medium shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20px"
            height="20px"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Đăng nhập với Google
        </Button>
      </motion.div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          <p className="text-sm text-center">{errorMessage}</p>
        </motion.div>
      )}
    </motion.form>
  );
};

export default SignInV2Form;
