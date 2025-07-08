import { FC } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface SignInFormProps {
  onSubmit: (data: SignInFormData) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onSwitchForm: (type: string) => void;
  errorMessage?: string | null;
  onGoogleLogin: () => void;
}

interface SignInFormData {
  email: string;
  password: string;
  remember_password: boolean;
}

const SignInForm: FC<SignInFormProps> = ({
  onSubmit,
  showPassword,
  setShowPassword,
  onSwitchForm,
  errorMessage,
  onGoogleLogin
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
    <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Email của bạn"
          className="bg-gray-100"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">Vui lòng nhập email</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            className="bg-gray-100"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">Vui lòng nhập mật khẩu</p>
          )}
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

      <div className="flex justify-center">
        <Button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 rounded-md font-medium py-2"
        >
          Đăng nhập
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          onClick={onGoogleLogin}
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2 rounded-md font-medium py-2"
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
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
    </form>
  );
};

export default SignInForm;
