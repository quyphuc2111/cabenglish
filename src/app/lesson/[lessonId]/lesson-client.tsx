"use client";
import React, { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionType, SectionContentType } from "@/types/section";
import { cn, formatProgress } from "@/lib/utils";
import {
  useUpdateProgressSectionContent,
  useUpdateSectionContentLocked
} from "@/hooks/client/useLesson";
import { TabsContainer } from "@/components/lesson/tabs-container";
import { showToast } from "@/utils/toast-config";
import { useModal } from "@/hooks/useModalStore";
import { useNavigationStore } from "@/store/navigationStore";
import dynamic from "next/dynamic";
import {
  Loader2,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Clock,
  CheckCircle,
  Lock
} from "lucide-react";
import OptimizeImage from "@/components/common/optimize-image";
import { useSelectLessonStore } from "@/store/useSelectLesson";

const MotionMascot = dynamic(() => import("@/components/lesson/mascot"), {
  ssr: false
});

interface LessonClientProps {
  sectionData: SectionType[];
  sectionContentData: SectionContentType[];
  isLoading?: boolean;
  error?: string;
}

// Common styles as constants
const STYLES = {
  container: {
    base: "min-h-screen relative overflow-hidden",
    loading:
      "min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center relative overflow-hidden",
    error:
      "min-h-screen bg-gradient-to-br from-red-400 via-pink-400 to-orange-400 flex items-center justify-center relative overflow-hidden"
  },
  cardWrapper:
    "relative z-10 bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/20",
  background:
    "absolute inset-0 bg-[url('/assets/bg_classroom.webp')] bg-cover bg-center",
  buttonPrimary:
    "px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-2"
};

