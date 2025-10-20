import React from "react";
import about_book from "@/assets/about_book.png";
import Image from "next/image";
import { motion } from "framer-motion";

function MissionSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-20">
      <motion.div
        className="container flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-4xl font-semibold mb-16 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Sứ mệnh của BKT SmartKids
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-12">
          <motion.div
            className="relative"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ rotate: -5 }}
              animate={{ rotate: 5 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <Image
                src={about_book}
                width={315}
                height={365}
                alt="About book"
                className="-mb-16 drop-shadow-2xl"
                priority
              />
            </motion.div>
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-600 p-10 rounded-xl z-10 relative"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white font-semibold text-xl leading-relaxed">
                Với các tính năng tương tác của phần mềm linh hoạt, áp dụng cho
                tất cả các lứa tuổi, nâng cao hứng thú, động lực của người dùng
                thông qua các công cụ đa chức năng và các chủ đề phong phú, đơn
                giản hóa thao tác sử dụng.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-white p-5 2xl:p-10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            variants={itemVariants}
          >
            <motion.h2
              className="text-2xl font-semibold text-green-600 mb-8"
              variants={itemVariants}
            >
              Tại BKT SmartKids, chúng tôi tin rằng:
            </motion.h2>
            <div className="flex flex-col gap-6 text-justify">
              {[
                "Với các tính năng tương tác của phần mềm linh hoạt, dễ dàng thao tác và sử dụng cho tất cả các lứa tuổi. Nâng cao hứng thú, động lực của người dùng thông qua nhiều Bài học thú vị và thiết thực, được chia làm các chủ đề cụ thể, xây dựng qua nhiều hình thức học tập khác nhau.",
                "Người dùng sẽ cảm thấy dễ dàng, tự tin hơn khi sử dụng phần mềm: Thiết kế gần gũi với nhận thức của người dùng, tiếp cận nhanh với mọi tính năng của phần mềm.",
                "Thay vì loay hoay cho việc nghiên cứu, tìm kiếm tài liệu học tập – giảng dạy. Phần mềm là lựa chọn tuyệt vời giúp bạn tiết kiệm rất nhiều thời gian, sử dụng triệt để các tính năng của phần mềm."
              ].map((text, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgb(243 244 246)",
                    transition: { duration: 0.2 }
                  }}
                  className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <p className="text-gray-700 leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default MissionSection;
