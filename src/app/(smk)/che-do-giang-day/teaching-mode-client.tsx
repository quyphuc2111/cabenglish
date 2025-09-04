// @ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/course-card/course-card";
import { useModal } from "@/hooks/useModalStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetAllSectionContent } from "@/actions/progressAction";
import { useUserInfo, useInvalidateUserInfo } from "@/hooks/useUserInfo";
import { useBroadcastSync } from "@/hooks/useBroadcastSync";
import { useTranslation } from "@/hooks/useTranslation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const iconVariants = {
  hidden: {
    scale: 0,
    rotate: -180
  },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};



interface ModeHeaderProps {
  icon: string;
  title: string;
  isActive?: boolean;
}

const ModeHeader = ({ icon, title, isActive = false }: ModeHeaderProps) => (
  <motion.div
    variants={itemVariants}
    className={`flex items-center gap-2 sm:gap-3 border-b-4 max-w-full sm:max-w-[250px] md:max-w-[300px] pb-2 mb-3 sm:mb-5 transition-colors duration-300 ${
      isActive ? "border-[#4079CE]" : "border-[#736E6E]"
    }`}
  >
    <motion.div variants={iconVariants}>
      <Image
        src={icon}
        alt={title}
        width={40}
        height={32}
        className="sm:w-[50px] sm:h-[40px] w-[40px] h-[32px]"
      />
    </motion.div>
    <h2
      className={`text-lg sm:text-xl md:text-2xl font-semibold transition-colors duration-300 ${
        isActive ? "text-[#4079CE]" : "text-gray-700"
      }`}
    >
      {title}
    </h2>
  </motion.div>
);

const CourseList = ({
  courses,
  isActive = false
}: {
  courses: any[];
  isActive?: boolean;
}) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
  >
    {courses.map((courseItem, index) => (
      <Fragment key={index}>
        <motion.div
          variants={itemVariants}
          className={`transition-all duration-300 ${
            isActive ? "opacity-100" : "opacity-70"
          }`}
        >
          <CourseCard disabled {...courseItem} />
        </motion.div>
      </Fragment>
    ))}
  </motion.div>
);

interface TeachingModeClientProps {
  userId: string;
  updateUserInfo: (userInfo: { mode: string }) => Promise<any>;
  switchMode: (mode: string) => Promise<any>;
}

