"use client";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import LessonItem from "@/components/lesson/lesson-item";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ClassRoomBackground from "@/components/background/backgroundClass";
import SectionItem from "@/components/section/section-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
import { useModal } from "@/hooks/useModalStore";
import { motion } from "framer-motion";
import { SectionContentType, SectionType } from "@/types/section";
import { cn, formatProgress } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import OptimizeImage from "@/components/common/optimize-image";

interface SectionContent {
  sc_id: number;
  order: number;
  icon_url: string;
  iframe_url: string;
  description: string;
  title: string;
  is_locked: boolean;
}

interface Section {
  section_id: number;
  section_name: string;
  estimate_time: number;
  icon_url: string;
  section_contents: SectionContent[];
  progress: number;
  is_locked: boolean;
}

interface LessonData {
  lesson_id: number;
  lesson_name: string;
  imageurl: string;
  numliked: number;
  order: number;
  sections: Section[];
}

const mockLessonData: LessonData = {
  lesson_id: 1,
  lesson_name: "Unit 1: Từ vựng cơ bản",
  imageurl: "/lessons/unit1.png",
  numliked: 245,
  order: 1,
  sections: [
    {
      section_id: 1,
      section_name: "Intro",
      estimate_time: 10,
      icon_url: "/assets/gif/section1.gif",
      section_contents: [
        {
          sc_id: 1,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url:
            "https://h5p.org/sites/default/files/h5p/content/621/phet.html",
          description:
            " Cùng Pea học Tiếng Anh qua bài giảng thú vị sau đây nhé. Nếu chưa hiểu bài, em có thể xem lại để hiểu rõ hơn nội dung bài học.",
          title: "Title1123",
          is_locked: false
        },
        {
          sc_id: 2,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url:
            "https://h5p.org/sites/default/files/h5p/content/621/phet.html",
          description:
            " Cùng Pea học Tiếng Anh qua bài giảng thú vị sau đây nhé. Nếu chưa hiểu bài, em có thể xem lại để hiểu rõ hơn nội dung bài học.",
          title: "Title321",
          is_locked: true
        },
        {
          sc_id: 3,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description:
            " Cùng Pea học Tiếng Anh qua bài giảng thú vị sau đây nhé. Nếu chưa hiểu bài, em có thể xem lại để hiểu rõ hơn nội dung bài học.",
          title: "Title",
          is_locked: true
        },
        {
          sc_id: 4,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: true
        },
        {
          sc_id: 5,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: true
        },
        {
          sc_id: 6,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: true
        }
      ],
      progress: 50,
      is_locked: false
    },
    {
      section_id: 2,
      section_name: "Presentation",
      estimate_time: 0,
      icon_url: "/assets/gif/section2.gif",
      section_contents: [
        {
          sc_id: 7,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 8,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        }
      ],
      progress: 80,
      is_locked: true
    },
    {
      section_id: 3,
      section_name: "Practice",
      estimate_time: 0,
      icon_url: "/assets/gif/section3.gif",
      section_contents: [
        {
          sc_id: 9,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 10,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        }
      ],
      progress: 80,
      is_locked: true
    },
    {
      section_id: 4,
      section_name: "Production",
      estimate_time: 0,
      icon_url: "/assets/gif/section4.gif",
      section_contents: [
        {
          sc_id: 11,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 12,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        }
      ],
      progress: 80,
      is_locked: true
    },
    {
      section_id: 5,
      section_name: "Wrap up",
      estimate_time: 0,
      icon_url: "/assets/gif/section5.gif",
      section_contents: [
        {
          sc_id: 13,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 14,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 15,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 16,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 17,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 18,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 19,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 20,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 21,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 22,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 23,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 24,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        }
      ],
      progress: 80,
      is_locked: true
    },
    {
      section_id: 6,
      section_name: "Wrap up",
      estimate_time: 0,
      icon_url: "/assets/gif/section5.gif",
      section_contents: [
        {
          sc_id: 13,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 14,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 15,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 16,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 17,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 18,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 19,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 20,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 21,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 22,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 23,
          order: 1,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        },
        {
          sc_id: 24,
          order: 2,
          icon_url: "/assets/image/sc1.png",
          iframe_url: "",
          description: "",
          title: "Title",
          is_locked: false
        }
      ],
      progress: 80,
      is_locked: true
    }
  ]
};