function LessonClient({
  sectionData,
  sectionContentData,
  isLoading = false,
  error
}: LessonClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: updateProgressSectionContent } =
    useUpdateProgressSectionContent();
  const { mutate: updateSectionContentLocked } =
    useUpdateSectionContentLocked();
  const { onOpen } = useModal();
  const { lessonName, setSelectedLesson } = useSelectLessonStore();
  const { previousPage, clearPreviousPage } = useNavigationStore();

  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [sectionContentLoading, setSectionContentLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const handleSectionClick = useCallback(
    (sectionId: number) => {
      const section = sectionData?.find((s) => s.sectionId === sectionId);

      if (section?.isLocked) {
        showToast.error("Bạn cần hoàn thành các phần học trước!");
        return;
      }

      setSelectedSection(sectionId);
      setSectionContentLoading(true);
      router.push(`?section=${sectionId}`);
    },
    [sectionData, router]
  );

  const handleCloseSection = useCallback(() => {
    setSelectedSection(null);
    setSectionContentLoading(false);
    const lessonId = pathname.split("/")[2];
    router.push(`/lesson/${lessonId}`);
  }, [router, pathname]);

  const handleBack = useCallback(() => {
    if (!selectedSection) {
      router.push("/lop-hoc");
    } else {
      router.back();
    }
  }, [router, selectedSection]);

  // const handleBack = useCallback(() => {
  //   if (!selectedSection) {
  //     // Kiểm tra xem có thông tin về trang trước không
  //     if (previousPage && previousPage.url) {
  //       // Navigate về trang trước với state được lưu
  //       console.log("🔙 Navigating back to:", previousPage);
  //       clearPreviousPage(); // Clear để tránh loop
  //       router.push(previousPage.url);
  //     } else {
  //       // Fallback về trang mặc định
  //       router.push("/lop-hoc");
  //     }
  //   } else {
  //     router.back();
  //   }
  // }, [router, selectedSection, previousPage, clearPreviousPage]);

  const handleShowNextSectionModal = useCallback(() => {
    const lessonId = pathname.split("/")[2];
    // Tìm section tiếp theo
    const currentSection = sectionData.find(
      (s) => s.sectionId === selectedSection
    );
    const nextSection = sectionData.find(
      (s) => s.order === (currentSection?.order || 0) + 1
    );

    onOpen("nextSection", {
      onConfirm: () => {
        // Navigate to next section if exists, otherwise stay on lesson page
        if (nextSection) {
          router.push(`?section=${nextSection.sectionId}`);
        } else {
          router.push(`/lesson/${lessonId}`);
        }
      }
    });
  }, [onOpen, router, pathname, selectedSection, sectionData]);

  // Effect hooks
  useEffect(() => {
    setMounted(true);
    const sectionParam = searchParams.get("section");
    if (sectionParam && sectionData) {
      const sectionId = Number(sectionParam);
      const selectedSection = sectionData.find(
        (s) => s.sectionId === sectionId
      );

      if (selectedSection?.isLocked) {
        showToast.error("Bạn cần hoàn thành các phần học trước!");
        setSelectedSection(null);
      } else {
        setSelectedSection(sectionId);
      }
    }
  }, [searchParams, sectionData]);

  useEffect(() => {
    if (selectedSection && !sectionContentData) {
      setSectionContentLoading(true);
    } else {
      setSectionContentLoading(false);
    }
  }, [selectedSection, sectionContentData]);

  // Check scroll indicator on mount and when data changes
  useEffect(() => {
    if (mounted && sectionData && sectionData.length > 0) {
      const scrollArea = document.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollArea) {
        const { scrollHeight, clientHeight } = scrollArea;
        setShowScrollIndicator(scrollHeight > clientHeight);
      }
    }
  }, [mounted, sectionData]);

  if (!mounted) {
    return (
      <div className={STYLES.container.loading}>
        <div className={`${STYLES.background} opacity-20`}></div>
        <div className={`${STYLES.cardWrapper} mx-4 sm:mx-0`}>
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <Loader2 className="absolute inset-0 m-auto h-8 sm:h-10 w-8 sm:w-10 animate-spin text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Đang khởi tạo
              </h3>
              <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={STYLES.container.loading}>
        <div className={`${STYLES.background} opacity-20`}></div>
        <div className={`${STYLES.cardWrapper} mx-4 sm:mx-0`}>
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <BookOpen className="absolute inset-0 m-auto h-8 sm:h-10 w-8 sm:w-10 text-white animate-bounce" />
            </div>
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Đang tải bài học
              </h3>
              <p className="text-gray-600">
                Chuẩn bị nội dung học tập cho bạn...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={STYLES.container.error}>
        <div className={`${STYLES.background} opacity-20`}></div>
        <div className={`${STYLES.cardWrapper} max-w-lg mx-4`}>
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3">
                Có lỗi xảy ra
              </h2>
              <p className="text-gray-600 leading-relaxed">{error}</p>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 sm:mt-4 justify-center">
              <button
                onClick={() => router.refresh()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base"
              >
                Thử lại
              </button>
              <button
                onClick={() => router.push("/lop-hoc")}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-sm sm:text-base"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - không có section nào
  if (!sectionData || sectionData.length === 0) {
    return (
      <div className={STYLES.container.base}>
        <div className={STYLES.background}></div>

        <div className="hidden md:block">
          <MotionMascot position="left" />
          <MotionMascot position="right" />
        </div>

        <div className={`${STYLES.cardWrapper} max-w-lg mx-4`}>
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 sm:w-8 h-6 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xs sm:text-sm">★</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Chưa có nội dung học
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Bài học này chưa có các phần học. Vui lòng liên hệ admin để tạo
                nội dung.
              </p>
            </div>
            <button
              onClick={() => router.push("/lop-hoc")}
              className={STYLES.buttonPrimary}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Quay lại lớp học
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main content styles
  const mainContentStyles = {
    contentCard: cn(
      "z-10 bg-white/95 backdrop-blur-xl w-[95%] sm:w-[80%] mx-auto",
      "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl sm:rounded-2xl md:rounded-3xl",
      "shadow-2xl border border-white/20",
      "max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] lg:max-h-[90vh]",
      selectedSection ? "h-full" : "h-[85vh] py-4 sm:py-6 md:py-8"
    ),
    sectionList: `w-full transition-all duration-500 ${
      selectedSection
        ? "translate-x-[-100%] opacity-0 pointer-events-none"
        : "translate-x-0 opacity-100 pointer-events-auto"
    }`,
    sectionContent: `absolute top-0 right-0 w-full h-full transition-all duration-500 ${
      selectedSection
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0"
    }`
  };

  return (
    <div className={STYLES.container.base}>
      {/* Background overlay */}
      <div className={STYLES.background}></div>

      <div className="hidden md:block">
        <MotionMascot position="left" />
        <MotionMascot position="right" />
      </div>

      <div className={mainContentStyles.contentCard}>
        {/* Header */}
        <div className="absolute -top-5 md:-top-6 lg:-top-7 left-0 right-0 flex justify-between gap-5 sm:gap-0 items-center px-3 sm:px-6">
          {!selectedSection && (
            <>
              <button
                onClick={handleBack}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 sm:p-3 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 group "
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 group-hover:translate-x-[-2px] transition-transform" />
              </button>

              <div className="bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-white/30 max-w-[85%] overflow-hidden">
                <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                  {lessonName}
                </h1>
              </div>
              <div className="w-8 sm:w-12"></div>
            </>
          )}
        </div>

        <div className={`flex relative h-full pt-2 sm:pt-6`}>
          <div className={mainContentStyles.sectionList}>
            <ScrollArea
              className="w-full px-3 sm:px-6 h-full"
              onScrollCapture={(e) => {
                const target = e.target as HTMLElement;
                const { scrollTop, scrollHeight, clientHeight } = target;
                const isScrollable = scrollHeight > clientHeight;
                const isAtBottom =
                  scrollTop + clientHeight >= scrollHeight - 10;
                setShowScrollIndicator(isScrollable && !isAtBottom);
              }}
            >
              <div className="grid gap-3 sm:gap-6 py-2 sm:py-4 px-2 sm:px-4 md:px-10">
                {[...sectionData]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((section, index) => (
                    <div
                      key={section.sectionId}
                      onClick={() => handleSectionClick(section.sectionId)}
                      className={cn(
                        "group relative bg-gradient-to-r from-white to-gray-50 rounded-xl sm:rounded-2xl",
                        "p-3 sm:p-4 md:p-6 shadow-lg border border-gray-100 transition-all duration-300 transform",
                        section.isLocked
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:shadow-xl hover:scale-[1.02] cursor-pointer hover:from-purple-50 hover:to-pink-50"
                      )}
                    >
                      {/* Progress bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-xl sm:rounded-t-2xl overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                          style={{
                            width: `${formatProgress(section.progress)}%`
                          }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2 sm:flex-nowrap">
                        {/* Left section - Icon and title */}
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-1/3">
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                              <OptimizeImage
                                src={section.iconUrl}
                                width={64}
                                height={64}
                                alt="section_icon"
                              />
                            </div>

                            {section.progress === 100 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-0 sm:mb-1 group-hover:text-purple-700 transition-colors line-clamp-2">
                              {section.sectionName}
                            </h3>
                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>{section.estimateTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center sm:hidden w-full items-end">
                          {/* Lock icon for small screens */}
                          {section.isLocked && (
                            <div className="flex justify-center sm:hidden">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 relative">
                                <Lock className="text-gray-400" size={24} />
                              </div>
                            </div>
                          )}

                          <div className="flex sm:hidden flex-col items-end gap-1 sm:gap-2 w-full sm:w-1/3">
                            <div
                              className={`text-xl sm:text-2xl font-bold ${
                                section.progress > 0
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {formatProgress(section.progress)}%
                            </div>
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                  section.progress === 100
                                    ? "bg-green-500"
                                    : section.progress > 0
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <span className="text-xs text-gray-500">
                                {section.progress === 100
                                  ? "Hoàn thành"
                                  : section.progress > 0
                                  ? "Đang học"
                                  : "Chưa bắt đầu"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Lock icon for larger screens */}
                        {section.isLocked && (
                          <div className="hidden sm:flex w-1/3 justify-center">
                            <div className="w-7 h-7 relative">
                              <Image
                                src="/lock.png"
                                fill
                                objectFit="cover"
                                alt="lock"
                              />
                            </div>
                          </div>
                        )}

                        {/* Right section - Progress */}
                        <div className="hidden sm:flex flex-col items-end gap-1 sm:gap-2 w-full sm:w-1/3">
                          <div
                            className={`text-xl sm:text-2xl font-bold ${
                              section.progress > 0
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            {formatProgress(section.progress)}%
                          </div>
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                section.progress === 100
                                  ? "bg-green-500"
                                  : section.progress > 0
                                  ? "bg-yellow-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="text-xs text-gray-500">
                              {section.progress === 100
                                ? "Hoàn thành"
                                : section.progress > 0
                                ? "Đang học"
                                : "Chưa bắt đầu"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      {!section.isLocked && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </div>
                  ))}
              </div>
            </ScrollArea>

            {/* Scroll indicator */}
            {showScrollIndicator && (
              <div className="absolute bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <style jsx>{`
                  @keyframes mouseScroll {
                    0% {
                      transform: translateY(0);
                      opacity: 1;
                    }
                    50% {
                      transform: translateY(6px);
                      opacity: 0.5;
                    }
                    100% {
                      transform: translateY(12px);
                      opacity: 0;
                    }
                  }
                  .mouse-scroll-dot {
                    animation: mouseScroll 2s infinite;
                  }
                `}</style>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 sm:px-4 sm:py-3 rounded-full shadow-lg animate-bounce flex items-center gap-2">
                  {/* Mouse scroll animation */}
                  <div className="relative w-2 h-4 sm:w-3 sm:h-5 border-2 border-white rounded-full flex justify-center overflow-hidden">
                    <div className="mouse-scroll-dot w-1 h-1 sm:w-1 sm:h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium">Scroll</span>
                </div>
              </div>
            )}
          </div>

          {/* Section contents */}
          <div className={mainContentStyles.sectionContent}>
            {selectedSection && (
              <>
                {sectionContentLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/20">
                      <div className="flex flex-col items-center gap-4 sm:gap-6">
                        <div className="relative">
                          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                          <Loader2 className="absolute inset-0 m-auto h-8 sm:h-10 w-8 sm:w-10 animate-spin text-white" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Đang tải nội dung
                          </h3>
                          <p className="text-gray-600">
                            Chuẩn bị bài học cho bạn...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : sectionContentData ? (
                  <TabsContainer
                    sectionContents={sectionContentData}
                    sectionInfo={
                      sectionData.find((s) => s.sectionId === selectedSection)!
                    }
                    onClose={handleCloseSection}
                    updateProgressSectionContent={updateProgressSectionContent}
                    updateSectionContentLocked={updateSectionContentLocked}
                    nextSection={sectionData.find(
                      (s) =>
                        s.order ===
                        (sectionData.find(
                          (curr) => curr.sectionId === selectedSection
                        )?.order || 0) +
                          1
                    )}
                    onShowNextSectionModal={handleShowNextSectionModal}
                    currentLesson={{
                      lessonId: parseInt(pathname.split("/")[2]),
                      classId: 0, // Sẽ được lấy từ server-side nếu cần
                      unitId: 0, // Sẽ được lấy từ server-side nếu cần
                      lessonOrder: 0
                    }}
                    allSections={sectionData}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/20 max-w-lg mx-4">
                      <div className="flex flex-col items-center gap-4 sm:gap-6">
                        <div className="relative">
                          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 sm:w-8 h-6 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 text-xs sm:text-sm">
                              ★
                            </span>
                          </div>
                        </div>
                        <div className="text-center">
                          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                            Chưa có nội dung
                          </h2>
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Phần học này chưa có nội dung. Vui lòng liên hệ
                            admin để tạo nội dung.
                          </p>
                        </div>
                        <button
                          onClick={handleCloseSection}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-2"
                        >
                          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                          Quay lại
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonClient;
