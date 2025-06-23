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
  const [isLoading, setIsLoading] = React.useState(false);

  // Reset loading state khi modal được mở lại
  React.useEffect(() => {
    if (isOpen && type === "changeTeachingModeModal") {
      setIsLoading(false);
    }
  }, [isOpen, type]);

  const handleConfirm = async () => {
    if (data?.onConfirm) {
      setIsLoading(true);
      try {
        await data.onConfirm();
        // Modal sẽ được đóng trong handleConfirmModeChange của parent component
      } catch (error) {
        setIsLoading(false);
        // Lỗi sẽ được xử lý trong parent component
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && type === "changeTeachingModeModal" && (
        <Dialog open={true} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-3xl !rounded-3xl overflow-hidden relative !fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !transform">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Loading Overlay */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                      />
                      <p className="text-lg font-medium text-gray-700">Đang chuyển chế độ...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                    whileHover={!isLoading ? "hover" : {}}
                    whileTap={!isLoading ? "tap" : {}}
                  >
                    <Button
                      className="bg-blue-500 hover:bg-blue-500/80 text-md text-white disabled:bg-blue-400 disabled:cursor-not-allowed"
                      size={"lg"}
                      onClick={handleConfirm}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Đang xử lý...
                        </div>
                      ) : (
                        "Đồng ý"
                      )}
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover={!isLoading ? "hover" : {}}
                    whileTap={!isLoading ? "tap" : {}}
                  >
                    <Button
                      className="bg-red-500 hover:bg-red-500/80 text-md text-white disabled:bg-red-400 disabled:cursor-not-allowed"
                      size="lg"
                      onClick={onClose}
                      disabled={isLoading}
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
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default ChangeTeachingModeModal;
