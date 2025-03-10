"use client"

import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import {motion, AnimatePresence} from "framer-motion"
import CourseCard from "@/components/course-card/course-card";
import { useModal } from "@/hooks/useModalStore";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserMode, useUserStore } from "@/store/useUserStore";
import { switchModeAction } from "@/actions/lockedAction";
// import { updateUserInfo } from "@/actions/userAction";

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
  
  const TEACHING_MODE_DATA = {
      defaultMode: {
        title: "Chế độ mặc định",
        courseData: [
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
        ]
       
      },
      freeMode: {
        title: "Chế độ tự do", 
        courseData: [
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
        ]
      }
    };
  
  interface ModeHeaderProps {
    icon: string;
    title: string;
  }
  
  const ModeHeader = ({ icon, title }: ModeHeaderProps) => (
    <motion.div 
      variants={itemVariants}
      className="flex items-center gap-2 border-b-4 max-w-[250px] pb-2 mb-5 border-[#736E6E]"
    >
      <motion.div variants={iconVariants}>
        <Image src={icon} alt={title} width={50} height={40} />
      </motion.div>
      <h2 className="text-xl">{title}</h2>
    </motion.div>
  );
  
  const CourseList = ({ courses }: { courses: any[] }) => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 gap-5"
    >
      {courses.map((courseItem, index) => (
        <Fragment key={index}>
          <motion.div variants={itemVariants}>
            <CourseCard disabled {...courseItem} />
          </motion.div>
        </Fragment>
      ))}
    </motion.div>
  );
  

interface TeachingModeClientProps {
  initialMode: 'defaultMode' | 'freeMode';
  userId: string;
  userInfo: {
    mode: string;
    email: string;
    language: string;
    theme: string;
  }
  updateUserInfo: (userInfo: {
    mode: string;
  }) => Promise<void>;
  switchMode: (mode: string) => Promise<void>;
}

function TeachingModeClient({ initialMode, userId, userInfo, updateUserInfo, switchMode }: TeachingModeClientProps) {
    const [modeActive, setModeActive] = useState<'defaultMode' | 'freeMode'>();

  
    const {onOpen} = useModal();
    const { updateUser } = useUserStore();
    const currentTeachingMode =  useUserMode();


    useEffect(() => {
      setModeActive(currentTeachingMode as 'defaultMode' | 'freeMode');
  }, []);
    
    const handleConfirmModeChange = async (newMode: 'defaultMode' | 'freeMode') => {
      try {
        // const result = await switchModeAction({
        //   userId: userId,
        //   mode: newMode === "defaultMode" ? "default" : "free"
        // });
        const result = await updateUserInfo({
          // userId: userId,
          mode: newMode === "defaultMode" ? "default" : "free",
          // email: userInfo.email,
          // language: userInfo.language,
          // theme: userInfo.theme
        });

        const switchModeResponse = await switchMode({
          mode: newMode === "defaultMode" ? "default" : "free"
        });
        
        

        if (result.success && switchModeResponse.success) {
          setModeActive(newMode);
          updateUser({
            mode: newMode
          });

          toast.success(`Đã chuyển sang ${newMode === 'defaultMode' ? 'Chế độ mặc định' : 'Chế độ tự do'}!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        } else {
          toast.error(result.error || "Có lỗi xảy ra khi chuyển chế độ");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi chuyển chế độ");
      }
    };

    const renderModeSection = (mode: 'defaultMode' | 'freeMode') => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white px-10 py-6 border-4 rounded-3xl cursor-pointer transition-all duration-300 ${
          modeActive === mode 
            ? "border-[#4079CE]" 
            : "border-gray-200 opacity-50 hover:opacity-100"
        }`}
        onClick={() => {
          if(modeActive === mode) {
            toast.info("Chế độ hiện tại đã được chọn!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            });
          } else {
            onOpen("changeTeachingModeModal", {
              onConfirm: () => handleConfirmModeChange(mode),
              mode: mode 
            });
          }
        }}
      >
         <ModeHeader 
          icon={mode === "defaultMode" ? "/bkt_logo.png" : "/modal/freemode.png"} 
          title={TEACHING_MODE_DATA[mode].title}
        />
        <CourseList courses={TEACHING_MODE_DATA[mode].courseData} />
      </motion.div>
    );
    
 return (
    <ContentLayout title="TeachingMode">
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-3"
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          transition: { duration: 1, repeat: Infinity }
        }}
      >
        <Image src="/book.gif" alt="book" width={40} height={40} />
      </motion.div>
      <p className="text-xl">Chế độ giảng dạy</p>
    </motion.div>
    <AnimatePresence>
      <motion.div 
        className="flex flex-col gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderModeSection("defaultMode")}
        {renderModeSection("freeMode")}
      </motion.div>
    </AnimatePresence>
  </ContentLayout>
 )
    
}

export default TeachingModeClient; 