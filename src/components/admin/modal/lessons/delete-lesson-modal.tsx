"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { useDeleteSection } from "@/hooks/use-sections";
import { showToast } from "@/utils/toast-config";
import { useLessonStore } from "@/store/use-lesson-store";
import { useDeleteLesson } from "@/hooks/use-lessons";

// Thêm các animation variants
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.4
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
};

// Thêm interface cho props
interface DeleteLessonModalProps {
  onConfirm?: () => void;
}

function DeleteLessonModal() {
  const { isOpen, onClose, type, data } = useModal();
  const lessonIdsArray: string[] = React.useMemo(() => {
    const ids = data?.lessonIds;
    if (!ids) return [];
    return Array.isArray(ids) ? ids.map((v: any) => String(v)) : [String(ids)];
  }, [data?.lessonIds]);

  const { mutate: deleteLesson, isPending } = useDeleteLesson();
  const { activeLesson } = useLessonStore();

  const handleConfirm = React.useCallback(() => {
    deleteLesson(
      {
        lessonIds: lessonIdsArray,
        classId: Number(activeLesson.classId),
        unitId: Number(activeLesson.unitId)
      },
      {
        onError: (error) => {
          console.error("Lỗi khi xóa:", error);
          showToast.error(error.message || "Có lỗi xảy ra khi xóa bài học!");
        },
        onSuccess: () => {
          showToast.success("Xóa bài học thành công!");
          if (data?.onSuccess) {
            data.onSuccess();
          }
          onClose();
        }
      }
    );
  }, [data, deleteLesson, onClose, activeLesson.classId, activeLesson.unitId]);


  if (!isOpen || type !== "deleteLesson") return null;
  const selectedCount = data?.lessons?.length ?? (Array.isArray(data?.lessonIds) ? data?.lessonIds.length : data?.lessonIds ? 1 : 0);

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={onClose}>
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogContent className="sm:max-w-3xl !rounded-3xl overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                <motion.div
                  className="flex items-center gap-5 w-full"
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <motion.div
                    className="w-[66px] h-[41px] flex items-center"
                    whileHover={{
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <Image
                      src="/bkt_logo.png"
                      width={171}
                      height={54}
                      alt="color_icon"
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                  <motion.h2
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    SmartKid
                  </motion.h2>
                </motion.div>
              </DialogTitle>
            </DialogHeader>

            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-7 items-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Image
                  src="/modal/alert.png"
                  alt="warning"
                  width={90}
                  height={90}
                />
              </motion.div>
              <div className="text-center space-y-2 flex flex-col justify-center items-center">
                <p className="text-2xl font-medium">
                  {selectedCount === 1
                    ? (
                      <>Bạn có muốn xóa bài học &ldquo;{data?.lessons?.[0]?.lessonName || `ID: ${Array.isArray(data?.lessonIds) ? data.lessonIds[0] : data?.lessonIds}`}&rdquo; không?</>
                    ) : (
                      <>Bạn có muốn xóa {selectedCount} bài học này không?</>
                    )}
                </p>
                <div>
                  <ScrollArea className="w-[500px] ">
                    <div className="flex gap-2 pb-4">
                      {data?.lessons && data.lessons.length > 0 ? (
                        data.lessons.map((lesson: any) => (
                          <p
                            key={lesson.lessonId}
                            className="text-lg text-gray-600 whitespace-nowrap flex-shrink-0"
                          >
                            <span className="font-medium text-blue-600 bg-blue-50 rounded-full px-4 py-1">
                              {lesson.lessonName || `ID: ${lesson.lessonId}`}
                            </span>
                          </p>
                        ))
                      ) : (
                        <p className="text-lg text-gray-500 italic">
                          Không thể hiển thị tên bài học
                        </p>
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
                <div className="flex flex-wrap gap-2"></div>
              </div>
              <div className="flex gap-20">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    className="bg-blue-500 hover:bg-blue-500/80 text-md text-white"
                    size={"lg"}
                    onClick={handleConfirm}
                    disabled={isPending}
                  >
                    {isPending ? "Đang xóa..." : "Đồng ý"}
                  </Button>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    className="bg-red-500 hover:bg-red-500/80 text-md text-white"
                    size="lg"
                    onClick={onClose}
                    disabled={isPending}
                  >
                    Hủy
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-between mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Image
                  src="/modal/coin_bag.png"
                  alt="coin_bag"
                  width={60}
                  height={60}
                />
              </motion.div>

              <motion.div
                animate={{
                  rotate: [0, -10, 10, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Image
                  src="/modal/coin_bag.png"
                  alt="coin_bag"
                  width={60}
                  height={60}
                />
              </motion.div>
            </motion.div>
          </DialogContent>
        </motion.div>
      </Dialog>
    </AnimatePresence>
  );
}

export default DeleteLessonModal;
