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
          <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] !rounded-2xl sm:!rounded-3xl overflow-hidden overflow-y-auto !fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !transform p-4 sm:p-6 md:p-8 landscape:max-h-[90vh] landscape:py-2 landscape:px-4">
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
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                      />
                      <p className="text-lg font-medium text-gray-700">
                        Đang chuyển chế độ...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <DialogHeader className="pb-2 sm:pb-4">
                <DialogTitle>
                  <motion.div
                    className="flex items-center gap-2 sm:gap-3 md:gap-5 w-full justify-center sm:justify-start"
                    initial={{ x: -50 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <motion.div
                      className="w-[50px] h-[32px] sm:w-[60px] sm:h-[38px] md:w-[66px] md:h-[41px] flex items-center"
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
                        className="w-full h-full"
                        priority
                      />
                    </motion.div>
                    <motion.h2
                      className="flex items-center text-lg sm:text-xl md:text-2xl font-semibold"
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
                className="flex flex-col gap-4 sm:gap-5 md:gap-7 items-center py-2 sm:py-4 landscape:gap-2 landscape:py-1"
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
                    width={60}
                    height={60}
                    className="sm:w-[75px] sm:h-[75px] md:w-[90px] md:h-[90px]"
                  />
                </motion.div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-center px-2">
                  Sẽ có những thay đổi lớn khi bạn đổi chế độ giảng dạy!
                </p>
                <div className="text-sm sm:text-base md:text-lg lg:text-xl text-center flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2">
                  <span className="text-[#555555]">
                    Bạn có muốn chuyển sang
                  </span>
                  <span className="font-medium text-[#4079CE]">{`${
                    data?.mode === "defaultMode"
                      ? "Chế độ mặc định"
                      : "Chế độ tự do"
                  } ?`}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12 lg:gap-20 w-full sm:w-auto px-4 sm:px-0">
                  <motion.div
                    variants={buttonVariants}
                    whileHover={!isLoading ? "hover" : {}}
                    whileTap={!isLoading ? "tap" : {}}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      className="bg-blue-500 hover:bg-blue-500/80 text-sm sm:text-base text-white disabled:bg-blue-400 disabled:cursor-not-allowed w-full sm:w-auto"
                      size={"lg"}
                      onClick={handleConfirm}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear"
                            }}
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
                    className="w-full sm:w-auto"
                  >
                    <Button
                      className="bg-red-500 hover:bg-red-500/80 text-sm sm:text-base text-white disabled:bg-red-400 disabled:cursor-not-allowed w-full sm:w-auto"
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
                className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 md:mt-10 gap-4 sm:gap-2"
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
                  className="hidden sm:block"
                >
                  <Image
                    src="/modal/coin_bag.png"
                    alt="coin_bag"
                    width={40}
                    height={40}
                    className="sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]"
                  />
                </motion.div>
                <div className="flex gap-2 sm:gap-3 md:gap-4 items-center text-center sm:text-left">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0">
                    <Image
                      src="/modal/ques.png"
                      alt="ques"
                      width={512}
                      height={512}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs sm:text-sm md:text-base">
                      Nếu bạn chưa rõ chế độ giảng dạy
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      className="text-[#3454E6] p-0 -mt-1 sm:-mt-2 text-xs sm:text-sm md:text-base h-auto"
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
                  className="hidden sm:block"
                >
                  <Image
                    src="/modal/coin_bag.png"
                    alt="coin_bag"
                    width={40}
                    height={40}
                    className="sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]"
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
