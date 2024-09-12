"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from '../ui/use-toast';

const formSchema = z.object({});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData?: any | null;
}

const fieldLabels: Record<string, string> = {
  userName: "Username",
  password: "Mật khẩu hiện tại",
  newPassword: "Mật khẩu mới",
  rePassword: "Nhập lại mật khẩu mới",
  vipsCount: ""
};

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const params: any = useParams();
  const router = useRouter();
  //   const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Chỉnh sửa trường học" : "Tạo mới trường học";
  const description = initialData
    ? "Chỉnh sửa trường dữ liệu."
    : "Thêm mới trường học";
  const toastMessage = initialData
    ? "Cập nhật thành công"
    : "Tạo mới trường học thành công!";
  const action = initialData ? "Lưu" : "Xác nhận";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      userName: "",
      password: "",
      newPassword: "",
      rePassword: "",
      vipsCount: ""
    }
  });

  //   useEffect(() => {
  //     if (schoolData?.data && !schoolLoading) form.reset(schoolData.data);
  //   }, [schoolData, form, schoolLoading]);

  //   const watchFields = form.watch('IsLaDonViQuanLy');
  //   const { mutate: insertSchool } = useInsertSchool();
  //   const { mutate: updateSchool } = useUpdateSchool(params.schoolId);

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5 flex flex-col"
        >
          {["userName", "password", "newPassword", "rePassword"].map(
            (field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as keyof UserFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-semibold">
                      {fieldLabels[field.name] || field.name}
                    </FormLabel>
                    <FormControl>
                      <Input
                      className="py-7 bg-[#f8f9f9] border-none rounded-2xl shadow-sm"
                        disabled={loading}
                        placeholder={`Nhập ${(
                          fieldLabels[field.name] || field.name
                        ).toLowerCase()}...`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          )}

         <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Số ngày VIP</h3>
            <p className="text-xl font-semibold">Còn 99999 ngày</p>
         </div>

         <Button className="bg-[#e9f8f9] py-7 rounded-2xl border-dashed border border-[#21bdc6] hover:bg-[#21bdc6] text-[#21bdc6] hover:text-white hover:border-white">
            <span className="text-md ">Gia hạn số ngày VIP</span>
         </Button>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
