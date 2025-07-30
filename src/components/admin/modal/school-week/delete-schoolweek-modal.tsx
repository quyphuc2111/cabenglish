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

import { useDeleteSchoolWeek } from "@/hooks/use-schoolweek";
import { showToast } from "@/utils/toast-config";

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
      ease: "easeOut"
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
interface DeleteSchoolWeekModalProps {
  onConfirm?: () => void;
}

function DeleteSchoolWeekModal() {
  const { isOpen, onClose, type, data } = useModal();

  const { mutate: deleteSchoolWeek, isPending } = useDeleteSchoolWeek();

  const handleConfirm = React.useCallback(async () => {
    if (!data?.schoolWeekIds?.length) return;

    try {
      // Tạo array các promise để xử lý đồng thời
      const deletePromises = data.schoolWeekIds.map(id => 
        new Promise((resolve, reject) => {
          deleteSchoolWeek(id, {
            onError: (error) => {
              reject(error);
            },
            onSuccess: () => {
              resolve(id);
            }
          });
        })
      );

      // Chờ tất cả các promise hoàn thành
      await Promise.all(deletePromises);
      
      // Chỉ hiển thị toast success khi tất cả đều thành công
      showToast.success(`Xóa ${data.schoolWeekIds.length} tuần học thành công!`);
      
      if (data.onSuccess) {
        data.onSuccess();
      }
      onClose();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('foreign key constraint') || errorMessage.includes('Cannot delete or update a parent row')) {
        showToast.error("Không thể xóa tuần học này vì đang được sử dụng trong các bài học. Vui lòng xóa các bài học liên quan trước.");
      } else {
        showToast.error("Có lỗi xảy ra khi xóa tuần học! Vui lòng kiểm tra lại.");
      }
      
      console.error("Delete school week error:", error);
    }
  }, [data, deleteSchoolWeek, onClose]);

  if (!isOpen || type !== "deleteSchoolWeek") return null;

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
                    Smart Kid
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
                  Bạn có muốn xóa {data?.schoolWeekIds?.length} tuần học này không?
                </p>
               <div>
               <ScrollArea className="w-[500px] ">
                <div className={`flex gap-2 pb-4 justify-center ${data?.schoolWeeks?.length > 1 ? 'flex-wrap' : ''}`} >

                  {data?.schoolWeeks?.map((week: any) => (
                    <p key={week.swId} className="text-lg text-gray-600 whitespace-nowrap flex-shrink-0">
                      <span className="font-medium text-blue-600 bg-blue-50 rounded-full px-4 py-1">
                        Tuần {week.value}
                      </span>
                    </p>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
               </div>
                <div className="flex flex-wrap gap-2">
                </div>
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

export default DeleteSchoolWeekModal;
