"use client";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import LessonItem from "@/components/lesson/lesson-item";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ClassRoomBackground from "@/components/background/backgroundClass";
import SectionItem from "@/components/section/section-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { useModal } from "@/hooks/useModalStore";
import { motion } from "framer-motion";

// Tạo interface cho dữ liệu
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

function LessonPage() {
  const [selectedSection, setSelectedSection] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const section = params.get('section');
      
      // Nếu có section param, kiểm tra xem section đó có bị khóa không
      if (section) {
        const sectionId = Number(section);
        const sectionData = mockLessonData.sections.find(s => s.section_id === sectionId);
        
        // Nếu section bị khóa, hiển thị thông báo và chuyển hướng về trang chính
        if (sectionData?.is_locked) {
          toast.error("Bạn cần hoàn thành các phần học trước!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
          
          // Xóa param section khỏi URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('section');
          window.history.pushState({}, '', newUrl);
          
          return null;
        }
        return sectionId;
      }
      return null;
    }
    return null;
  });

  const handleSectionClick = (sectionId: number) => {
    const section = mockLessonData.sections.find(s => s.section_id === sectionId);
    
    if (section?.is_locked) {
      toast.error("Bạn cần hoàn thành các phần học trước!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    setSelectedSection(sectionId);
    // Cập nhật URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('section', sectionId.toString());
    window.history.pushState({}, '', newUrl);
  };

  const handleCloseSection = () => {
    setSelectedSection(null);
    // Xóa param khỏi URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('section');
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="bg-[url('/assets/bg_classroom.png')] w-screen h-screen bg-no-repeat bg-cover bg-left relative">
      <div
        className={`bg-[#F1B9D7] w-full md:w-4/5 lg:w-3/5 ${
          selectedSection ? "h-full" : "h-3/4 py-4 md:py-8"
        } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl`}
      >
        {selectedSection ? (
          <></>
        ) : (
          <p className="text-2xl font-bold mb-3 px-4">
            {mockLessonData.lesson_name}
          </p>
        )}

        <div
          className={`flex  relative overflow-hidden ${
            selectedSection ? "h-full" : "h-5/6"
          }`}
        >
          {/* Danh sách sections */}
          <div
            className={`w-full transition-all duration-500 ${
              selectedSection
                ? "translate-x-[-100%] opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <ScrollArea className="w-full px-4 h-[calc(100vh-200px)]">
              <div className="flex flex-col gap-5">
                {mockLessonData.sections.map((section) => (
                  <div
                    key={section.section_id}
                    onClick={() =>
                     
                      handleSectionClick(section.section_id)
                    }
                    className={`bg-white p-4 rounded-md flex items-center justify-between cursor-pointer ${
                      section.is_locked ? "opacity-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-4 w-1/3">
                      <Image
                        src={section.icon_url}
                        width={40}
                        height={40}
                        alt="section-icon"
                        className="object-contain w-8 h-8 md:w-[60px] md:h-[60px]"
                      />
                      <p className="text-base md:text-xl font-semibold truncate">
                        {section.section_name}
                      </p>
                    </div>

                    <div className="w-1/3 flex justify-center">
                      {section.is_locked && (
                        <div className="w-8 h-8 relative">
                          <Image
                            src="/lock.png"
                            layout="fill"
                            objectFit="cover"
                            priority
                            alt="lock"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-5 w-1/3 justify-end">
                      <p className="text-xl font-semibold">
                        {section.estimate_time} minutes
                      </p>
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <p className="text-xl font-semibold">
                        {section.progress}%
                      </p>
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
            {selectedSection && (
              <TabsContainer
                section={
                  mockLessonData.sections.find(
                    (s) => s.section_id === selectedSection
                  )!
                }
                onClose={handleCloseSection}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TabsContainer = ({
  section,
  onClose
}: {
  section: Section;
  onClose: () => void;
}) => {
  // Thêm state để theo dõi thời gian thông báo cuối cùng
  const [lastToastTime, setLastToastTime] = useState<number>(0);
  
  const handleContentClick = (content: SectionContent) => {
    if (content.is_locked) {
      const currentTime = Date.now();
      // Chỉ hiển thị thông báo nếu đã qua 3 giây kể từ thông báo trước
      if (currentTime - lastToastTime > 3000) {
        toast.warning("Hãy hoàn thành phần học trước", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        setLastToastTime(currentTime);
      }
    }
  };

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  const { onOpen, onClose: onCloseModal } = useModal();

  const handleNextContent = () => {
    onOpen("completeLesson", {
      onConfirm: () => {
        // Tìm content tiếp theo
        const nextContent = section.section_contents[currentContentIndex + 1];
        if (nextContent) {
          // Mở khóa content tiếp theo
          nextContent.is_locked = false;
          setCurrentContentIndex(currentContentIndex + 1);
        }
        onCloseModal(); // Đóng modal
      }
    });
  };

  const handleConfirmComplete = () => {
    // Tìm content tiếp theo chưa bị khóa
    const nextContent = section.section_contents[currentContentIndex + 1];
    if (nextContent) {
      // Mở khóa content tiếp theo
      nextContent.is_locked = false;
      setCurrentContentIndex(currentContentIndex + 1);
    }
    setShowCompleteModal(false);
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

  const [iframeLoading, setIframeLoading] = useState(true);

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
    <Tabs defaultValue="0" className="w-full">
      <TabsList className="bg-[#f5fcff] w-full flex flex-col md:flex-row gap-3 md:gap-5 h-auto p-2">
        <div className="flex items-center gap-3 bg-[#56B165] rounded-3xl p-2 md:p-3 w-full md:w-2/12">
          <button
            onClick={onClose}
            className="p-1 md:p-2 rounded-full hover:bg-white/20"
          >
            <Image src="/backic.png" width={30} height={30} alt="back" className="w-6 h-6 md:w-10 md:h-10" />
          </button>
          <h5 className="text-base md:text-lg font-medium text-white">
            {section.section_name}
          </h5>
        </div>
        <div className="w-full md:w-10/12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {section.section_contents.map((content, index) => (
            <div 
              key={content.sc_id}
              onClick={() => handleContentClick(content)}
              className="relative"
            >
              <TabsTrigger
                value={index.toString()}
                className="flex gap-2 items-center py-2 relative w-full"
                disabled={content.is_locked}
              >
                <Image
                  src={content.icon_url}
                  alt="content-icon"
                  width={40}
                  height={40}
                />
                <p className={`font-medium truncate ${content.is_locked ? 'opacity-50' : ''}`}>
                  {content.title}
                </p>
                
                {content.is_locked && (
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
      </TabsList>
      <div className="flex justify-end ">
              <button
                onClick={handleNextContent}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Tiếp theo
              </button>
            </div>

      {section.section_contents.map((content, index) => (
        <TabsContent
          key={content.sc_id}
          value={index.toString()}
          // className="mt-4"
        >
          <motion.div
            variants={tabTransitionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white  rounded-md"
          >
            <div className="relative">
              {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56B165]"></div>
                </div>
              )}
              <iframe
                src={content.iframe_url}
                className="w-full h-[300px] md:h-[400px]"
                title={content.title}
                onLoad={() => setIframeLoading(false)}
              />
            </div>
            <div className="flex items-center px-10 pt-2">
              <Image src="/assets/image/soc.png" width={160} height={160} alt="soc" />
              {content.description && (
                <div className="bg-[#F5F5F5] rounded-2xl px-5 py-3">
                  <p>{content.description}</p>
                </div>
              )}
            </div>
            
           
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default LessonPage;
