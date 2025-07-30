"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft, Search, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="h-3/4 w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center px-4"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            {/* Mascot và số 404 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex justify-center mb-6"
                >
                  <Image
                    src="/assets/image/bkt_mascot_pose1.webp"
                    alt="BKT Mascot"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
                >
                  404
                </motion.div>
              </div>
            </motion.div>

            {/* Tiêu đề và mô tả */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Oops! Trang không tìm thấy
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Lớp học BKT
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                  <Search className="w-4 h-4 mr-1" />
                  Tìm kiếm
                </Badge>
              </div>
            </motion.div>

            {/* Các nút hành động */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Về trang chủ
                  </Button>
                </Link>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Quay lại
                </Button>
              </div>

              {/* Liên kết hữu ích */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Hoặc bạn có thể thử:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/lop-hoc">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      Lớp học
                    </Button>
                  </Link>
                  <Link href="/doi-ngu-chuyen-gia">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      Đội ngũ chuyên gia
                    </Button>
                  </Link>
                  <Link href="/tai-lieu-tham-khao">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      Tài liệu tham khảo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Thông tin bổ sung */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Nếu bạn nghĩ đây là lỗi, vui lòng{" "}
            <a href="mailto:support@bkt.net.vn" className="text-blue-600 hover:text-blue-800 underline">
              liên hệ với chúng tôi
            </a>
          </p>
        </motion.div> */}
      </motion.div>
    </div>
  );
} 