function LessonClient({
  sectionData,
  sectionContentData,
  updateLockedSectionContentAction,
  updateProgressSectionContentAction
}: {
  sectionData: SectionType[];
  sectionContentData: SectionContentType[];
}) {
  const searchParams = useSearchParams();
  const [selectedSection, setSelectedSection] = useState<number | null>(() => {
    const sectionParam = searchParams.get("section");

    if (sectionParam) {
      const sectionId = Number(sectionParam);
      const selectedSection = sectionData.find(
        (s) => s.sectionId === sectionId
      );

      if (selectedSection?.isLocked) {
        toast.error("Bạn cần hoàn thành các phần học trước!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
        return null;
      }
      return sectionId;
    }
    return null;
  });

  const router = useRouter();

  const handleSectionClick = (sectionId: number) => {
    const section = sectionData.find((s) => s.sectionId === sectionId);

    if (section?.isLocked) {
      toast.error("Bạn cần hoàn thành các phần học trước!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true
      });
      return;
    }

    setSelectedSection(sectionId);
    router.push(`?section=${sectionId}`);
  };

  const handleCloseSection = (sectionId: number) => {
    setSelectedSection(null);
    router.push(`/lesson/${sectionId}`);
  };

  return (
    <div className="bg-[url('/assets/bg_classroom.webp')] w-screen h-screen bg-no-repeat bg-cover bg-left relative overflow-hidden ">
      <div className="absolute top-1/2 right-10">
        <div className="relative">
          <motion.div
            animate={{
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <OptimizeImage
              src="/assets/image/bkt_mascot_pose1.webp"
              width={110}
              height={160}
              alt="bkt_mascot"
              className="flex-shrink-0"
              priority
            />
          </motion.div>

          <motion.div
            className="absolute top-1 -left-5"
            animate={{
              y: [-15, 0, -15],
              x: [0, 5, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
          >
            <OptimizeImage
              src="/assets/image/bkt_mascot_pose1_ball.webp"
              width={40}
              height={40}
              alt="bkt_mascot_pose1_ball"
              className="flex-shrink-0"
            />
          </motion.div>

          <motion.div
            className="absolute top-5 -right-5"
            animate={{
              y: [0, -20, 0],
              x: [0, -10, 0],
              rotate: [0, -360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
          >
            <OptimizeImage
              src="/assets/image/bkt_mascot_pose1_bear.webp"
              width={34}
              height={34}
              alt="bkt_mascot_pose1_bear"
              className="flex-shrink-0"
            />
          </motion.div>
        </div>
      </div>

      <div
        className={`bg-[#F1B9D7] w-full md:w-4/5 lg:w-3/5 ${
          selectedSection ? "h-full" : "h-3/4 py-4 md:py-8"
        } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl max-h-[600px] 3xl:max-h-[730px]`}
      >
        <div
          className={`flex relative ${selectedSection ? "h-full" : "h-5/6"}`}
        >
          {/* className="absolute -top-9 -left-20" */}
          <div className="absolute -top-9 -left-20">
            {!selectedSection && (
              <div onClick={() => router.back()}>
                <Image
                  src="/assets/image/lesson/previos_lesson.png"
                  width={80}
                  height={80}
                  alt="back"
                  className="w-6 h-6 md:w-14 md:h-14"
                />
              </div>
            )}
          </div>
          <div
            className={`w-full transition-all duration-500 ${
              selectedSection
                ? "translate-x-[-100%] opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <ScrollArea className="w-full px-4 h-full">
              <div className="flex flex-col gap-5">
                {[...sectionData]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((section) => (
                    <div
                      key={section.sectionId}
                      onClick={() => handleSectionClick(section.sectionId)}
                      className={`bg-white p-4 flex items-center justify-between cursor-pointer ${
                        section.isLocked ? "opacity-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 md:gap-4 w-1/3">
                        <Image
                          src={"/assets/gif/section1.gif"}
                          width={40}
                          height={40}
                          alt="section-icon"
                          className="object-contain w-8 h-8 md:w-[60px] md:h-[60px]"
                        />
                        <p className="text-base md:text-xl font-semibold truncate">
                          {section.sectionName}
                        </p>
                      </div>

                      <div className="w-1/3 flex justify-center">
                        {section.isLocked && (
                          <div className="w-8 h-8 relative">
                            <Image
                              src="/lock.png"
                              fill
                              objectFit="cover"
                              priority
                              alt="lock"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-5 w-1/3 justify-end ">
                        <div className="flex items-center gap-4 w-2/3 justify-end">
                          <p className="text-xl font-semibold w-1/2">
                            {section.estimateTime}
                          </p>
                          <div className="flex items-center gap-2 w-1/2 justify-between">
                            {" "}
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            <p
                              className={cn(
                                "text-xl font-semibold",
                                section.progress > 0
                                  ? "text-[#56B165]"
                                  : "text-[#E07E86]"
                              )}
                            >
                              {formatProgress(section.progress)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>

          {/* Section contents */}
          <div
            className={`absolute top-0 right-0 w-full h-full transition-all duration-500 ${
              selectedSection
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            {selectedSection && sectionContentData && (
              <TabsContainer
                sectionContents={sectionContentData}
                sectionName={
                  sectionData.find((s) => s.sectionId === selectedSection)
                    ?.sectionName || ""
                }
                onClose={() => handleCloseSection(selectedSection)}
                updateLockedSectionContentAction={
                  updateLockedSectionContentAction
                }
                updateProgressSectionContentAction={
                  updateProgressSectionContentAction
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TabsContainer = ({
  sectionContents,
  sectionName,
  onClose,
  updateLockedSectionContentAction,
  updateProgressSectionContentAction
}: {
  sectionContents: SectionContentType[];
  sectionName: string;
  onClose: () => void;
}) => {
  const [lastToastTime, setLastToastTime] = useState<number>(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);

  const router = useRouter();

  const handleContentClick = (content: SectionContentType, index: number) => {
    if (content.isLocked) {
      const currentTime = Date.now();
      if (currentTime - lastToastTime > 3000) {
        toast.warning("Hãy hoàn thành phần học trước", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
        setLastToastTime(currentTime);
      }
    } else {
      setCurrentContentIndex(index);
    }
  };

  const { onOpen, onClose: onCloseModal } = useModal();

  const handleNextContent = () => {
    onOpen("completeLesson", {
      onConfirm: async () => {
        const nextContent = sectionContents[currentContentIndex + 1];
        if (nextContent) {
          if (nextContent.isLocked) {
            const updateLockedSectionContent =
              await updateLockedSectionContentAction({
                sectionContentId: nextContent.sc_id,
                isLocked: false
              });
            const updateProgressSectionContent =
              await updateProgressSectionContentAction({
                sectionContentId: nextContent.sc_id,
                progress: 1
              });

            console.log(
              updateLockedSectionContent,
              updateProgressSectionContent
            );
            // console.log(updateLockedSectionContent, updateProgressSectionContent);

            if (
              updateLockedSectionContent.success &&
              updateProgressSectionContent.success
            ) {
              router.refresh();
            }
          }
          setCurrentContentIndex(currentContentIndex + 1);
        }
        onCloseModal();
      }
    });
  };

  const tabTransitionVariants = {
    hidden: {
      opacity: 0,
      x: 100
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      x: -100
    }
  };

  const lockIconVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <Tabs
      value={currentContentIndex.toString()}
      className="w-full h-full flex flex-col"
    >
      <TabsList className="bg-[#f5fcff] w-full flex flex-col md:flex-row gap-3 md:gap-5 h-auto p-0 flex-shrink-0">
        <div className="flex items-center gap-3 h-full bg-[#56B165] rounded-md p-2 md:p-3 w-full md:w-2/12">
          <h5 className="text-base md:text-lg font-medium text-white">
            {sectionName}
          </h5>
        </div>
        <ScrollArea className="w-full md:w-10/12">
          <div className="flex gap-2 pb-2 mb-2">
            {sectionContents.map((content, index) => (
              <div
                key={content.sc_id}
                onClick={() => handleContentClick(content, index)}
                className="relative flex-shrink-0"
              >
                <TabsTrigger
                  value={index.toString()}
                  className="flex gap-2 items-center py-2 relative w-[150px]"
                  disabled={content.isLocked}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex gap-2 items-center">
                        <Image
                          src={content.iconUrl || "/assets/image/sc1.png"}
                          alt="content-icon"
                          width={40}
                          height={40}
                        />
                        <p
                          className={`font-medium truncate ${
                            content.isLocked ? "opacity-50" : ""
                          }`}
                        >
                          {content.title}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{content.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {content.isLocked && (
                    <motion.div
                      variants={lockIconVariants}
                      initial="initial"
                      animate="animate"
                      className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md"
                    >
                      <Image
                        src="/lock.png"
                        width={24}
                        height={24}
                        alt="lock"
                      />
                    </motion.div>
                  )}
                </TabsTrigger>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </TabsList>

      <div className="absolute top-0 -left-20">
        <div onClick={onClose}>
          <Image
            src="/assets/image/lesson/previos_lesson.png"
            width={80}
            height={80}
            alt="back"
            className="w-6 h-6 md:w-14 md:h-14"
          />
        </div>
      </div>

      {/* Next button */}
      <div className="absolute top-0 -right-20">
        <div onClick={handleNextContent}>
          <Image
            src="/assets/image/lesson/next_lesson.png"
            width={80}
            height={80}
            alt="next"
            className="w-6 h-6 md:w-14 md:h-14"
          />
        </div>
      </div>

      {/* Content tabs */}
      {sectionContents.map((content, index) => (
        <TabsContent
          key={content.sc_id}
          value={index.toString()}
          className="mt-0 flex-1 min-h-0"
        >
          <motion.div
            variants={tabTransitionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-md h-full flex flex-col"
          >
            <div className="relative flex-shrink-0">
              {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56B165]"></div>
                </div>
              )}
              {content.iframe_url.startsWith("http") ? (
                <iframe
                  src={
                    content.iframe_url.startsWith("http")
                      ? content.iframe_url
                      : ""
                  }
                  className="w-full h-[350px] 3xl:h-[450px]"
                  title={content.title}
                  onLoad={() => setIframeLoading(false)}
                  onError={() => {
                    setIframeLoading(false);
                    toast.error("Không thể tải nội dung bài học", {
                      position: "top-right",
                      autoClose: 3000
                    });
                  }}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-[350px] 3xl:h-[450px] flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Không có nội dung bài học</p>
                </div>
              )}
            </div>
            <div className="flex items-center px-10 py-2 flex-1 min-h-0 gap-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -10, 0]
                }}
                whileTap={{
                  scale: 0.9,
                  rotate: [-5, 5, 0]
                }}
                transition={{
                  duration: 2,
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  rotate: {
                    duration: 0.5,
                    ease: "easeInOut"
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <OptimizeImage
                  src="/assets/image/bkt_mascot.webp"
                  width={110}
                  height={160}
                  alt="bkt_mascot"
                  className="flex-shrink-0"
                />
              </motion.div>
              {content.description && (
                <div className="relative flex-1 h-3/4 ml-4">
                  {/* Tam giác bên trái */}
                  <div
                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-0 h-0 z-10
                    border-y-[14px] border-y-transparent
                    border-r-[20px] border-r-[#F5F5F5]"
                  >
                    <div
                      className="absolute right-[-21px] top-[-14px]
                      border-y-[14px] border-y-transparent 
                      border-r-[20px] border-r-[#F5F5F5]
                      -z-10"
                    ></div>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-2xl px-5 py-3 h-full overflow-y-auto">
                    <p>{content.description}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default LessonClient;
