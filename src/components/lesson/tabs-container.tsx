import { useEffect, useState } from "react";
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
import { useUpdateSectionLocked } from "@/hooks/client/useLesson";

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
  const [lastSCItem, setLastSCItem] = useState()

  const {mutate: updateSectionLocked } = useUpdateSectionLocked()

  useEffect(() => {
    const lastItem = sectionContents.reduce((max, item) => 
      item.order > max.order ? item : max
    , sectionContents[0]);
    
    setLastSCItem(lastItem);
  }, [sectionContents]);

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

  const handleNextContent = () => {
    onOpen("completeLesson", {
      onConfirm: async () => {
        const nextContent = sectionContents[currentContentIndex + 1];
        
        if (lastSCItem && lastSCItem.sc_id === sectionContents[currentContentIndex].sc_id) {
          await updateSectionLocked({
            sectionId: nextSection?.sectionId
          });
        }

        if (nextContent) {
          if (nextContent.isLocked) {
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
          setCurrentContentIndex(currentContentIndex + 1);
        }
        onCloseModal();
      }
    });
  };

  console.log("lastSCItem", lastSCItem)

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
      {sectionContents
        .sort((a, b) => a.order - b.order)
        .map((content, index) => (
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
                {/* {iframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56B165]"></div>
                  </div>
                )} */}
                {content.iframe_url.startsWith("http") ? (
                  <iframe
                    src={
                      content.iframe_url.startsWith("http")
                        ? content.iframe_url
                        : null
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
                    <p className="text-gray-500">
                      Đường dẫn bài học không hợp lệ
                    </p>
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
