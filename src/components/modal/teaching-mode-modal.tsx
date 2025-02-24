"use client";

import React, { FC, Fragment, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import CourseCard from "../course-card/course-card";

type TeachingModeType = "default" | "freemode";

const MODAL_CONTENT = {
  title: "Chọn chế độ giảng dạy",
  defaultMode: {
    title: "Chế độ mặc định",
    description: [
      "Giáo viên cần hoàn thành bài giảng hiện tại trước khi chuyển sang bài giảng mới.",
      "Phù hợp cho những lớp học tuân theo một lộ trình học tập cố định, đảm bảo học sinh nắm vững kiến thức trước khi học nội dung mới."
    ]
  },
  freeMode: {
    title: "Chế độ tự do", 
    description: [
      "Giáo viên có thể chọn dạy bất kỳ bài giảng nào mà không bị ràng buộc theo thứ tự.",
      "Phù hợp khi giáo viên muốn linh hoạt điều chỉnh bài giảng dựa trên trình độ, nhu cầu hoặc sở thích của học sinh."
    ]
  },
  hint: "* Hãy chọn một chế độ giảng dạy"
};

const courseData = [
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: 'started'
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: 'started'
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: 'started'
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: 'started'
  }
];

const ModeDescription = ({ items, className }: { items: string[], className?: string }) => (
  <ul className={`list-disc pl-4 ${className}`}>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

const ModeHeader = ({ icon, title }: { icon: string; title: string }) => (
  <div className="flex items-center gap-2 border-b-2 max-w-[250px] pb-2 mb-5">
    <Image src={icon} alt={title} width={40} height={40} />
    <h2 className="text-xl">{title}</h2>
  </div>
);

const ActionButtons = ({ onBack }: { onBack: () => void }) => (
  <div className="flex gap-4">
    <Button onClick={onBack} className="bg-blue-500 hover:bg-blue-500/80 font-medium text-md">
      Quay lại
    </Button>
    <Button className="bg-[#3EC474] hover:bg-[#3EC474]/80 font-medium text-md">
      Lưu
    </Button>
  </div>
);

const ModeOption = ({ 
  mode, 
  icon, 
  title, 
  borderColor, 
  hoverColor, 
  onClick 
}: {
  mode: TeachingModeType;
  icon: string;
  title: string;
  borderColor: string;
  hoverColor: string;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, x: mode === "default" ? -50 : 50 }}
    animate={{ opacity: 1, x: 0 }}
    className={`w-1/3 flex items-center justify-center  gap-5 rounded-lg border-4 ${borderColor} ${hoverColor} transition-all duration-200 cursor-pointer`}
    onClick={onClick}
  >
    <Image src={icon} alt={title} width={mode === "default" ? 75 : 40} height={mode === "default" ? 47 : 40} />
    <p className="text-lg font-medium">{title}</p>
  </motion.div>
);

function TeachingModeModal() {
  const { isOpen, onClose, type } = useModal();
  const [mode, setMode] = useState<TeachingModeType | null>(null);

  const isModalOpen = isOpen && type === "teachingMode";

  const renderModeContent = () => {
    if (mode === "default") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="px-5 py-4 border-4 border-[#4079CE]">
            <ModeHeader icon="/bkt_logo.png" title={MODAL_CONTENT.defaultMode.title} />
            <div className="grid grid-cols-4 gap-5">
              {courseData.map((courseItem, index) => (
                <Fragment key={index}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <CourseCard {...courseItem} />
                  </motion.div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <ModeDescription items={MODAL_CONTENT.defaultMode.description} className="w-2/3 text-[#736E6E]" />
            <ActionButtons onBack={() => setMode(null)} />
          </div>
        </motion.div>
      );
    }

    if (mode === "freemode") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="px-5 py-4 border-4 border-[#4079CE]">
            <ModeHeader icon="/modal/freemode.png" title={MODAL_CONTENT.freeMode.title} />
            <div className="grid grid-cols-4 gap-5">
              {courseData.map((courseItem, index) => (
                <Fragment key={index}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <CourseCard {...courseItem} />
                  </motion.div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <ModeDescription items={MODAL_CONTENT.freeMode.description}  className="w-2/3 text-[#736E6E]"/>
            <ActionButtons onBack={() => setMode(null)} />
          </div>
        </motion.div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#736E6E]"
        >
          {MODAL_CONTENT.hint}
        </motion.span>

        <div className="flex gap-20 justify-center w-3/5 mt-3">
          <ModeOption 
            mode="default"
            icon="/modal/bkt_logo.png"
            title="Mặc định"
            borderColor="border-[#1E67D4]"
            hoverColor="hover:bg-blue-50"
            onClick={() => setMode("default")}
          />
          <ModeOption 
            mode="freemode"
            icon="/modal/freemode.png"
            title="Tự do"
            borderColor="border-[#E25762]"
            hoverColor="hover:bg-red-50"
            onClick={() => setMode("freemode")}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#E8E6E6] px-11 py-5 w-full rounded-lg space-y-2 mt-7"
        >
          <div className="flex gap-1 items-start">
            <div className="w-20">
              <div className="w-[60px] h-[40px] flex-shrink-0">
                <Image src="/modal/bkt_logo.png" alt="bkt-logo" width={60} height={40} className="object-contain" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">{MODAL_CONTENT.defaultMode.title}</p>
              <ModeDescription items={MODAL_CONTENT.defaultMode.description} />
            </div>
          </div>

          <div className="flex gap-1 items-start">
            <div className="w-20">
              <div className="w-[50px] h-[50px] flex-shrink-0">
                <Image src="/modal/freemode.png" alt="freemode" width={50} height={50} className="object-contain" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">{MODAL_CONTENT.freeMode.title}</p>
              <ModeDescription items={MODAL_CONTENT.freeMode.description} />
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogTitle />
      <DialogContent className="sm:max-w-7xl !rounded-3x px-20 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <Image src="/modal/settings_icon.png" alt="settings-icon" width={50} height={50} />
          <h2 className="font-bold text-2xl">{MODAL_CONTENT.title}</h2>
        </motion.div>

        {renderModeContent()}
      </DialogContent>
    </Dialog>
  );
}

export default TeachingModeModal;
