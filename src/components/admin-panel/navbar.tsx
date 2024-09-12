"use client"
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavbarProps {
  title: string;
  type?: string
}

type CourseNameMap = {
  [key: string]: string;
};

const courseName: CourseNameMap = {
  'tieng-anh-lop-1': "Tiếng anh lớp 1",
  'tieng-anh-lop-2': "Tiếng anh lớp 2",
  'tieng-anh-lop-3': "Tiếng anh lớp 3",
  'tieng-anh-lop-4': "Tiếng anh lớp 4",
  'tieng-anh-lop-5': "Tiếng anh lớp 5",
}

export function Navbar({ title, type }: NavbarProps) {
  // backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0
  const [lastSlug, setLastSlug] = useState<string | any>('');
  const router  = useRouter()

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const slug = parts.pop() || parts.pop(); 

    setLastSlug(slug);
  }, []);


  const handleBack = () => {
    router.push('/main/khoa-hoc')
  }
  return (
    <header className=" z-10 w-full ">
      <div className="flex h-14 items-center">
        <SheetMenu />
        {title != "GiftShop" && (
          <div className="lg:flex items-center space-x-4 lg:space-x-0 hidden ">
            <h2 className="text-2xl font-semibold">Lớp 5C187</h2>
            <Button className="btn-orange-head flex gap-2 items-center border">
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/classroom/learning.png"
                width={22}
                height={22}
                alt="Learning"
              />
              Kết quả
            </Button>
            <Button className="btn-orange-head flex gap-2 items-center border">
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/classroom/award.png"
                width={22}
                height={22}
                alt="Learning"
              />
              Vinh danh
            </Button>
          </div>
        )}

        {
          type === 'course' && (
           <div className="gap-4 items-center hidden lg:flex">
             <div className="cursor-pointer" onClick={handleBack}>
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/backSmall.png"
                width={45}
                height={45}
                alt="lesson"
              />
             </div>
             <h2 className="font-semibold text-xl text-zinc-600">{courseName[lastSlug]}</h2>
           </div>
          )
        }

        <div className="flex flex-1 items-center space-x-2 justify-end">
          {/* <ModeToggle /> */}
          {/* <UserNav /> */}
          <div className="hidden lg:block">
            <Button className="btn__medium btn__cyan100">
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/icons/micro.png"
                width={24}
                height={24}
                alt="Key"
              />
            </Button>
          </div>
          <Button className="btn__medium btn__cyan100">Trang chủ</Button>
        </div>
      </div>
      {title != "GiftShop" && (
        <div className="flex items-center justify-between space-x-4 lg:space-x-0 lg:hidden">
          <h2 className="text-md md:text-2xl font-semibold">Lớp 5C187</h2>
         <div className="flex">
         <Button className="btn-orange-head flex gap-2 items-center  px-2">
            <Image
              src="https://static.edupia.vn/uploads/v3/assets/images/classroom/learning.png"
              width={22}
              height={22}
              alt="Learning"
            />
            Kết quả
          </Button>
          <Button className="btn-orange-head flex gap-2 items-center  px-2">
            <Image
              src="https://static.edupia.vn/uploads/v3/assets/images/classroom/award.png"
              width={22}
              height={22}
              alt="Learning"
            />
            Vinh danh
          </Button>
         </div>
        </div>
      )}

{
          type === 'course' && (
           <div className="gap-4 items-center flex lg:hidden">
             <div className="cursor-pointer" onClick={handleBack}>
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/backSmall.png"
                width={45}
                height={45}
                alt="lesson"
              />
             </div>
             <h2 className="font-semibold text-xl text-zinc-600">{courseName[lastSlug]}</h2>
           </div>
          )
        }
    </header>
  );
}
