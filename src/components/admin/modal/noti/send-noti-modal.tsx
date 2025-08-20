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
import { useDeleteSchoolWeek } from "@/hooks/use-schoolweek";
import { useDeleteNotiType } from "@/hooks/use-notitype";
import { Badge } from "@/components/ui/badge";
import { useSendNoti } from "@/hooks/useNoti";

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

function SendNotiModal() {
  const { isOpen, onClose, type, data } = useModal();

  const { mutate: sendNoti, isPending } = useSendNoti();

  const handleConfirm = React.useCallback(() => {
    if (!data?.noti?.notificationId) return;

    const notiName = data.noti.title;

    sendNoti(data.noti.notificationId, {
      onSuccess: () => {
        toast.success(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Gửi thành công!</p>
            <p className="text-sm text-gray-600">
              Đã gửi thông báo &quot;{notiName}&quot;
            </p>
          </div>
        );
        onClose();
      },
      onError: (error) => {
        toast.error(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Gửi thất bại!</p>
            <p className="text-sm text-gray-600">
              {error instanceof Error
                ? error.message
                : `Không thể xóa loại thông báo "${notiName}". Vui lòng thử lại sau.`}
            </p>
          </div>
        );
        console.error("Delete error:", error);
      }
    });
  }, [data?.noti, sendNoti, onClose]);

  if (!isOpen || type !== "sendNoti") return null;

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
              <div className="text-center space-y-2">
                <p className="text-2xl font-medium">
                  Bạn có muốn gửi thông báo này không?
                </p>
                {/* {data?.noti && (
                  <p className="text-lg text-gray-600">
                    <span className="font-medium text-blue-600 ">
                      Loại thông báo:{" "}
                      <Badge
                        variant="outline"
                        className="bg-blue-500 text-white px-4 py-1"
                      >
                        {data.notiType.value}
                      </Badge>
                    </span>
                  </p>
                )} */}
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

export default SendNotiModal;
