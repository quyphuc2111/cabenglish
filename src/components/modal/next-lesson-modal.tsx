"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import Image from "next/image";

// Animation variants
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: -20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.3
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

function NextLessonModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "nextLesson";

  useEffect(() => {
    if (isModalOpen) {
      setIsLoading(false);
    }
  }, [isModalOpen]);

  const handleConfirm = async () => {
    if (!data?.onConfirm) return;

    setIsLoading(true);
    try {
      await data.onConfirm();
      onClose();
    } catch (error) {
      console.error("Error navigating to next lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Gọi onCancel callback nếu có
    if (data?.onCancel) {
      data.onCancel();
    }
    // Luôn đóng modal
    onClose();
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
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
                className="flex flex-col gap-5 items-center"
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
                    src="/modal/ques_person.png"
                    alt="person"
                    width={80}
                    height={80}
                  />
                </motion.div>

                <p className="text-2xl text-center font-medium">
                  {data?.isLastLesson
                    ? "🎉 Chúc mừng! Bạn đã hoàn thành bài học cuối cùng trong lớp này!"
                    : "Bạn có muốn tiếp tục học bài tiếp theo không?"}
                </p>

                <div className="flex gap-20">
                  {!data?.isLastLesson ? (
                    <>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          onClick={handleConfirm}
                          disabled={isLoading}
                          className="bg-green-500 hover:bg-green-500/80 text-md text-white"
                          size="lg"
                        >
                          {isLoading ? "Đang chuyển..." : "Có"}
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          onClick={handleCancel}
                          className="bg-red-500 hover:bg-red-500/80 text-md text-white"
                          size="lg"
                        >
                          Không
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        onClick={onClose}
                        className="bg-blue-500 hover:bg-blue-500/80 text-md text-white"
                        size="lg"
                      >
                        Hoàn tất
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default NextLessonModal;
