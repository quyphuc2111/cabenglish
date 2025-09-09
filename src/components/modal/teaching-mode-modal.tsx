"use client";

import React, { Fragment, useState } from "react";
import { Dialog, DialogTitle } from "../ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useModal } from "@/hooks/useModalStore";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import CourseCard from "../course-card/course-card";
import { useUpdateUserInfo } from "@/hooks/client/useUser";
import { useSession } from "next-auth/react";
import { initializeLocked } from "@/actions/lockedAction";
import { initializeProgress } from "@/actions/progressAction";
import { cn } from "@/lib/utils";

type TeachingModeType = "default" | "freemode";

// Custom DialogContent với option ẩn nút close
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    hideCloseButton?: boolean;
  }
>(({ className, children, hideCloseButton = false, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      {!hideCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <Cross2Icon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
CustomDialogContent.displayName = "CustomDialogContent";

const MODAL_CONTENT = {
  title: "Chọn chế độ giảng dạy",
  defaultMode: {
    title: "Chế độ mặc định",
    description: [
      "Giáo viên cần hoàn thành Bài học hiện tại trước khi chuyển sang Bài học mới.",
      "Phù hợp cho những lớp học tuân theo một lộ trình học tập cố định, đảm bảo học sinh nắm vững kiến thức trước khi học nội dung mới."
    ]
  },
  freeMode: {
    title: "Chế độ tự do",
    description: [
      "Giáo viên có thể chọn dạy bất kỳ Bài học nào mà không bị ràng buộc theo thứ tự.",
      "Phù hợp khi giáo viên muốn linh hoạt điều chỉnh Bài học dựa trên trình độ, nhu cầu hoặc sở thích của học sinh."
    ]
  },
  hint: "* Bạn cần chọn một chế độ giảng dạy để tiếp tục"
};

const defaultCourseData = [
  {
    courseTitle: "Unit 1: Hello",
    courseImage: "/modal/unit1_hello.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 2: Shapes",
    courseImage: "/modal/unit2_shapes.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: "not_started"
  },
  {
    courseTitle: "Unit 3: Numbers",
    courseImage: "/modal/unit3_numbers.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: "not_started"
  },
  {
    courseTitle: "Unit 4: Nature",
    courseImage: "/modal/unit4_nature.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "not_started"
  }
];

const courseData = [
  {
    courseTitle: "Unit 1: Hello",
    courseImage: "/modal/unit1_hello.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 2: Shapes",
    courseImage: "/modal/unit2_shapes.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 3: Numbers",
    courseImage: "/modal/unit3_numbers.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 4: Nature",
    courseImage: "/modal/unit4_nature.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  }
];

const ModeDescription = ({
  items,
  className
}: {
  items: string[];
  className?: string;
}) => (
  <ul className={`list-disc pl-3 sm:pl-4 space-y-1 ${className}`}>
    {items.map((item, index) => (
      <li key={index} className="leading-relaxed">
        {item}
      </li>
    ))}
  </ul>
);

const ModeHeader = ({ icon, title }: { icon: string; title: string }) => (
  <div className="flex items-center gap-2 sm:gap-3 border-b-2 max-w-full sm:max-w-[300px] pb-2 mb-3 sm:mb-4 md:mb-5">
    <Image
      src={icon}
      alt={title}
      width={40}
      height={40}
      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-[40px] lg:h-[40px]"
    />
    <h2 className="text-base sm:text-lg md:text-xl font-semibold">{title}</h2>
  </div>
);

const ActionButtons = ({
  onBack,
  onSave,
  disabled = false,
  isViewMode = false,
  onClose
}: {
  onBack: () => void;
  onSave: () => void;
  disabled?: boolean;
  isViewMode?: boolean;
  onClose?: () => void;
}) => (
  <div className="flex gap-4">
    <Button
      onClick={onBack}
      className="bg-blue-500 hover:bg-blue-500/80 font-medium text-md"
    >
      Quay lại
    </Button>
    {isViewMode ? (
      <Button
        onClick={onClose}
        className="bg-[#3EC474] hover:bg-[#3EC474]/80 font-medium text-md"
      >
        Đóng
      </Button>
    ) : (
      <Button
        onClick={onSave}
        disabled={disabled}
        className={`font-medium text-md ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#3EC474] hover:bg-[#3EC474]/80"
        }`}
      >
        Lưu
      </Button>
    )}
  </div>
);

const ModeOption = ({
  mode,
  icon,
  title,
  borderColor,
  hoverColor,
  onClick
}: {
  mode: TeachingModeType;
  icon: string;
  title: string;
  borderColor: string;
  hoverColor: string;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, x: mode === "default" ? -50 : 50 }}
    animate={{ opacity: 1, x: 0 }}
    className={`w-full sm:w-1/2 md:w-1/3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 rounded-lg border-2 sm:border-4 ${borderColor} ${hoverColor} transition-all duration-200 cursor-pointer p-4 sm:p-6 md:p-8`}
    onClick={onClick}
  >
    <Image
      src={icon}
      alt={title}
      width={mode === "default" ? 75 : 40}
      height={mode === "default" ? 47 : 40}
      className={`${
        mode === "default"
          ? "w-12 h-8 sm:w-16 sm:h-10 md:w-[60px] md:h-[38px] lg:w-[75px] lg:h-[47px]"
          : "w-8 h-8 sm:w-10 sm:h-10 md:w-[32px] md:h-[32px] lg:w-[40px] lg:h-[40px]"
      }`}
    />
    <p className="text-sm sm:text-base md:text-lg font-medium text-center sm:text-left">
      {title}
    </p>
  </motion.div>
);

function TeachingModeModal() {
  const { isOpen, onClose, type } = useModal();
  const [mode, setMode] = useState<TeachingModeType | null>(null);
  const { data: session, update } = useSession();

  const { mutateAsync: updateUserInfo } = useUpdateUserInfo();

  const isModalOpen = isOpen && type === "teachingMode";

  // Kiểm tra xem có phải first login không (để ẩn nút close)
  const isFirstLogin = session?.user?.is_firstlogin || false;

  // Nếu không phải first login thì đây là chế độ xem thông tin
  const isViewMode = !isFirstLogin;

  const handleSave = async () => {
    if (!session || !mode) {
      return;
    }
    try {
      const selectedMode = mode === "default" ? "default" : "free";

      // 1. Cập nhật thông tin user
      await updateUserInfo(
        {
          userId: session.user.userId ?? "",
          userInfo: {
            mode: selectedMode,
            is_firstlogin: false,
            email: session.user.email ?? "",
            language: session.user.language ?? "",
            theme: session.user.theme ?? ""
          }
        },
        {
          onSuccess: async () => {
            try {
              // 2. Khởi tạo locked data và progress data song song
              const [initializeLockedResponse, initializeProgressResponse] =
                await Promise.all([
                  initializeLocked({
                    userId: session.user.userId ?? "",
                    mode: selectedMode
                  }),
                  initializeProgress(session.user.userId ?? "")
                ]);

              if (!initializeLockedResponse.success) {
                console.error(
                  "Lỗi khởi tạo locked:",
                  initializeLockedResponse.error
                );
                // Vẫn tiếp tục vì user info đã được cập nhật thành công
              }

              if (!initializeProgressResponse.success) {
                console.error(
                  "Lỗi khởi tạo progress:",
                  initializeProgressResponse.error
                );
                // Vẫn tiếp tục vì user info đã được cập nhật thành công
              }

              // 3. Cập nhật session với thông tin mới
              await update({
                user: {
                  ...session.user,
                  mode: selectedMode,
                  is_firstlogin: false
                }
              });

              onClose();
            } catch (error) {
              console.error("Lỗi trong quá trình khởi tạo:", error);
              // Vẫn đóng modal vì user info đã được cập nhật
              onClose();
            }
          }
        }
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật user info:", error);
    }
  };

  const renderModeContent = () => {
    // Nếu ở chế độ xem thông tin và chưa chọn mode, hiển thị cả hai chế độ
    if (isViewMode && !mode) {
      return (
        <div className="space-y-6 sm:space-y-8">
          {/* Chế độ mặc định */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-4 border-2 sm:border-4 border-[#4079CE] rounded-lg">
              <ModeHeader
                icon="/bkt_logo.png"
                title={MODAL_CONTENT.defaultMode.title}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {defaultCourseData.map((courseItem, index) => (
                  <Fragment key={index}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <CourseCard {...courseItem} />
                    </motion.div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
              <ModeDescription
                items={MODAL_CONTENT.defaultMode.description}
                className="w-full sm:w-2/3 text-[#736E6E] text-sm sm:text-base"
              />
              <Button
                onClick={onClose}
                className="bg-[#3EC474] hover:bg-[#3EC474]/80 font-medium text-sm sm:text-md w-full sm:w-auto"
              >
                Đóng
              </Button>
            </div>
          </motion.div>

          {/* Chế độ tự do */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-4 border-2 sm:border-4 border-[#4079CE] rounded-lg">
              <ModeHeader
                icon="/modal/freemode.png"
                title={MODAL_CONTENT.freeMode.title}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {courseData.map((courseItem, index) => (
                  <Fragment key={index}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <CourseCard {...courseItem} />
                    </motion.div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="flex items-start mt-4">
              <ModeDescription
                items={MODAL_CONTENT.freeMode.description}
                className="w-full text-[#736E6E] text-sm sm:text-base"
              />
            </div>
          </motion.div>
        </div>
      );
    }

    if (mode === "default") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-4 border-2 sm:border-4 border-[#4079CE] rounded-lg">
            <ModeHeader
              icon="/bkt_logo.png"
              title={MODAL_CONTENT.defaultMode.title}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {defaultCourseData.map((courseItem, index) => (
                <Fragment key={index}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <CourseCard {...courseItem} />
                  </motion.div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <ModeDescription
              items={MODAL_CONTENT.defaultMode.description}
              className="w-full sm:w-2/3 text-[#736E6E] text-sm sm:text-base"
            />
            <ActionButtons
              onBack={() => setMode(null)}
              onSave={handleSave}
              disabled={!mode}
              isViewMode={isViewMode}
              onClose={onClose}
            />
          </div>
        </motion.div>
      );
    }

    if (mode === "freemode") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-4 border-2 sm:border-4 border-[#4079CE] rounded-lg">
            <ModeHeader
              icon="/modal/freemode.png"
              title={MODAL_CONTENT.freeMode.title}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {courseData.map((courseItem, index) => (
                <Fragment key={index}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <CourseCard {...courseItem} />
                  </motion.div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <ModeDescription
              items={MODAL_CONTENT.freeMode.description}
              className="w-full sm:w-2/3 text-[#736E6E] text-sm sm:text-base"
            />
            <ActionButtons
              onBack={() => setMode(null)}
              onSave={handleSave}
              disabled={!mode}
              isViewMode={isViewMode}
              onClose={onClose}
            />
          </div>
        </motion.div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4"
        >
          <span className="text-[#E25762] font-medium text-lg">
            {MODAL_CONTENT.hint}
          </span>
          {!mode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-sm text-[#736E6E]"
            >
              Vui lòng chọn một trong hai chế độ bên dưới
            </motion.div>
          )}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12 lg:gap-20 justify-center w-full sm:w-4/5 md:w-3/5 mt-3 px-4 sm:px-0">
          <ModeOption
            mode="default"
            icon="/modal/bkt_logo.png"
            title="Mặc định"
            borderColor="border-[#1E67D4]"
            hoverColor="hover:bg-blue-50"
            onClick={() => setMode("default")}
          />
          <ModeOption
            mode="freemode"
            icon="/modal/freemode.png"
            title="Tự do"
            borderColor="border-[#E25762]"
            hoverColor="hover:bg-red-50"
            onClick={() => setMode("freemode")}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#E8E6E6] px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-5 lg:px-11 lg:py-5 w-full rounded-lg space-y-3 sm:space-y-4 md:space-y-2 mt-4 sm:mt-6 md:mt-7"
        >
          <div className="flex gap-2 sm:gap-3 md:gap-1 items-start">
            <div className="w-12 sm:w-16 md:w-20 flex-shrink-0">
              <div className="w-[40px] h-[26px] sm:w-[50px] sm:h-[32px] md:w-[60px] md:h-[40px] flex-shrink-0">
                <Image
                  src="/modal/bkt_logo.png"
                  alt="bkt-logo"
                  width={60}
                  height={40}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1 text-sm sm:text-base md:text-base">
                {MODAL_CONTENT.defaultMode.title}
              </p>
              <ModeDescription
                items={MODAL_CONTENT.defaultMode.description}
                className="text-xs sm:text-sm md:text-base"
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 md:gap-1 items-start">
            <div className="w-12 sm:w-16 md:w-20 flex-shrink-0">
              <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] flex-shrink-0">
                <Image
                  src="/modal/freemode.png"
                  alt="freemode"
                  width={50}
                  height={50}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1 text-sm sm:text-base md:text-base">
                {MODAL_CONTENT.freeMode.title}
              </p>
              <ModeDescription
                items={MODAL_CONTENT.freeMode.description}
                className="text-xs sm:text-sm md:text-base"
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={isViewMode ? onClose : () => {}}
      modal={true}
    >
      <DialogTitle />
      <CustomDialogContent
        className="w-[95vw] max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] sm:max-h-[90vh] !rounded-2xl sm:!rounded-3xl overflow-hidden overflow-y-auto !fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !transform px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 xl:px-20 xl:py-12"
        onPointerDownOutside={
          isViewMode ? undefined : (e: any) => e.preventDefault()
        }
        onEscapeKeyDown={
          isViewMode ? undefined : (e: any) => e.preventDefault()
        }
        hideCloseButton={isFirstLogin}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start"
        >
          <Image
            src="/modal/settings_icon.png"
            alt="settings-icon"
            width={50}
            height={50}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[50px] lg:h-[50px]"
          />
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-center sm:text-left">
            {MODAL_CONTENT.title}
          </h2>
        </motion.div>

        {renderModeContent()}
      </CustomDialogContent>
    </Dialog>
  );
}

export default TeachingModeModal;
