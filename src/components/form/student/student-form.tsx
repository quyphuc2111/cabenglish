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
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { format } from "date-fns";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon } from "lucide-react";
import { CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
// import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  name: z.string(),
  dateOfBirth: z.date(),
  gender: z.string(),
  classRoom: z.string()
});

type StudentFormValues = z.infer<typeof formSchema>;

interface StudentFormProps {
  initialData?: any | null;
}

const fieldLabels: Record<string, string> = {
  name: "BKT Dev",
  dateOfBirth: "Mật khẩu hiện tại",
  gender: "Mật khẩu mới",
  classRoom: "Nhập lại mật khẩu mới"
};

export const StudentForm: React.FC<StudentFormProps> = ({ initialData }) => {
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

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      dateOfBirth: new Date(),
      gender: "",
      classRoom: ""
    }
  });

  //   useEffect(() => {
  //     if (schoolData?.data && !schoolLoading) form.reset(schoolData.data);
  //   }, [schoolData, form, schoolLoading]);

  //   const watchFields = form.watch('IsLaDonViQuanLy');
  //   const { mutate: insertSchool } = useInsertSchool();
  //   const { mutate: updateSchool } = useUpdateSchool(params.schoolId);

  const onSubmit = async (data: StudentFormValues) => {
    setLoading(true);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5 flex flex-col"
        >
          <FormField
            key="name"
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold">
                  Họ và tên
                </FormLabel>
                <FormControl>
                  <Input
                    className="py-7 bg-[#f8f9f9] border-none rounded-2xl shadow-sm"
                    disabled={loading}
                    placeholder={`Nhập họ và tên...`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="flex flex-col lg:flex-row gap-5 lg:items-center">
        <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xl font-semibold">Ngày Sinh</FormLabel>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        variant="outline"
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-2">
                    <CalendarComponent
                      // initialFocus
                      mode="single"
                      selected={field.value ?? undefined}
                      translate="en"
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-xl font-semibold">
                  Giới tính
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-y-1"
                  >
                   <div className="flex items-center gap-5">
                   <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Nam</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Nữ</FormLabel>
                    </FormItem>
                   </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
          <FormField
            key="classRoom"
            control={form.control}
            name="classRoom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold">Lớp</FormLabel>
                <FormControl>
                  <Input
                    className="py-7 bg-[#f8f9f9] border-none rounded-2xl shadow-sm"
                    disabled={loading}
                    placeholder={`Lớp 3`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
