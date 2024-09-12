"use client"
import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, PanelsTopLeft } from "lucide-react";
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

import logo from "@/assets/logo_bkt.png";
import HeroSection from "@/components/about/HeroSection";
import StatisticalSection from "@/components/about/StatisticalSection";
import MissionSection from "@/components/about/MissionSection";
import ForYouSection from "@/components/about/ForYouSection";
import PlatformSection from "@/components/about/PlatformSection";
import OfficeSection from "@/components/about/OfficeSection";
import { Badge } from "@/components/ui/badge";
import AdviSection from "@/components/about/AdviSection";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-screen">
      <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
        <div className="container h-14 flex items-center">
          <Link
            href="/"
            className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
          >
            {/* <PanelsTopLeft className="w-6 h-6 mr-3" /> */}
            {/* <span className="font-bold">shadcn/ui sidebar</span>
            <span className="sr-only">shadcn/ui sidebar</span> */}
            <Image
              src={logo}
              width={122}
              height={42}
              alt="demo"
              priority
              className="border rounded-xl shadow-sm dark:hidden"
            />
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 bg-background"
              asChild
            >
              <Link href="https://github.com/salimi-my/shadcn-ui-sidebar">
                <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
              </Link>
            </Button> */}
            <Button onClick={() => router.push('/signin')} className="bg-green-600" variant={"default"}>Đăng nhập</Button>
            {/* <ModeToggle /> */}
          </nav>
        </div>
      </header>
      <main>
        <HeroSection />
        <StatisticalSection />
        <MissionSection />
        <ForYouSection />
        <OfficeSection />
        <PlatformSection />
        <AdviSection />
      </main>
  
      <footer className=" bg-[#005b94] text-white">
        <div className="py-6 md:py-20 border-t border-border/40 container">
          <div className="md:grid md:grid-cols-4 border-b border-gray-50 py-10">
            <div className="col-span-1">
              <div className="flex flex-col gap-5">
                <Image
                  src={logo}
                  width={150}
                  height={100}
                  alt="demo"
                  priority
                  className="border rounded-xl shadow-sm dark:hidden"
                />
                <p className="font-semibold text-xl">
                  Công ty cổ phần đầu tư thương mại và công nghệ BKT
                </p>
              </div>
            </div>
            <div className="col-span-2">
              <div className="md:flex md:flex-wrap">
                <div className="md:w-1/2 p-2">
                  <Badge className="mb-2 bg-green-600">Hà Nội</Badge>
                  <div className="grid grid-cols-4">
                    <MapPinIcon className="w-8 h-8 col-span-1" />
                    <p className="col-span-3 -ml-8">
                      Liền kề C39 Embassy Garden, Đ. Hoàng Minh Thảo, Khu đô thị
                      Tây Hồ Tây, Bắc Từ Liêm, Hà Nội
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 p-2">
                  <Badge className="mb-2 bg-green-600">Thanh Hóa</Badge>
                  <div className="grid grid-cols-4">
                    <MapPinIcon className="w-8 h-8 col-span-1" />
                    <p className="col-span-3 -ml-8">
                    Số 15 Ngô Thì Nhậm, Phường Ngọc Trạo, TP Thanh Hóa, Tỉnh Thanh Hóa
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 p-2">
                  <Badge className="mb-2 bg-green-600">Đà nẵng</Badge>
                  <div className="grid grid-cols-4">
                    <MapPinIcon className="w-8 h-8 col-span-1" />
                    <p className="col-span-3 -ml-8">
                    22/35 Thúc Tề, Phường Hòa Khê, Q.Thanh Khê, TP Đà Nẵng
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 p-2">
                  <Badge className="mb-2 bg-green-600">Bình định</Badge>
                  <div className="grid grid-cols-4">
                    <MapPinIcon className="w-8 h-8 col-span-1" />
                    <p className="col-span-3 -ml-8">
                    49 Trần Anh Tông, TP Quy Nhơn, Tỉnh Bình Định
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 md:px-5">
              <h2 className="text-xl font-semibold mb-2">Hotline</h2>
              <ul className="flex flex-col gap-2">
                <li>Điện thoại: 0243 752 5253</li>
                <li>Kỹ thuật ( 24/7 ): 033 721 8868</li>
                <li>Kinh doanh: 086 817 9599</li>
              </ul>
            </div>
          </div>
          <p className="text-sm mt-3"> Copyright © 2024 BKT Company | All Rights Reserved</p>
        </div>
       
      </footer>
    </div>
  );
}
