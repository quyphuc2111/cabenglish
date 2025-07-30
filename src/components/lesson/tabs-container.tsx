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
import { useUpdateSectionLockedFromLocked } from "@/hooks/client/useLesson";
import { Button } from "../ui/button";
import { FullscreenIcon } from "lucide-react";

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
  sectionName: string;
  onClose: () => void;
  updateProgressSectionContent: any;
  updateSectionContentLocked: any;
  nextSection?: SectionType;
  onShowNextSectionModal?: () => void;
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

export const TabsContainer = ({
  sectionContents,
  sectionName,
  onClose,
  updateProgressSectionContent,
  updateSectionContentLocked,
  nextSection,
  onShowNextSectionModal
}: TabsContainerProps) => {
  const router = useRouter();
  const { onOpen, onClose: onCloseModal } = useModal();

  // Sử dụng useRef thay vì Date.now() để tránh hydration mismatch
  const lastToastTimeRef = useRef<number>(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [lastSCItem, setLastSCItem] = useState<
    SectionContentType | undefined
  >();
  const [localUnlockedContents, setLocalUnlockedContents] = useState<
    Set<number>
  >(new Set());
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeSize, setIframeSize] = useState({
    width: 0,
    height: 0,
    containerWidth: 0,
    containerHeight: 0,
    viewportWidth: 0,
    viewportHeight: 0
  });
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);

  const { mutate: updateSectionLocked } = useUpdateSectionLockedFromLocked();

  useEffect(() => {
    const lastItem = sectionContents.reduce(
      (max, item) => (item.order > max.order ? item : max),
      sectionContents[0]
    );

    setLastSCItem(lastItem);
  }, [sectionContents]);

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

  const handleNextContent = () => {
    onOpen("completeLesson", {
      onConfirm: async () => {
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
            // Navigate về lesson page và hiển thị modal
            onClose();
            if (onShowNextSectionModal) {
              onShowNextSectionModal();
            }
            return;
          }
        }

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

        onCloseModal();
      }
    });
  };

  const handleFullScreen = () => {
    if (iframeRef.current) {
      try {
        // Phương pháp 1: Thêm tham số để hiển thị nút fullscreen của H5P
        const currentSrc = iframeRef.current.src;

        // Phương pháp 2: Giả lập click vào nút fullscreen của H5P
        // Cố gắng tìm và click vào nút fullscreen
        try {
          const fullscreenButton =
            iframeRef.current.contentDocument?.querySelector(
              ".h5p-fullscreen, .h5p-enable-fullscreen"
            );
          if (fullscreenButton) {
            (fullscreenButton as HTMLElement).click();
            return;
          }
        } catch (e) {
          // Bỏ qua lỗi khi truy cập cross-origin iframe
          console.log("Không thể truy cập nút fullscreen trong iframe", e);
        }

        // Phương pháp 3: Sử dụng API fullscreen tiêu chuẩn của trình duyệt
        if (iframeRef.current.requestFullscreen) {
          iframeRef.current.requestFullscreen();
        } else if ((iframeRef.current as any).webkitRequestFullscreen) {
          (iframeRef.current as any).webkitRequestFullscreen(); // Safari
        } else if ((iframeRef.current as any).msRequestFullscreen) {
          (iframeRef.current as any).msRequestFullscreen(); // IE11
        }
      } catch (error) {
        console.error("Lỗi khi chuyển sang chế độ toàn màn hình:", error);

        // Fallback cuối cùng: Thử mở tab mới với nội dung iframe
        try {
          const iframeSrc = iframeRef.current.src;
          if (iframeSrc) {
            window.open(iframeSrc, "_blank");
          }
        } catch (e) {
          console.error("Không thể mở tab mới:", e);
        }
      }
    }
  };

  const updateIframeSize = () => {
    if (iframeRef.current) {
      const { offsetWidth, offsetHeight, clientWidth, clientHeight } =
        iframeRef.current;
      let containerWidth = 0;
      let containerHeight = 0;

      if (iframeContainerRef.current) {
        containerWidth = iframeContainerRef.current.offsetWidth;
        containerHeight = iframeContainerRef.current.offsetHeight;
      }

      setIframeSize({
        width: offsetWidth || clientWidth,
        height: offsetHeight || clientHeight,
        containerWidth,
        containerHeight,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      });
    }
  };

  // Theo dõi kích thước iframe khi nó được tải hoặc khi content thay đổi
  useEffect(() => {
    updateIframeSize();
    const observer = new ResizeObserver(updateIframeSize);

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    window.addEventListener("resize", updateIframeSize);

    return () => {
      if (iframeRef.current) {
        observer.unobserve(iframeRef.current);
      }
      window.removeEventListener("resize", updateIframeSize);
    };
  }, [currentContentIndex, iframeLoading]);

  return (
    <>
      
      <Tabs
        value={currentContentIndex.toString()}
        className="w-full h-full flex flex-col"
      >
        <TabsList className="bg-[#f5fcff] w-full flex h-auto p-0 flex-shrink-0 justify-start items-start">
          <div className="flex items-center gap-3 h-full bg-[#56B165] rounded-md p-2 w-1/3">
            <h5 className="text-base md:text-lg font-medium text-white">
              {sectionName}
            </h5>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2 mb-2 mt-2">
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
                      className="flex gap-2 items-center py-2 relative w-[200px]"
                      disabled={isContentLocked(content)}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex gap-2 items-center">
                            <div className="w-10 h-10 flex-shrink-0 relative overflow-hidden rounded">
                              <Image
                                src={
                                  content.icon_url || "/assets/image/sc1.png"
                                }
                                alt="content-icon"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                            <p
                              className={`font-medium truncate ${
                                isContentLocked(content) ? "opacity-50" : ""
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

                      {isContentLocked(content) && (
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

        {/* Back button */}
        <div className="absolute top-5 -left-28">
          <motion.div
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative group cursor-pointer"
          >
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12">
                <svg
                  className="w-full h-full text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Quay lại
            </div>
          </motion.div>
        </div>

        {/* Complete lesson button */}
        <div className="absolute top-5 -right-28">
          <motion.div
            onClick={handleNextContent}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative group cursor-pointer"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12">
                <svg
                  className="w-full h-full text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Hoàn thành bài học
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
                {/* Iframe Container với thiết kế chuẩn */}
                <div
                  ref={iframeContainerRef}
                  className="relative flex-1 min-h-0 p-4 md:p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
                >
                  {content.iframe_url.startsWith("http") ? (
                    <div className="w-full h-full  relative">
                      {iframeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#56B165]"></div>
                            <p className="text-gray-500 text-sm">
                              Đang tải bài học...
                            </p>
                          </div>
                        </div>
                      )}
                      <iframe
                        ref={iframeRef}
                        src={content.iframe_url}
                        className="w-full h-full border-none rounded-t-md"
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
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-gray-500 text-lg">
                          Đường dẫn bài học không hợp lệ
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description và controls */}
                <div className="p-4 md:p-6 flex align-center justify-between">
                  <div className="text-sm text-gray-500 max-w-lg line-clamp-3">
                    {content.description}
                  </div>
                  <div onClick={handleFullScreen} className="flex items-center gap-3 bg-gray-100 p-2 rounded-md">
                    <FullscreenIcon className="w-6 h-6" />
                    Toàn màn hình
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
      </Tabs>
    </>
  );
};
