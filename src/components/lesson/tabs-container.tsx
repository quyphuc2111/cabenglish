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

interface TabsContainerProps {
  sectionContents: SectionContentType[];
  sectionName: string;
  onClose: () => void;
  updateProgressSectionContent: any;
  updateSectionContentLocked: any;
  nextSection?: SectionType; 
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
  nextSection
}: TabsContainerProps) => {
  const router = useRouter();
  const { onOpen, onClose: onCloseModal } = useModal();
  const [lastToastTime, setLastToastTime] = useState<number>(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [lastSCItem, setLastSCItem] = useState<SectionContentType | undefined>();
  const [localUnlockedContents, setLocalUnlockedContents] = useState<Set<number>>(new Set());
  const iframeRef = useRef<HTMLIFrameElement | null>(null); 

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
        if (
          lastSCItem &&
          lastSCItem.sc_id === currentContent.sc_id
        ) {
          // Mở khóa section tiếp theo nếu có
          if (nextSection?.sectionId) {
            await updateSectionLocked({
              sectionId: nextSection.sectionId
            });
          }
        }

        // Nếu còn content tiếp theo trong section hiện tại
        if (nextContent) {
          // Cập nhật state local ngay lập tức để UI responsive
          if (nextContent.isLocked) {
            setLocalUnlockedContents(prev => new Set([...prev, nextContent.sc_id]));
            
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
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  }

  return (
    <Tabs
      value={currentContentIndex.toString()}
      className="w-full h-full flex flex-col"
    >
      <TabsList className="bg-[#f5fcff] w-full flex flex-col md:flex-row h-auto p-0 flex-shrink-0">
        <div className="flex items-center gap-3 h-full bg-[#56B165] rounded-md p-2 md:p-3 w-full md:w-3/12">
          <h5 className="text-base md:text-lg font-medium text-white">
            {sectionName}
          </h5>
        </div>
        <ScrollArea className="w-full md:w-9/12">
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
                              src={content.icon_url || "/assets/image/sc1.png"}
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
              {/* Iframe Container với responsive height */}
              <div className="relative flex-1 min-h-0 bg-gray-50">
                {content.iframe_url.startsWith("http") ? (
                  <div className="w-full h-full min-h-[400px] max-h-[70vh] relative">
                    {iframeLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#56B165]"></div>
                          <p className="text-gray-500 text-sm">Đang tải bài học...</p>
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
                  <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100">
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
              <div className="flex flex-col md:flex-row items-start px-4 md:px-10 py-3 flex-shrink-0 gap-4 bg-white border-t">
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
                  className="flex-shrink-0 self-center md:self-start"
                >
                  <OptimizeImage
                    src="/assets/image/bkt_mascot.webp"
                    width={80}
                    height={120}
                    alt="bkt_mascot"
                    className="flex-shrink-0 w-16 h-24 md:w-20 md:h-28 lg:w-[80px] lg:h-[120px]"
                  />
                </motion.div>
                
                {content.description && (
                  <div className="relative flex-1 min-h-0 min-w-0 order-3 md:order-2">
                    {/* Tam giác bên trái - chỉ hiển thị trên desktop */}
                    <div
                      className="hidden md:block absolute left-[-20px] top-1/2 -translate-y-1/2 w-0 h-0 z-10
                      border-y-[10px] lg:border-y-[14px] border-y-transparent
                      border-r-[15px] lg:border-r-[20px] border-r-[#F5F5F5]"
                    >
                      <div
                        className="absolute right-[-16px] lg:right-[-21px] top-[-10px] lg:top-[-14px]
                        border-y-[10px] lg:border-y-[14px] border-y-transparent 
                        border-r-[15px] lg:border-r-[20px] border-r-[#F5F5F5]
                        -z-10"
                      ></div>
                    </div>
                    <div className="bg-[#F5F5F5] rounded-2xl px-3 md:px-5 py-2 md:py-3 min-h-[100px] max-h-[120px] overflow-y-auto">
                      <div className="h-full overflow-y-auto overflow-x-hidden">
                        <p 
                          className="break-words whitespace-pre-wrap leading-relaxed text-sm md:text-base"
                          style={{ 
                            wordBreak: 'break-all',
                            overflowWrap: 'break-word',
                            hyphens: 'auto'
                          }}
                        >
                          {content.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-2 flex-shrink-0 self-center md:self-start order-2 md:order-3">
                  <Button 
                    onClick={handleFullScreen}
                    size="sm"
                    className="text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 bg-[#56B165] hover:bg-[#4a9957] transition-colors"
                  >
                    🔍 Toàn màn hình
                  </Button>
                  {iframeLoading && (
                    <div className="text-xs text-gray-500 text-center">
                      Đang tải...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        ))}
    </Tabs>
  );
};
