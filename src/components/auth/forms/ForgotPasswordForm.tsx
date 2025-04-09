import { FC } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  onSwitchForm: (type: string) => void;
}

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
  onSubmit,
  onSwitchForm
}) => {
  const form = useForm<ForgotPasswordFormData>();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Quên mật khẩu?</h2>
        <p className="text-gray-600">
          Nhập email của bạn để nhận link đặt lại mật khẩu
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Nhập email của bạn"
            className="bg-gray-100"
            {...form.register("email", { required: true })}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800"
          >
            Gửi yêu cầu
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onSwitchForm("signin")}
            className="w-full"
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