function TeachingModeClient({
  userId,
  updateUserInfo,
  switchMode
}: TeachingModeClientProps) {
  const { data: userInfo, isLoading, error } = useUserInfo(userId);
  const invalidateUserInfo = useInvalidateUserInfo();
  const { broadcastUpdate } = useBroadcastSync();
  const { onOpen, onClose } = useModal();
  const { t } = useTranslation("", "common");

  const TEACHING_MODE_DATA = {
  defaultMode: {
    title: t("defaultMode"),
    courseData: [
      {
        courseTitle: "Unit 1: Hello",
        courseImage: "/modal/unit1_hello.png",
        courseWeek: "Tuần học 1",
        courseCategory: "3 - 4 tuổi",
        courseName: "Bảng chữ cái tiếng anh",
        courseProgress: 100,
        courseLike: 668,
        courseStatus: "started"
      },
      {
        courseTitle: "Unit 2: Shapes",
        courseImage: "/modal/unit2_shapes.png",
        courseWeek: "Tuần học 2",
        courseCategory: "3 - 4 tuổi",
        courseName: "Giới thiệu thông tin về bản thân",
        courseProgress: 100,
        courseLike: 568,
        courseStatus: "not_started"
      },
      {
        courseTitle: "Unit 3: Numbers",
        courseImage: "/modal/unit3_numbers.png",
        courseWeek: "Tuần học 3",
        courseCategory: "3 - 4 tuổi",
        courseName: "Khám phá màu sắc",
        courseProgress: 100,
        courseLike: 86,
        courseStatus: "not_started"
      },
      {
        courseTitle: "Unit 4: Nature",
        courseImage: "/modal/unit4_nature.png",
        courseWeek: "Tuần học 1",
        courseCategory: "3 - 4 tuổi",
        courseName: "Bảng chữ cái tiếng anh",
        courseProgress: 100,
        courseLike: 668,
        courseStatus: "not_started"
      }
    ]
  },
  freeMode: {
    title: t("freeMode"),
    courseData: [
      {
        courseTitle: "Unit 1: Hello",
        courseImage: "/modal/unit1_hello.png",
        courseWeek: "Tuần học 1",
        courseCategory: "3 - 4 tuổi",
        courseName: "Bảng chữ cái tiếng anh",
        courseProgress: 100,
        courseLike: 668,
        courseStatus: "started"
      },
      {
        courseTitle: "Unit 2: Shapes",
        courseImage: "/modal/unit2_shapes.png",
        courseWeek: "Tuần học 2",
        courseCategory: "3 - 4 tuổi",
        courseName: "Giới thiệu thông tin về bản thân",
        courseProgress: 100,
        courseLike: 568,
        courseStatus: "started"
      },
      {
        courseTitle: "Unit 3: Numbers",
        courseImage: "/modal/unit3_numbers.png",
        courseWeek: "Tuần học 3",
        courseCategory: "3 - 4 tuổi",
        courseName: "Khám phá màu sắc",
        courseProgress: 100,
        courseLike: 86,
        courseStatus: "started"
      },
      {
        courseTitle: "Unit 4: Nature",
        courseImage: "/modal/unit4_nature.png",
        courseWeek: "Tuần học 1",
        courseCategory: "3 - 4 tuổi",
        courseName: "Bảng chữ cái tiếng anh",
        courseProgress: 100,
        courseLike: 668,
        courseStatus: "started"
      }
    ]
  }
};

  const modeActive = userInfo?.mode === "default" ? "defaultMode" : "freeMode";

  useEffect(() => {
    if (error) {
      console.error("Error fetching user mode:", error);
      toast.error("Có lỗi xảy ra khi lấy thông tin chế độ");
    }
  }, [error]);

  const handleConfirmModeChange = async (
    newMode: "defaultMode" | "freeMode"
  ) => {
    try {
      const result = await updateUserInfo({
        mode: newMode === "defaultMode" ? "default" : "free"
      });

      const switchModeResponse = await switchMode({
        mode: newMode === "defaultMode" ? "default" : "free"
      });

      const resetAllSectionContentResponse = await resetAllSectionContent({
        userId: userId
      });

      if (
        result.success &&
        switchModeResponse.success &&
        resetAllSectionContentResponse.success
      ) {
        invalidateUserInfo(userId);
        // broadcastUpdate để các tab khác biết đã cập nhật
        broadcastUpdate(userId);

        toast.success(
          `Đã chuyển sang ${
            newMode === "defaultMode" ? "Chế độ mặc định" : "Chế độ tự do"
          }!`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          }
        );

        onClose();
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi chuyển chế độ");
        throw new Error(result.error || "Có lỗi xảy ra khi chuyển chế độ");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chuyển chế độ");
      throw error;
    }
  };

  const renderModeSection = (mode: "defaultMode" | "freeMode") => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 border-4 rounded-2xl sm:rounded-3xl cursor-pointer transition-all duration-300 ${
        modeActive === mode
          ? "border-[#4079CE] shadow-lg shadow-blue-200/50 bg-gradient-to-br from-blue-50/30 to-white scale-[1.01] sm:scale-[1.02]"
          : "border-gray-200 opacity-60 hover:opacity-90 hover:border-gray-300 hover:shadow-md"
      }`}
      whileHover={modeActive !== mode ? { scale: 1.005 } : {}}
      onClick={() => {
        if (modeActive === mode) {
          toast.info("Chế độ hiện tại đã được chọn!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
        } else {
          onOpen("changeTeachingModeModal", {
            onConfirm: () => handleConfirmModeChange(mode),
            mode: mode
          });
        }
      }}
    >
      {/* Badge cho chế độ được chọn */}
      {modeActive === mode && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-[#4079CE] text-white rounded-full p-1.5 sm:p-2 shadow-lg z-10"
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}

      {/* Overlay cho chế độ không được chọn */}
      {modeActive !== mode && (
        <div className="absolute inset-0 bg-gray-100/20 rounded-3xl pointer-events-none" />
      )}

      <ModeHeader
        icon={mode === "defaultMode" ? "/bkt_logo.png" : "/modal/freemode.png"}
        title={TEACHING_MODE_DATA[mode].title}
        isActive={modeActive === mode}
      />
      <CourseList
        courses={TEACHING_MODE_DATA[mode].courseData}
        isActive={modeActive === mode}
      />
    </motion.div>
  );

  if (isLoading) {
    return (
      <ContentLayout title="TeachingMode">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 sm:w-40 h-5 sm:h-6 bg-gray-200 rounded animate-pulse"></div>
        </motion.div>
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 mr-1 sm:mr-2">
          <div className="bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 border-4 border-gray-200 rounded-2xl sm:rounded-3xl animate-pulse">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
              <div className="w-10 h-8 sm:w-12 sm:h-10 bg-gray-200 rounded"></div>
              <div className="w-24 sm:w-32 h-5 sm:h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 h-40 sm:h-48 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 border-4 border-gray-200 rounded-2xl sm:rounded-3xl animate-pulse">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
              <div className="w-10 h-8 sm:w-12 sm:h-10 bg-gray-200 rounded"></div>
              <div className="w-24 sm:w-32 h-5 sm:h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 h-40 sm:h-48 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="TeachingMode">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            transition: { duration: 1, repeat: Infinity }
          }}
        >
          <Image
            src="/book.gif"
            alt="book"
            width={32}
            height={32}
            className="sm:w-[40px] sm:h-[40px] w-[32px] h-[32px]"
          />
        </motion.div>
        <p className="text-xl sm:text-2xl md:text-3xl">{t("teachingMode")}</p>
      </motion.div>
      <AnimatePresence>
        <motion.div
          className="flex flex-col gap-3 sm:gap-4 md:gap-5 mr-1 sm:mr-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {renderModeSection("defaultMode")}
          {renderModeSection("freeMode")}
        </motion.div>
      </AnimatePresence>
    </ContentLayout>
  );
}

export default TeachingModeClient;
