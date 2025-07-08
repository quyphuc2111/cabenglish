"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/authAction";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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

function LogoutModal() {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Initiating logout...");
    try {
      const result = await logoutAction();
      if (!result.success) {
        console.error("Server action logout failed:", result.message);
      } else {
        console.log("Server action logout successful.");
      }
    } catch (error) {
      console.error("Error calling logout action:", error);
    }

    try {
      console.log("Calling logout-default API to clear Moodle cookies...");
      const apiUrl = process.env.NEXT_PUBLIC_BKT_ACCOUNT_API_URL || "";
      const response = await axios.post(
        `${apiUrl}/api/Moodle/logout-default`,
        {},
        {
          withCredentials: true 
        }
      );

      if (response.data.success) {
        console.log("Moodle logout successful:", response.data.message);
      } else {
        console.error("Moodle logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error calling logout-default API:", error);
    }

    try {
      console.log("Performing client-side signOut...");
      await signOut({ redirect: false }); 
      console.log("Client-side signOut successful.");
    } catch (error) {
      console.error("Next-auth signOut failed:", error);
    }

    // Đóng modal trước khi redirect
    onClose();
    router.push("/");
    router.refresh();
  }

  const handleClose = () => {
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && type === "logout" && (
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
                <p className="text-2xl font-medium">Bạn có muốn đăng xuất không?</p>
                <div className="flex gap-20">
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button className="bg-blue-500 hover:bg-blue-500/80 text-md text-white" size={"lg"} onClick={handleLogout}>
                      Đồng ý
                    </Button>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button className="bg-red-500 hover:bg-red-500/80 text-md text-white" size="lg" onClick={handleClose}>
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

export default LogoutModal;
