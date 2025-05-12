"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import logo from "@/assets/logo_bkt.png";
import HeroSection from "@/components/about/HeroSection";
import StatisticalSection from "@/components/about/StatisticalSection";
import MissionSection from "@/components/about/MissionSection";
import ForYouSection from "@/components/about/ForYouSection";
import PlatformSection from "@/components/about/PlatformSection";
import OfficeSection from "@/components/about/OfficeSection";
import AdviSection from "@/components/about/AdviSection";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Head from "next/head";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const { t } = useTranslation("", "common");
  const router = useRouter();

  // Sử dụng useInView cho các section
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [missionRef, missionInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <>
      <Head>
        <title>BKT - Công ty cổ phần đầu tư thương mại và công nghệ</title>
        <meta
          name="description"
          content="BKT - Đơn vị hàng đầu trong lĩnh vực công nghệ giáo dục, cung cấp giải pháp toàn diện cho việc học tập và giảng dạy."
        />
        <meta
          name="keywords"
          content="BKT, công nghệ giáo dục, edtech, elearning, giáo dục trực tuyến"
        />
        <meta
          property="og:title"
          content="BKT - Công ty cổ phần đầu tư thương mại và công nghệ"
        />
        <meta
          property="og:description"
          content="BKT - Đơn vị hàng đầu trong lĩnh vực công nghệ giáo dục"
        />
        <meta property="og:image" content="/og-image.jpg" />
        <link rel="canonical" href="https://bkt.com.vn" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
          <div className="container h-14 flex items-center">
            <Link
              href="/"
              className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
              aria-label="BKT Logo"
            >
              <Image
                src={logo}
                width={122}
                height={42}
                alt="BKT Logo"
                priority
                className="border rounded-xl shadow-sm dark:hidden"
              />
            </Link>
            <nav className="ml-auto flex items-center gap-2">
              <Button
                onClick={() => router.push("/signin-v2")}
                className="bg-green-600 hover:bg-green-700 transition-colors duration-300"
                variant="default"
              >
                Đăng nhập
              </Button>
            </nav>
          </div>
        </header>

        <main>
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <HeroSection />
          </motion.div>

          <motion.div
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <StatisticalSection />
          </motion.div>

          <motion.div
            ref={missionRef}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <MissionSection />
          </motion.div>

          <ForYouSection />
          <OfficeSection />
          <PlatformSection />
          <AdviSection />
        </main>

        <footer className="bg-[#005b94] text-white">
          <div className="py-6 md:py-20 border-t border-border/40 container">
            <motion.div
              className="md:grid md:grid-cols-4 border-b border-gray-50 py-10"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div className="col-span-1" variants={fadeInUp}>
                <div className="flex flex-col gap-5">
                  <Image
                    src={logo}
                    width={150}
                    height={100}
                    alt="BKT Logo Footer"
                    priority
                    className="border rounded-xl shadow-sm dark:hidden"
                  />
                  <h2 className="font-semibold text-xl">
                    Công ty cổ phần đầu tư thương mại và công nghệ BKT
                  </h2>
                </div>
              </motion.div>

              <motion.div className="col-span-2" variants={fadeInUp}>
                <div className="md:flex md:flex-wrap">
                  {[
                    {
                      city: "Hà Nội",
                      address:
                        "Liền kề C39 Embassy Garden, Đ. Hoàng Minh Thảo, Khu đô thị Tây Hồ Tây, Bắc Từ Liêm, Hà Nội"
                    },
                    {
                      city: "Thanh Hóa",
                      address:
                        "Số 15 Ngô Thì Nhậm, Phường Ngọc Trạo, TP Thanh Hóa, Tỉnh Thanh Hóa"
                    },
                    {
                      city: "Đà Nẵng",
                      address:
                        "22/35 Thúc Tề, Phường Hòa Khê, Q.Thanh Khê, TP Đà Nẵng"
                    },
                    {
                      city: "Bình Định",
                      address: "49 Trần Anh Tông, TP Quy Nhơn, Tỉnh Bình Định"
                    }
                  ].map((location, index) => (
                    <motion.div
                      key={location.city}
                      className="md:w-1/2 p-2"
                      variants={fadeInUp}
                    >
                      <Badge className="mb-2 bg-green-600">
                        {location.city}
                      </Badge>
                      <div className="grid grid-cols-4">
                        <MapPinIcon className="w-8 h-8 col-span-1" />
                        <p className="col-span-3 -ml-8">{location.address}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="col-span-1 md:px-5" variants={fadeInUp}>
                <h2 className="text-xl font-semibold mb-2">Hotline</h2>
                <ul className="flex flex-col gap-2">
                  <li>
                    Điện thoại:{" "}
                    <a href="tel:02437525253" className="hover:underline">
                      0243 752 5253
                    </a>
                  </li>
                  <li>
                    Kỹ thuật (24/7):{" "}
                    <a href="tel:0337218868" className="hover:underline">
                      033 721 8868
                    </a>
                  </li>
                  <li>
                    Kinh doanh:{" "}
                    <a href="tel:0868179599" className="hover:underline">
                      086 817 9599
                    </a>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
            <p className="text-sm mt-3 text-center">
              Copyright © {new Date().getFullYear()} BKT Company | All Rights
              Reserved
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
