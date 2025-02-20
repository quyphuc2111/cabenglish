"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

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
interface ChangeTeachingModeModalProps {
  onConfirm?: () => void;
}

function ChangeTeachingModeModal() {
  const { isOpen, onClose, type, data } = useModal();

  const handleConfirm = () => {
    if (data?.onConfirm) {
      data.onConfirm();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && type === "changeTeachingModeModal" && (
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
                <p className="text-2xl font-medium">
                  Sẽ có những thay đổi lớn khi bạn đổi chế độ giảng dạy!
                </p>
                <p className="text-xl text-center flex items-center gap-2 ">
                  <span className="text-[#555555]">Bạn có muốn chuyển sang</span><span className="font-medium text-[#4079CE]">{`${data?.mode === "defaultMode" ? "Chế độ mặc định" : "Chế độ tự do"} ?`}</span>
                </p>
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
                    >
                      Đồng ý
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
                <div className="flex gap-4 items-center">
                 <div className="w-10 h-10">
                 <Image
                    src="/modal/ques.png"
                    alt="ques"
                    width={512}
                    height={512}
                  />
                 </div>
                  <div>
                    <p>Nếu bạn chưa rõ chế độ giảng dạy</p>
                    <Button
                      type="button"
                      variant="link"
                      className="text-[#3454E6] p-0 -mt-2"
                    >
                      Hãy xem lại ở đây!
                    </Button>
                  </div>
                </div>
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
      )}
    </AnimatePresence>
  );
}

export default ChangeTeachingModeModal;
