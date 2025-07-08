import { FC } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

interface ResetPasswordFormData {
  new_password: string;
  confirm_password: string;
}

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({
  onSubmit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) => {
  const form = useForm<ResetPasswordFormData>();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h2>
        <p className="text-gray-600">Tạo mật khẩu mới cho tài khoản của bạn</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new_password">Mật khẩu mới</Label>
          <div className="relative">
            <Input
              id="new_password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              className="bg-gray-100"
              {...form.register("new_password", { required: true })}
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
              {...form.register("confirm_password", {
                required: true,
                validate: (value) =>
                  value === form.watch("new_password") || "Mật khẩu không khớp"
              })}
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
      </form>
    </div>
  );
};

export default ResetPasswordForm;
