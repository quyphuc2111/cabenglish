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
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { useDeleteNoti } from "@/hooks/useNoti";

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

function DeleteNotiModal() {
  const { isOpen, onClose, type, data } = useModal();

  const { mutate: deleteNoti, isPending } = useDeleteNoti();

  const handleConfirm = React.useCallback(() => {
    if (!data?.noti?.notificationId) return;

    const notiName = data.noti.title;

    if(data.notiIds){
      data.notiIds.forEach((notiId) => {
        deleteNoti(notiId, {
          onSuccess: () => {
            toast.success("Xóa thành công!");
          }
        });
      });
    }else{
      deleteNoti(data.noti.notificationId, {
        onSuccess: () => {
          toast.success(
            <div className="flex flex-col gap-1">
            <p className="font-medium">Xóa thành công!</p>
            <p className="text-sm text-gray-600">
              Đã xóa loại thông báo &quot;{notiName}&quot;
            </p>
          </div>
        );
        onClose();
      },
      onError: (error) => {
        toast.error(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Xóa thất bại!</p>
            <p className="text-sm text-gray-600">
              {error instanceof Error 
                ? error.message 
                : `Không thể xóa thông báo "${notiName}". Vui lòng thử lại sau.`
              }
            </p>
          </div>
        );
        console.error("Delete error:", error);
      }
    });
    }
  }, [data?.noti, deleteNoti, onClose]);

  if (!isOpen || type !== "deleteNoti") return null;

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={onClose}>
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogContent className="sm:max-w-3xl !rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm max-h-[90vh]">
            <DialogHeader className="border-b pb-4">
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
                    className="flex items-center text-xl font-semibold text-gray-800"
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
              className="flex flex-col gap-7 items-center w-full py-4"
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
                className="hidden sm:block"
              >
                <Image
                  src="/modal/alert.png"
                  alt="warning"
                  width={40}
                  height={40}
                  className="opacity-90"
                />
              </motion.div>

              <div className="text-center space-y-4 w-full px-4 sm:px-8">
                <p className="text-xl sm:text-2xl font-medium text-red-500/90">
                  {data?.notis?.length > 1 
                    ? `Xóa ${data.notis.length} thông báo đã chọn?`
                    : "Xóa thông báo này?"
                  }
                </p>
                
                <div className="max-h-[120px] sm:max-h-[280px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {data?.notis ? (
                    <div className="space-y-3">
                      {data.notis.map((noti) => (
                        <div 
                          key={noti.notificationId} 
                          className="p-4 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-100 shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-start justify-between sm:justify-start gap-2">
                                <Badge variant="outline" className="h-6 whitespace-nowrap bg-blue-50 text-blue-600 border-blue-200">
                                  {noti.notiTypeValue}
                                </Badge>
                                <span className="text-xs text-gray-400">
                                  {new Date(noti.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                              <h3 className="font-medium text-left text-base sm:text-lg text-gray-800 line-clamp-2">
                                {noti.title}
                              </h3>
                              <p className="text-sm text-gray-600 text-left line-clamp-2">
                                {noti.description}
                              </p>
                            </div>
                            <div className="hidden sm:block border-l pl-4 min-w-[140px]">
                              <div className="space-y-1 text-xs text-gray-500">
                                <p className="flex items-center gap-1.5">
                                  <span className="w-[6px] h-[6px] rounded-full bg-green-400"/>
                                  Tạo: {new Date(noti.createdAt).toLocaleTimeString('vi-VN')}
                                </p>
                                {noti.lastSentTime && (
                                  <p className="flex items-center gap-1.5">
                                    <span className="w-[6px] h-[6px] rounded-full bg-blue-400"/>
                                    Gửi: {new Date(noti.lastSentTime).toLocaleTimeString('vi-VN')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : data?.noti ? (
                    <div className="p-4 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-100 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start justify-between sm:justify-start gap-2">
                            <Badge variant="outline" className="h-6 whitespace-nowrap bg-blue-50 text-blue-600 border-blue-200">
                              {data.noti.notiTypeValue}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(data.noti.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <h3 className="font-medium text-left text-base sm:text-lg text-gray-800">
                            {data.noti.title}
                          </h3>
                          <p className="text-sm text-gray-600 text-left">
                            {data.noti.description}
                          </p>
                        </div>
                        <div className="hidden sm:block border-l pl-4 min-w-[140px]">
                          <div className="space-y-1 text-xs text-gray-500">
                            <p className="flex items-center gap-1.5">
                              <span className="w-[6px] h-[6px] rounded-full bg-green-400"/>
                              Tạo: {new Date(data.noti.createdAt).toLocaleTimeString('vi-VN')}
                            </p>
                            {data.noti.lastSentTime && (
                              <p className="flex items-center gap-1.5">
                                <span className="w-[6px] h-[6px] rounded-full bg-blue-400"/>
                                Gửi: {new Date(data.noti.lastSentTime).toLocaleTimeString('vi-VN')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* <p className="text-gray-400 pt-2 text-sm">
                  Hành động này không thể hoàn tác
                </p> */}
              </div>

              <div className="flex gap-3 sm:gap-4">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-sm sm:text-base text-white px-6 sm:px-8 rounded-xl shadow-sm shadow-red-500/20"
                    size={"lg"}
                    onClick={handleConfirm}
                    disabled={isPending}
                  >
                    {isPending ? "Đang xóa..." : "Xóa"}
                  </Button>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    className="bg-gray-100 hover:bg-gray-200 text-sm sm:text-base text-gray-700 px-6 sm:px-8 rounded-xl"
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
              className="flex items-center justify-between mt-10 absolute bottom-2 left-5 right-5"
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

export default DeleteNotiModal;
