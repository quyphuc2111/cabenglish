"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { resetLessonProgress } from "@/actions/resetLessonAction";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { switchModeAction } from "@/actions/lockedAction";

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

function ResetUnitModal() {
  const { isOpen, onClose, type, data } = useModal();
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleReset = async () => {
    try {
      if (!session?.user?.userId || !data?.lessonIds) return;
      
      setIsLoading(true);
      const result = await resetLessonProgress(session.user.userId, data.lessonIds);
      const switchMode = await switchModeAction({
        userId: session.user.userId,
        mode: session.user.mode,
      })
      

      if (result.success) {
        toast.success("Đã khởi tạo lại tiến trình thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        // Gọi callback để refetch data nếu có
        if (data?.onDataRefetch) {
          await data.onDataRefetch();
        } else {
          router.refresh();
        }
        
        onClose();
      } else {
        toast.error(result.error || "Có lỗi xảy ra!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi khởi tạo lại tiến trình!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && type === "resetUnit" && (
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
                  <Image src="/modal/ques_person.png" alt="person" width={80} height={80} />
                </motion.div>
                <p className="text-2xl font-medium">Bạn có muốn khởi động lại quá trình học không?</p>
                <div className="flex gap-20">
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button 
                      className="bg-blue-500 hover:bg-blue-500/80 text-md text-white" 
                      size={"lg"}
                      onClick={handleReset}
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Đồng ý"}
                    </Button>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button 
                      className="bg-red-500 hover:bg-red-500/80 text-md text-white" 
                      size="lg"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Không
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between"
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
                  <Image src="/modal/orange.png" alt="orange" width={80} height={80} />
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
                  <Image src="/modal/orange.png" alt="orange" width={80} height={80} />
                </motion.div>
              </motion.div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default ResetUnitModal;
