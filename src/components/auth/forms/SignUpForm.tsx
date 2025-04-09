import { FC } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

interface SignUpFormData {
  fullname: string;
  email: string;
  password: string;
  confirm_password: string;
}

const SignUpForm: FC<SignUpFormProps> = ({
  onSubmit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) => {
  const form = useForm<SignUpFormData>();

  return (
    <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="fullname">Họ và tên</Label>
        <Input
          id="fullname"
          type="text"
          placeholder="Họ và tên"
          className="bg-gray-100"
          {...form.register("fullname", { required: true })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Email của bạn"
          className="bg-gray-100"
          {...form.register("email", { required: true })}
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
            {...form.register("password", { required: true })}
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
        <Label htmlFor="confirm_password">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Input
            id="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            className="bg-gray-100"
            {...form.register("confirm_password", { required: true })}
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

      <div className="flex justify-end">
        <Button
          type="submit"
          className="w-3/4 bg-purple-700 hover:bg-purple-800"
        >
          Đăng ký
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
