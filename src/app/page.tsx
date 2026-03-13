"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter()
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  }

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-[#DB6060] to-[#753333]"
      >
        <div className="container mx-auto h-[87px] flex items-center justify-between px-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <Image
              src="/home/logo.png"
              width={57}
              height={57}
              alt="CAB English Logo"
              className="rounded-full"
            />
            <span className="text-[32px] font-semibold bg-clip-text text-transparent bg-[url('/home/cab-icon.png')] bg-cover">
              CAB English
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              onClick={() => router.push('/chon-lop-hoc')} 
              className="bg-white text-[#D12828] hover:bg-gray-100 rounded-[20px] px-8 h-[49px] text-[22px] font-medium"
            >
              Vào học
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main>
        {/* Hero Section - CAB English Introduction */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="container mx-auto py-16 px-8"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <motion.div 
              variants={slideInLeft}
              className="lg:w-1/3"
            >
              <Image
                src="/home/intro-image.png"
                width={612}
                height={344}
                alt="CAB English"
                className="rounded-[28px] shadow-[10px_9px_4px_0px_rgba(0,0,0,0.25)]"
              />
            </motion.div>
            <motion.div 
              variants={slideInRight}
              className="lg:w-2/3"
            >
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/home/cab-icon.png"
                  width={57}
                  height={57}
                  alt="CAB Icon"
                  className="rounded-full"
                />
                <h2 className="text-[28px] font-semibold text-black">CAB English</h2>
              </div>
              <p className="text-[28px] leading-[1.57] text-black text-justify">
                Là nền tảng học tiếng Anh trực tuyến giúp học sinh phát triển toàn diện các kỹ năng nghe, nói, đọc, viết thông qua hệ thống bài học và bài luyện phong phú, sinh động. Với giao diện thân thiện, lộ trình học rõ ràng theo từng cấp độ, website không chỉ hỗ trợ củng cố kiến thức ngôn ngữ mà còn tạo hứng thú học tập, tăng khả năng giao tiếp và bồi dưỡng tư duy ngôn ngữ cho học sinh.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Message Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="w-full py-16 relative overflow-hidden"
        >
          {/* Background layer với overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/home/hero-bg.png')" }}
          >
            {/* Overlay xám mờ chỉ cho background */}
            <div className="absolute inset-0 bg-gray-300/80"></div>
          </div>
          
          {/* Content layer - không bị ảnh hưởng bởi overlay */}
          <div className="container mx-auto px-8 relative z-10">
            <motion.h2 
              variants={fadeInUp}
              className="text-[32px] font-semibold text-[#FC0000] text-center mb-8"
            >
              Thông điệp của chúng tôi
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-[28px] leading-[1.57] text-black text-justify max-w-[1650px] mx-auto"
            >
              Xuất phát từ mong muốn mang đến một chương trình học tiếng Anh chất lượng cho mọi học sinh tiểu học Việt Nam, bất kể điều kiện kinh tế, chúng tôi đã xây dựng website học tiếng Anh trực tuyến, với hy vọng trở thành hành trang giúp các em phát triển kỹ năng ngôn ngữ, tự tin giao tiếp và mạnh dạn vươn ra thế giới.
            </motion.p>
          </div>
        </motion.section>

        {/* Vision & Mission Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="container mx-auto py-16 px-8"
        >
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3 space-y-12">
              {/* Tầm nhìn */}
              <motion.div 
                variants={fadeInUp}
                className="flex gap-8"
              >
                <div className="flex-shrink-0">
                  <h3 className="text-[55px] font-medium leading-[0.8] bg-gradient-to-b from-[#FC0000] to-[#960000] bg-clip-text text-transparent">
                    Tầm<br/>Nhìn
                  </h3>
                </div>
                <p className="text-[28px] leading-[1.57] text-black text-justify">
                  &ldquo;Đến năm 2028, chúng tôi hướng tới trở thành website học tiếng Anh cho học sinh tiểu học lớn nhất Đông Nam Á, dẫn đầu về số lượng học sinh sử dụng. Bằng việc ứng dụng công nghệ tiên tiến một cách thông minh và thực tế, chúng tôi mang đến giải pháp học tập chuẩn mực với chi phí tối ưu nhất, giúp mọi học sinh đều có cơ hội tiếp cận tiếng Anh chất lượng và phát triển năng lực giao tiếp toàn diện.&rdquo;
                </p>
              </motion.div>
              
              {/* Sứ mệnh */}
              <motion.div 
                variants={fadeInUp}
                className="flex gap-8"
              >
                <div className="flex-shrink-0">
                  <h3 className="text-[55px] font-medium leading-[0.8] bg-gradient-to-b from-[#FC0000] to-[#960000] bg-clip-text text-transparent">
                    Sứ<br/>Mệnh
                  </h3>
                </div>
                <p className="text-[28px] leading-[1.57] text-black text-justify">
                  Chúng tôi tin rằng công nghệ có thể xóa nhòa khoảng cách về điều kiện học tập, mang đến cho mọi học sinh tiểu học cơ hội tiếp cận tiếng Anh chất lượng cao. Thông qua website học tiếng Anh trực tuyến hiện đại, chúng tôi cung cấp cho các em hệ thống bài học và bài luyện chuẩn quốc tế, được thiết kế bởi đội ngũ chuyên gia giàu kinh nghiệm, giúp phát triển tư duy ngôn ngữ, nâng cao khả năng giao tiếp và nuôi dưỡng niềm yêu thích tiếng Anh.
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              variants={slideInRight}
              className="lg:w-1/3 flex justify-center"
            >
              <Image
                src="/home/vision-image.png"
                width={475}
                height={845}
                alt="Vision"
                className="rounded-[30px] shadow-[7px_4px_4px_0px_rgba(0,0,0,0.25)]"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Registration Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="w-full  relative overflow-hidden"
        >
          {/* Background layer với overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/home/hero-bg.png')" }}
          >
            {/* Overlay xám mờ chỉ cho background */}
            <div className="absolute inset-0 bg-gray-400/80"></div>
          </div>
          
          {/* Content layer - không bị ảnh hưởng bởi overlay */}
          <div className="px-8 relative z-10">
              {/* Left - Image */}
              <motion.div 
                variants={slideInLeft}
                className="absolute -bottom-10 left-0 "
              >
                <Image
                  src="/home/register-image.png"
                  width={298}
                  height={298}
                  alt="Register"
                  className="rounded-lg"
                />
              </motion.div>
            <div className="container mx-auto py-16 flex flex-col lg:flex-row gap-12 items-center justify-end">
            
              
              {/* Center - Mascot */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col items-center"
              >
                <Image
                  src="/home/register-mascot.png"
                  width={190}
                  height={190}
                  alt="Mascot"
                />
              </motion.div>
              
              {/* Right - Form */}
              <motion.div 
                variants={slideInRight}
                className="flex flex-col gap-4 w-full max-w-[715px]"
              >
                <h2 className="text-[55px] font-medium leading-[0.8] bg-gradient-to-b from-[#FC0000] to-[#960000] bg-clip-text text-transparent text-center mb-4">
                  Đăng ký tham gia học
                </h2>
                
                <div className="relative">
                  <Input 
                    placeholder="Nhập tên tài khoản" 
                    className="h-[70px] rounded-[50px] bg-white text-[28px] text-[#665E5E] pl-6 pr-14"
                  />
                  <Image
                    src="/home/user-icon.png"
                    width={30}
                    height={30}
                    alt="User"
                    className="absolute right-6 top-1/2 -translate-y-1/2"
                  />
                </div>
                
                <Input 
                  type="password"
                  placeholder="Nhập mật khẩu" 
                  className="h-[70px] rounded-[50px] bg-white text-[28px] text-[#665E5E] pl-6"
                />
                
                <Input 
                  type="password"
                  placeholder="Nhập lại mật khẩu" 
                  className="h-[70px] rounded-[50px] bg-white text-[28px] text-[#665E5E] pl-6"
                />
                
                <Button 
                  className="h-[70px] rounded-[50px] bg-gradient-to-r from-[#AE5C5C] to-[#960000] text-white text-[28px] font-bold mx-auto px-12"
                >
                  Đăng kí ngay
                </Button>
              </motion.div>
            </div>
          </div>
          {/* End Content layer */}
        </motion.section>

        {/* Investors Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="container mx-auto py-16 px-8"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-[55px] font-medium leading-[0.8] bg-gradient-to-b from-[#FC0000] to-[#960000] bg-clip-text text-transparent text-center mb-12"
          >
            Nhà đầu tư
          </motion.h2>
          
          <div className="relative flex overflow-hidden">
            <div className="flex gap-20 animate-marquee hover:[animation-play-state:paused]" style={{ animationDuration: "15s" }}>
              <div className="flex gap-20 items-center flex-shrink-0">
                <Image src="/home/investor-1.png" width={158} height={158} alt="Investor 1" className="rounded-lg" />
                <Image src="/home/investor-2.png" width={158} height={158} alt="Investor 2" className="rounded-lg" />
                <Image src="/home/investor-3.png" width={83} height={83} alt="Investor 3" className="rounded-lg" />
                <Image src="/home/investor-4.png" width={158} height={158} alt="Investor 4" className="rounded-lg" />
                <Image src="/home/investor-5.png" width={83} height={83} alt="Investor 5" className="rounded-lg" />
                <Image src="/home/investor-6.png" width={83} height={83} alt="Investor 6" className="rounded-lg" />
              </div>
              <div className="flex gap-20 items-center flex-shrink-0">
                <Image src="/home/investor-1.png" width={158} height={158} alt="Investor 1" className="rounded-lg" />
                <Image src="/home/investor-2.png" width={158} height={158} alt="Investor 2" className="rounded-lg" />
                <Image src="/home/investor-3.png" width={83} height={83} alt="Investor 3" className="rounded-lg" />
                <Image src="/home/investor-4.png" width={158} height={158} alt="Investor 4" className="rounded-lg" />
                <Image src="/home/investor-5.png" width={83} height={83} alt="Investor 5" className="rounded-lg" />
                <Image src="/home/investor-6.png" width={83} height={83} alt="Investor 6" className="rounded-lg" />
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="w-full bg-[#2B5A8E] py-16"
      >
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: Logo - 3 cols */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-[#353535] to-[#9B9B9B] rounded-[50px] p-6 flex items-center gap-4">
                <Image
                  src="/home/logo.png"
                  width={57}
                  height={57}
                  alt="CAB English Logo"
                  className="rounded-full"
                />
                <span className="text-[32px] font-semibold text-white">CAB English</span>
              </div>
            </div>

            {/* Column 2: Company Details - 4 cols */}
            <div className="lg:col-span-4">
              <div className="bg-[#353535] rounded-[50px] p-6 h-full">
                <p className="text-[20px] font-semibold text-white leading-[1.4]">
                  Công ty cổ phần giáo dục CAB English<br/>
                  MST: 9999999688 do Sở KH và ĐT TP.Hà Nội cấp ngày 2/11/2025<br/>
                  Đại diện: Ông Cao Xuân Anh
                </p>
              </div>
            </div>

            {/* Column 3: Addresses - 5 cols */}
            <div className="lg:col-span-5">
              <div className="bg-[#353535] rounded-[50px] p-6 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">📍</span>
                  </div>
                  <p className="text-[18px] font-semibold text-white leading-[1.3]">
                    Hà Nội
                  </p>
                </div>
                <div className="flex items-start gap-3 mb-3 ml-8">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-[10px]">📍</span>
                  </div>
                  <p className="text-[16px] font-semibold text-white leading-[1.3]">
                    Tầng 6, Toà nhà Báo Sinh Viên - Hoa Học Trò, Yên Hoà, Cầu Giấy, Hà Nội
                  </p>
                </div>
                <div className="flex items-start gap-3 ml-8">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-[10px]">📍</span>
                  </div>
                  <p className="text-[16px] font-semibold text-white leading-[1.3]">
                    Tầng 8, Toà nhà Comatce Tower, Yên Hoà, Cầu Giấy, Hà Nội
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Column 1: Links - 3 cols */}
            <div className="lg:col-span-3">
              <div className="bg-[#353535] rounded-[50px] p-6 h-full">
                <ul className="text-[18px] font-semibold text-white leading-[1.8] space-y-1">
                  <li className="font-bold mb-2">Về CAB English</li>
                  <li className="cursor-pointer hover:text-gray-300">Giới thiệu chung</li>
                  <li className="cursor-pointer hover:text-gray-300">Khoá học trên CAB English</li>
                  <li className="cursor-pointer hover:text-gray-300">Cẩm nang</li>
                  <li className="cursor-pointer hover:text-gray-300">Tin tức</li>
                </ul>
              </div>
            </div>

            {/* Column 2: Hotline - 4 cols */}
            <div className="lg:col-span-4">
              <div className="bg-[#353535] rounded-[50px] p-6 h-full">
                <h3 className="text-[20px] font-bold text-white mb-4">Hotline</h3>
                <p className="text-[32px] font-bold text-[#FFD700] mb-3">093.120.8686</p>
                <p className="text-[16px] font-semibold text-white">Kênh truyền thống</p>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="w-10 h-10 bg-[#4267B2] rounded-full flex items-center justify-center hover:opacity-80">
                    <span className="text-white text-xl">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#FF0000] rounded-full flex items-center justify-center hover:opacity-80">
                    <span className="text-white text-xl">▶</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#0084FF] rounded-full flex items-center justify-center hover:opacity-80">
                    <span className="text-white text-xl">Z</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 3: Copyright & Links - 5 cols */}
            <div className="lg:col-span-5">
              <div className="bg-[#353535] rounded-[50px] p-6 h-full flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/home/verified-badge.png"
                    width={80}
                    height={80}
                    alt="Verified"
                    className="rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="text-[14px] font-bold text-white uppercase">Đã thông báo</p>
                    <p className="text-[12px] text-white">Bộ Công Thương</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[16px] font-semibold text-white">
                    Copyright © 2025 CAB Corporation | All Rights Reserved
                  </p>
                  <div className="flex flex-wrap gap-4 text-[14px] text-white">
                    <a href="#" className="hover:text-gray-300">• Hình thức thanh toán</a>
                    <a href="#" className="hover:text-gray-300">• Chính sách đổi trả</a>
                    <a href="#" className="hover:text-gray-300">• Chính sách bảo mật</a>
                    <a href="#" className="hover:text-gray-300">• Điều khoản sử dụng</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
