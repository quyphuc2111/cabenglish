"use client"
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
    <header className="z-10 w-full bg-white border-b">
      <div className="flex h-16 items-center px-4 lg:px-6">
        <SheetMenu />
        
        {title != "GiftShop" && (
          <div className="lg:flex items-center gap-3 hidden">
            <h2 className="text-2xl font-semibold text-gray-800">Lớp 5C187</h2>
            <Button className="btn-orange-head flex gap-2 items-center">
              <Image
                src="/pool 1.png"
                width={20}
                height={20}
                alt="Learning"
              />
              Kết quả
            </Button>
            <Button className="btn-orange-head flex gap-2 items-center">
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/classroom/award.png"
                width={20}
                height={20}
                alt="Award"
              />
              Vinh danh
            </Button>
          </div>
        )}

        {type === 'course' && (
          <div className="gap-4 items-center hidden lg:flex">
            <button 
              className="cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={handleBack}
            >
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/backSmall.png"
                width={45}
                height={45}
                alt="Back"
              />
            </button>
            <h2 className="font-semibold text-xl text-zinc-700">{courseName[lastSlug]}</h2>
          </div>
        )}

        <div className="flex flex-1 items-center gap-3 justify-end">
          <div className="hidden lg:block">
            <Button className="btn__medium btn__cyan100 flex items-center justify-center">
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/icons/micro.png"
                width={24}
                height={24}
                alt="Microphone"
              />
            </Button>
          </div>
          <Button className="btn__medium btn__cyan100">Trang chủ</Button>
        </div>
      </div>
      
      {title != "GiftShop" && (
        <div className="flex items-center justify-between px-4 pb-3 lg:hidden">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Lớp 5C187</h2>
          <div className="flex gap-2">
            <Button className="btn-orange-head flex gap-1.5 items-center px-3 text-sm">
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/classroom/learning.png"
                width={18}
                height={18}
                alt="Learning"
              />
              Kết quả
            </Button>
            <Button className="btn-orange-head flex gap-1.5 items-center px-3 text-sm">
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/classroom/award.png"
                width={18}
                height={18}
                alt="Award"
              />
              Vinh danh
            </Button>
          </div>
        </div>
      )}

      {type === 'course' && (
        <div className="gap-3 items-center flex lg:hidden px-4 pb-3">
          <button 
            className="cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={handleBack}
          >
            <Image
              src="https://static.edupia.vn/uploads/v3/assets/images/backSmall.png"
              width={40}
              height={40}
              alt="Back"
            />
          </button>
          <h2 className="font-semibold text-lg text-zinc-700">{courseName[lastSlug]}</h2>
        </div>
      )}
    </header>
  );
}
