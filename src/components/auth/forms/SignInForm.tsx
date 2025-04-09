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
  onSwitchForm
}) => {
  const form = useForm<SignInFormData>();

  return (
    <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember_password"
            {...form.register("remember_password")}
          />
          <Label htmlFor="remember_password">Nhớ mật khẩu</Label>
        </div>
        <Button
          type="button"
          variant="link"
          className="text-[#3454E6] p-0"
          onClick={() => onSwitchForm("forgot_password")}
        >
          Quên mật khẩu?
        </Button>
      </div>

      <div className="flex justify-start">
        <Button
          type="submit"
          className="w-3/4 bg-purple-700 hover:bg-purple-800"
        >
          Đăng nhập
        </Button>
      </div>
    </form>
  );
};

export default SignInForm;
