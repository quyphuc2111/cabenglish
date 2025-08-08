import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/useModalStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SectionContentType, SectionType } from "@/types/section";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import OptimizeImage from "@/components/common/optimize-image";
import { useUpdateLessonLocked, useUpdateSectionLockedFromLocked } from "@/hooks/client/useLesson";
import { ArrowLeft, CheckCircle, FullscreenIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNextLessonByLessonId } from "@/actions/nextLessonAction";
import { useLessonData } from "@/hooks/useLessonData";
import { useSession } from "next-auth/react";

// Định nghĩa interface cho H5P global
interface H5PInstance {
  fullScreen?: (element: Element, instance: any) => void;
  exitFullScreen?: () => void;
  instances?: any[];
  isFullscreen?: boolean;
  canHasFullScreen?: boolean;
}

// Mở rộng Window interface để TypeScript biết về H5P
declare global {
  interface Window {
    H5P?: H5PInstance;
  }
}

interface TabsContainerProps {
  sectionContents: SectionContentType[];
  sectionInfo: SectionType;
  onClose: () => void;
  updateProgressSectionContent: any;
  updateSectionContentLocked: any;
  nextSection?: SectionType;
  onShowNextSectionModal?: () => void;
  currentLesson?: {
    lessonId: number;
    classId: number;
    unitId: number;
    lessonOrder: number;
  };
  allSections?: SectionType[];
}

const tabTransitionVariants = {
  hidden: {
    opacity: 0,
    x: 100
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
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
      type: "spring" as const,
      stiffness: 200,
      damping: 20
    }
  }
};

export const TabsContainer = ({
  sectionContents,
  sectionInfo,
  onClose,
  updateProgressSectionContent,
  updateSectionContentLocked,
  nextSection,
  onShowNextSectionModal,
  currentLesson,
  allSections
}: TabsContainerProps) => {
  const router = useRouter();
  const { invalidateLessons } = useLessonData();
  const { onOpen, onClose: onCloseModal } = useModal();
  const { data: session } = useSession();

  const lastToastTimeRef = useRef<number>(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [lastSCItem, setLastSCItem] = useState<
    SectionContentType | undefined
  >();
  const [localUnlockedContents, setLocalUnlockedContents] = useState<
    Set<number>
  >(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);

  const { mutate: updateSectionLocked } = useUpdateSectionLockedFromLocked();
  const { mutate: updateLessonLocked } = useUpdateLessonLocked();

  useEffect(() => {
    const lastItem = sectionContents.reduce(
      (max, item) => (item.order > max.order ? item : max),
      sectionContents[0]
    );

    setLastSCItem(lastItem);
  }, [sectionContents]);

  // Auto unlock first content if section is unlocked
  useEffect(() => {
    console.log("Section unlock check:", {
      sectionIsLocked: sectionInfo.isLocked,
      sectionContentsLength: sectionContents.length,
      sectionContents: sectionContents.map((content) => ({
        sc_id: content.sc_id,
        title: content.title,
        isLocked: content.isLocked,
        order: content.order
      }))
    });

    if (
      !sectionInfo.isLocked &&
      sectionContents.length > 0 &&
      session?.user?.userId
    ) {
      const firstContent = sectionContents.find(
        (content) => content.order === 0
      );
      if (firstContent && firstContent.isLocked) {
        console.log("Auto unlocking first content:", firstContent.sc_id);

        // Update local state immediately for better UX
        setLocalUnlockedContents(
          (prev) => new Set([...prev, firstContent.sc_id])
        );

        // Also call API to unlock on server
        updateSectionContentLocked(
          {
            sectionContentId: firstContent.sc_id
          },
          {
            onSuccess: () => {
              console.log("Successfully unlocked first content on server");
              router.refresh();
            },
            onError: (error: any) => {
              console.error("Failed to unlock first content on server:", error);
              // Revert local state if API call failed
              setLocalUnlockedContents((prev) => {
                const newSet = new Set(prev);
                newSet.delete(firstContent.sc_id);
                return newSet;
              });
            }
          }
        );
      }
    }
  }, [
    sectionInfo.isLocked,
    sectionContents,
    session?.user?.userId,
    updateSectionContentLocked,
    router
  ]);

  // Helper function để check trạng thái locked
  const isContentLocked = (content: SectionContentType) => {
    return content.isLocked && !localUnlockedContents.has(content.sc_id);
  };

  const handleContentClick = (content: SectionContentType, index: number) => {
    if (isContentLocked(content)) {
      const currentTime = performance.now();
      if (currentTime - lastToastTimeRef.current > 3000) {
        toast.warning("Hãy hoàn thành phần học trước", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
        lastToastTimeRef.current = currentTime;
      }
    } else {
      setCurrentContentIndex(index);
    }
  };

  const handleNextContent = async () => {
    const currentContent = sectionContents[currentContentIndex];
    const nextContent = sectionContents[currentContentIndex + 1];

    // Luôn cập nhật progress cho content hiện tại trước
    updateProgressSectionContent(
      {
        sectionContentId: currentContent.sc_id,
        progress: 1
      },
      {
        onSuccess: () => {
          router.refresh();
        }
      }
    );

    // Nếu còn content tiếp theo trong section hiện tại
    if (nextContent) {
      // Cập nhật state local ngay lập tức để UI responsive
      if (nextContent.isLocked) {
        setLocalUnlockedContents(
          (prev) => new Set([...prev, nextContent.sc_id])
        );

        // Mở khóa content tiếp theo
        await updateSectionContentLocked(
          {
            sectionContentId: nextContent.sc_id
          },
          {
            onSuccess: () => {
              router.refresh();
            }
          }
        );

        // Cập nhật progress cho content tiếp theo
        updateProgressSectionContent(
          {
            sectionContentId: nextContent.sc_id,
            progress: 1
          },
          {
            onSuccess: () => {
              router.refresh();
            }
          }
        );
      }
      // Chuyển sang tab tiếp theo
      setCurrentContentIndex(currentContentIndex + 1);
    }

    // Nếu đây là content cuối cùng của section
    if (lastSCItem && lastSCItem.sc_id === currentContent.sc_id) {
      // Mở khóa section tiếp theo nếu có
      if (nextSection?.sectionId) {
        await updateSectionLocked({
          sectionId: nextSection.sectionId
        });
      }

      // Nếu không còn content tiếp theo (đây là content cuối cùng)
      if (!nextContent) {
        // Kiểm tra xem có phải section cuối cùng của lesson không
        const isLastSection = !nextSection;

        if (
          isLastSection &&
          currentLesson &&
          allSections &&
          session?.user?.userId
        ) {
          // Đây là section cuối cùng của lesson, kiểm tra lesson tiếp theo
          try {
            const nextLessonResult = await getNextLessonByLessonId({
              userId: session.user.userId,
              currentLessonId: currentLesson.lessonId
            });

            if (nextLessonResult.isLastLesson) {
              // Đây là lesson cuối cùng trong classroom
              onOpen("nextLesson", {
                isLastLesson: true,
                onConfirm: () => {
                  router.push("/lop-hoc");
                }
              });
            } else if (nextLessonResult.nextLesson) {
              // Có lesson tiếp theo
              onOpen("nextLesson", {
                isLastLesson: false,
                nextLessonId: nextLessonResult.nextLesson.lessonId,
                onConfirm: async () => {
                  console.log(
                    "Chuyển sang lesson tiếp theo:",
                    nextLessonResult.nextLesson
                  );

                  // Invalidate lesson data để refresh dữ liệu
                  if (session?.user?.userId && currentLesson?.classId) {
                    try {
                      await invalidateLessons();
                    } catch (error) {
                      console.error("Lỗi khi invalidate dữ liệu:", error);
                    }
                  }
                  
                  // Cập nhật store với thông tin lesson mới
                  if (typeof window !== "undefined") {
                    const {
                      useSelectLessonStore
                    } = require("@/store/useSelectLesson");
                    const { setSelectedLesson } =
                      useSelectLessonStore.getState();
                    setSelectedLesson(nextLessonResult.nextLesson);
                  }

                 await updateLessonLocked({ lessonId: Number(nextLessonResult.nextLesson!.lessonId) }, {
                  onSuccess: () => {
                    router.push(
                      `/lesson/${nextLessonResult.nextLesson!.lessonId}`
                    );
                  }
                 });
                }
              });
            } else {
              // Fallback về lesson page
              onClose();
            }
          } catch (error) {
            console.error("Error checking next lesson:", error);
            onClose();
          }
        } else {
          // Tự động chuyển sang section tiếp theo nếu có, ngược lại về lesson page
          if (nextSection) {
            // Chuyển trực tiếp sang section tiếp theo sử dụng query parameter
            router.push(`?section=${nextSection.sectionId}`);
          } else {
            onClose();
          }
        }
        return;
      }

      // Nếu là section content cuối cùng của lesson
    }
  };

  const handleFullScreen = () => {
    if (iframeContainerRef.current) {
      try {
        setIsFullscreen(true);

        // Sử dụng API fullscreen tiêu chuẩn của trình duyệt cho container
        if (iframeContainerRef.current.requestFullscreen) {
          iframeContainerRef.current.requestFullscreen();
        } else if (
          (iframeContainerRef.current as any).webkitRequestFullscreen
        ) {
          (iframeContainerRef.current as any).webkitRequestFullscreen(); // Safari
        } else if ((iframeContainerRef.current as any).mozRequestFullScreen) {
          (iframeContainerRef.current as any).mozRequestFullScreen(); // Firefox
        } else if ((iframeContainerRef.current as any).msRequestFullscreen) {
          (iframeContainerRef.current as any).msRequestFullscreen(); // IE11
        } else {
          // Fallback cho iOS và các trình duyệt không hỗ trợ
          const element = iframeContainerRef.current;
          element.style.position = "fixed";
          element.style.top = "0";
          element.style.left = "0";
          element.style.width = "100vw";
          element.style.height = "100vh";
          element.style.zIndex = "9999";
          element.style.backgroundColor = "white";
          document.body.style.overflow = "hidden";
        }
      } catch (error) {
        console.error("Lỗi khi chuyển sang chế độ toàn màn hình:", error);

        // Fallback manual fullscreen
        const element = iframeContainerRef.current;
        element.style.position = "fixed";
        element.style.top = "0";
        element.style.left = "0";
        element.style.width = "100vw";
        element.style.height = "100vh";
        element.style.zIndex = "9999";
        element.style.backgroundColor = "white";
        document.body.style.overflow = "hidden";
        setIsFullscreen(true);
      }
    }
  };

  const handleExitFullScreen = () => {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if ((document as any).webkitFullscreenElement) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozFullScreenElement) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msFullscreenElement) {
        (document as any).msExitFullscreen();
      } else {
        // Manual exit fallback
        if (iframeContainerRef.current) {
          iframeContainerRef.current.style.position = "";
          iframeContainerRef.current.style.top = "";
          iframeContainerRef.current.style.left = "";
          iframeContainerRef.current.style.width = "";
          iframeContainerRef.current.style.height = "";
          iframeContainerRef.current.style.zIndex = "";
          iframeContainerRef.current.style.backgroundColor = "";
          document.body.style.overflow = "";
        }
      }
      setIsFullscreen(false);
    } catch (error) {
      console.error("Lỗi khi thoát chế độ toàn màn hình:", error);
      // Force exit
      if (iframeContainerRef.current) {
        iframeContainerRef.current.style.position = "";
        iframeContainerRef.current.style.top = "";
        iframeContainerRef.current.style.left = "";
        iframeContainerRef.current.style.width = "";
        iframeContainerRef.current.style.height = "";
        iframeContainerRef.current.style.zIndex = "";
        iframeContainerRef.current.style.backgroundColor = "";
        document.body.style.overflow = "";
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFullscreen && isFullscreen) {
        // User exited fullscreen using browser controls
        setIsFullscreen(false);
        if (iframeContainerRef.current) {
          iframeContainerRef.current.style.position = "";
          iframeContainerRef.current.style.top = "";
          iframeContainerRef.current.style.left = "";
          iframeContainerRef.current.style.width = "";
          iframeContainerRef.current.style.height = "";
          iframeContainerRef.current.style.zIndex = "";
          iframeContainerRef.current.style.backgroundColor = "";
          document.body.style.overflow = "";
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, [isFullscreen]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        handleExitFullScreen();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isFullscreen]);

  // Handle viewport height for mobile devices
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  return (
    <Tabs
      value={currentContentIndex.toString()}
      className="w-full h-full flex flex-col"
    >
      <TabsList className="bg-[#f5fcff] w-full flex h-auto p-0 flex-shrink-0 justify-start items-start overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 h-full bg-[#56B165] rounded-md p-1 sm:p-2 min-w-[25%] landscape:min-w-[15%] sm:min-w-0 sm:w-1/4 lg:w-1/5">
          <div className="w-5 h-5 landscape:w-6 landscape:h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
            <OptimizeImage
              src={sectionInfo.iconUrl}
              width={64}
              height={64}
              alt="section_icon"
            />
          </div>
          <h5 className="text-xs landscape:text-sm sm:text-base md:text-lg font-medium text-white truncate">
            {sectionInfo?.sectionName}
          </h5>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-1 landscape:gap-2 sm:gap-2 pb-1 sm:pb-2 mb-1 sm:mb-2 mt-1 sm:mt-2">
            {sectionContents
              .sort((a, b) => a.order - b.order)
              .map((content, index) => (
                <div
                  key={content.sc_id}
                  onClick={() => handleContentClick(content, index)}
                  className="relative flex-shrink-0"
                >
                  <TabsTrigger
                    value={index.toString()}
                    className={cn(
                      "flex gap-1 landscape:gap-2 sm:gap-2 items-center py-1 landscape:py-2 sm:py-2 relative min-w-0",
                      ""
                    )}
                    disabled={isContentLocked(content)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex gap-1 landscape:gap-2 sm:gap-2 items-center min-w-0">
                          <div className="w-5 h-5 landscape:w-7 landscape:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0 relative overflow-hidden rounded">
                            <Image
                              src={content.icon_url || "/assets/image/sc1.png"}
                              alt="content-icon"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                          <p
                            className={cn(
                              "font-medium truncate text-xs landscape:text-sm sm:text-sm line-clamp-1 min-w-0",
                              isContentLocked(content) ? "opacity-50" : ""
                            )}
                          >
                            {content.title}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{content.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {isContentLocked(content) && (
                      <motion.div
                        variants={lockIconVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md"
                      >
                        <Image
                          src="/lock.png"
                          width={20}
                          height={20}
                          alt="lock"
                          className="w-4 h-4 landscape:w-5 landscape:h-5 sm:w-6 sm:h-6"
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

      {/* Control buttons for mobile */}
      <div className="flex justify-between px-2 landscape:px-4 py-1 landscape:py-2 lg:hidden bg-gray-100/50">
        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 landscape:gap-2 bg-gray-200 rounded-md px-2 landscape:px-3 py-1 landscape:py-2 text-gray-700 text-xs landscape:text-sm"
        >
          <ArrowLeft size={14} className="landscape:w-4 landscape:h-4" />
          <span>Quay lại</span>
        </motion.button>

        <motion.button
          onClick={handleNextContent}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 landscape:gap-2 bg-green-500 rounded-md px-2 landscape:px-3 py-1 landscape:py-2 text-white text-xs landscape:text-sm"
        >
          <CheckCircle size={14} className="landscape:w-4 landscape:h-4" />
          <span>Hoàn thành</span>
        </motion.button>
      </div>

      {/* Back button - Desktop only */}
      <div className="hidden lg:block fixed top-4 -left-28 z-50">
        <motion.div
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer"
        >
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
              <ArrowLeft className="w-full h-full text-white" />
            </div>
          </div>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Quay lại
          </div>
        </motion.div>
      </div>

      {/* Complete lesson button - Desktop only */}
      <div className="hidden lg:block fixed top-4 -right-28 z-50">
        <motion.div
          onClick={handleNextContent}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
              <CheckCircle className="w-full h-full text-white" />
            </div>
          </div>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Hoàn thành
          </div>
        </motion.div>
      </div>

      {/* Content tabs */}
      {sectionContents
        .sort((a, b) => a.order - b.order)
        .map((content, index) => (
          <TabsContent
            key={content.sc_id}
            value={index.toString()}
            className="mt-0 flex-1 min-h-0 overflow-hidden"
          >
            <motion.div
              variants={tabTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-md h-full flex flex-col overflow-hidden"
            >
              {/* Iframe Container */}
              <div
                ref={iframeContainerRef}
                className={`relative flex-1 min-h-0 p-1 landscape:p-2 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${
                  isFullscreen ? "fullscreen-container" : ""
                }`}
              >
                {/* Exit Fullscreen Button */}
                {isFullscreen && (
                  <button
                    onClick={handleExitFullScreen}
                    className="absolute top-2 left-2 z-50 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 sm:p-3 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                    style={{
                      position: "fixed",
                      top: "16px",
                      left: "16px",
                      zIndex: 10000
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                {content.iframe_url.startsWith("http") ? (
                  <div className="w-full h-full relative">
                    {iframeLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="flex flex-col items-center gap-1 landscape:gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 landscape:h-6 landscape:w-6 sm:h-8 sm:w-8 border-b-2 border-[#56B165]"></div>
                          <p className="text-gray-500 text-xs landscape:text-sm sm:text-sm">
                            Đang tải bài học...
                          </p>
                        </div>
                      </div>
                    )}
                    <iframe
                      ref={iframeRef}
                      src={content.iframe_url}
                      className={`w-full h-full border-none rounded-t-md ${
                        isFullscreen ? "fullscreen-iframe" : ""
                      }`}
                      title={content.title}
                      allowFullScreen
                      allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
                      onLoad={() => {
                        setIframeLoading(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-2xl landscape:text-3xl sm:text-4xl mb-2 landscape:mb-3 sm:mb-4">
                        ⚠️
                      </div>
                      <p className="text-gray-500 text-xs landscape:text-sm sm:text-lg">
                        Đường dẫn bài học không hợp lệ
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description và controls */}
              <div className="p-1 landscape:p-2 sm:p-4 md:p-6 flex flex-col landscape:flex-row sm:flex-row gap-1 landscape:gap-2 sm:gap-0 landscape:items-center sm:items-center justify-between">
                <div className="text-xs landscape:text-sm sm:text-sm text-gray-500 max-w-lg line-clamp-1 landscape:line-clamp-2 sm:line-clamp-3">
                  {content.description}
                </div>
                <button
                  onClick={
                    isFullscreen ? handleExitFullScreen : handleFullScreen
                  }
                  className="flex items-center justify-center landscape:justify-start sm:justify-start gap-1 landscape:gap-2 sm:gap-3 bg-gray-100 p-1 landscape:p-2 sm:p-2 rounded-md text-xs landscape:text-sm sm:text-sm hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <FullscreenIcon className="w-3 h-3 landscape:w-4 landscape:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span className="hidden landscape:inline xs:inline">
                    {isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                  </span>
                </button>
              </div>
            </motion.div>
          </TabsContent>
        ))}

      {/* Fullscreen Styles */}
      <style jsx>{`
        .fullscreen-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
          background: white !important;
          padding: 0 !important;
        }

        .fullscreen-iframe {
          border-radius: 0 !important;
        }

        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .fullscreen-container {
            height: 100vh !important;
            height: -webkit-fill-available !important;
          }
        }

        /* Android Chrome specific fixes */
        @media screen and (max-width: 768px) {
          .fullscreen-container {
            height: 100vh !important;
            height: calc(var(--vh, 1vh) * 100) !important;
          }
        }

        /* Tablet landscape orientation */
        @media screen and (orientation: landscape) and (max-height: 768px) {
          .fullscreen-container {
            height: 100vh !important;
          }
        }
      `}</style>
    </Tabs>
  );
};
