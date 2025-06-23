"use client";
import React, { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionContentType, SectionType } from "@/types/section";
import { cn, formatProgress } from "@/lib/utils";
import {
  useUpdateProgressSectionContent,
  useUpdateSectionContentLocked
} from "@/hooks/client/useLesson";
import { TabsContainer } from "@/components/lesson/tabs-container";
import { showToast } from "@/utils/toast-config";
import dynamic from "next/dynamic"
import { Loader2, AlertCircle, BookOpen } from "lucide-react";

const MotionMascot = dynamic(() => import('@/components/lesson/mascot'), { ssr: false })

interface SectionContent {
  sc_id: number;
  order: number;
  icon_url: string;
  iframe_url: string;
  description: string;
  title: string;
  is_locked: boolean;
}

interface LessonClientProps {
  sectionData: SectionType[];
  sectionContentData: SectionContentType[];
  isLoading?: boolean;
  error?: string;
}

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

  const [selectedSection, setSelectedSection] = useState<number | null>(() => {
    const sectionParam = searchParams.get("section");
    if (!sectionParam) return null;

    const sectionId = Number(sectionParam);
    const selectedSection = sectionData?.find((s) => s.sectionId === sectionId);

    if (selectedSection?.isLocked) {
      showToast.error("Bạn cần hoàn thành các phần học trước!");
      return null;
    }
    return sectionId;
  });

  const [sectionContentLoading, setSectionContentLoading] = useState(false);

  useEffect(() => {
    if (selectedSection && !sectionContentData) {
      setSectionContentLoading(true);
    } else {
      setSectionContentLoading(false);
    }
  }, [selectedSection, sectionContentData]);

  const handleSectionClick = useCallback((sectionId: number) => {
    const section = sectionData?.find((s) => s.sectionId === sectionId);

    if (section?.isLocked) {
      showToast.error("Bạn cần hoàn thành các phần học trước!");
      return;
    }

    setSelectedSection(sectionId);
    setSectionContentLoading(true);
    router.push(`?section=${sectionId}`);
  }, [sectionData, router]);

  const handleCloseSection = useCallback(() => {
    setSelectedSection(null);
    setSectionContentLoading(false);
    const lessonId = pathname.split('/')[2];
    router.push(`/lesson/${lessonId}`);
  }, [router, pathname]);

  const handleBack = useCallback(() => {
    if(!selectedSection) {
      router.push("/lop-hoc")
    } else {
      router.back()
    }
  }, [router, selectedSection])

  // Loading state cho toàn bộ lesson
  if (isLoading) {
    return (
      <div className="bg-[url('/assets/bg_classroom.webp')] w-screen h-screen bg-no-repeat bg-cover bg-left relative overflow-hidden pb-10 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
          <p className="text-lg font-semibold text-gray-700">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[url('/assets/bg_classroom.webp')] w-screen h-screen bg-no-repeat bg-cover bg-left relative overflow-hidden pb-10 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center gap-4 max-w-md mx-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-bold text-gray-800">Có lỗi xảy ra</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.refresh()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Thử lại
            </button>
            <button
              onClick={() => router.push("/lop-hoc")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - không có section nào
  if (!sectionData || sectionData.length === 0) {
    return (
      <div className="bg-[url('/assets/bg_classroom.webp')] w-screen h-screen bg-no-repeat bg-cover bg-left relative overflow-hidden pb-10 flex items-center justify-center">
        <MotionMascot position="left" />
        <MotionMascot position="right" />
        
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center gap-4 max-w-md mx-4">
          <BookOpen className="h-16 w-16 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-800">Chưa có nội dung học</h2>
          <p className="text-gray-600 text-center">
            Bài học này chưa có các phần học. Vui lòng liên hệ admin để tạo nội dung.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.push("/lop-hoc")}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Quay lại lớp học
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[url('/assets/bg_classroom.webp')] w-screen h-screen bg-no-repeat bg-cover bg-left relative overflow-hidden pb-10">
       <MotionMascot position="left" />
      <MotionMascot position="right" />

      <div
        className={`bg-[#F1B9D7] w-full md:w-4/5 lg:w-3/5 lg:max-w-3/5 ${
          selectedSection ? "h-full" : "h-3/4 py-4 md:py-8"
        } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl max-h-[600px] 3xl:max-h-[730px]`}
      >
        <div className={`flex relative h-full`}>
          <div className="absolute -top-9 -left-20">
            {!selectedSection && (
              <div onClick={handleBack}>
                <Image
                  src="/assets/image/lesson/previos_lesson.png"
                  width={80}
                  height={80}
                  alt="back"
                  className="w-6 h-6 md:w-14 md:h-14 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            )}
          </div>
          <div
            className={`w-full transition-all duration-500 ${
              selectedSection
                ? "translate-x-[-100%] opacity-0 pointer-events-none"
                : "translate-x-0 opacity-100 pointer-events-auto"
            }`}
          >
            <ScrollArea className="w-full px-4 h-full">
              <div className="flex flex-col gap-5">
                {[...sectionData]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((section) => (
                    <div
                      key={section.sectionId}
                      onClick={() => handleSectionClick(section.sectionId)}
                      className={`bg-white p-4 flex items-center justify-between cursor-pointer transition-all ${
                        section.isLocked ? "opacity-50" : "hover:bg-gray-50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-2 md:gap-4 w-1/3">
                        <Image
                          src={"/assets/gif/section1.gif"}
                          width={40}
                          height={40}
                          alt="section-icon"
                          className="object-contain w-8 h-8 md:w-[60px] md:h-[60px]"
                        />
                        <p className="text-base md:text-xl font-semibold truncate">
                          {section.sectionName}
                        </p>
                      </div>

                      <div className="w-1/3 flex justify-center">
                        {section.isLocked && (
                          <div className="w-8 h-8 relative">
                            <Image
                              src="/lock.png"
                              fill
                              objectFit="cover"
                              priority
                              alt="lock"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-5 w-1/3 justify-end ">
                        <div className="flex items-center gap-4 w-2/3 justify-end">
                          <p className="text-xl font-semibold w-1/2">
                            {section.estimateTime}
                          </p>
                          <div className="flex items-center gap-2 w-1/2 justify-between">
                            {" "}
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            <p
                              className={cn(
                                "text-xl font-semibold",
                                section.progress > 0
                                  ? "text-[#56B165]"
                                  : "text-[#E07E86]"
                              )}
                            >
                              {formatProgress(section.progress)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>

          {/* Section contents */}
          <div
            className={`absolute top-0 right-0 w-full h-full transition-all duration-500 ${
              selectedSection
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            {selectedSection && (
              <>
                {sectionContentLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center gap-4">
                      <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
                      <p className="text-lg font-semibold text-gray-700">Đang tải nội dung...</p>
                    </div>
                  </div>
                ) : sectionContentData ? (
                  <TabsContainer
                    sectionContents={sectionContentData}
                    sectionName={
                      sectionData.find((s) => s.sectionId === selectedSection)
                        ?.sectionName || ""
                    }
                    onClose={handleCloseSection}
                    updateProgressSectionContent={updateProgressSectionContent}
                    updateSectionContentLocked={updateSectionContentLocked}
                    nextSection={sectionData.find(
                      (s) => s.order === (
                        sectionData.find(curr => curr.sectionId === selectedSection)?.order || 0
                      ) + 1
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center gap-4 max-w-md mx-4">
                      <AlertCircle className="h-12 w-12 text-orange-500" />
                      <h2 className="text-xl font-bold text-gray-800">Chưa có nội dung</h2>
                      <p className="text-gray-600 text-center">
                        Phần học này chưa có nội dung. Vui lòng liên hệ admin để tạo nội dung.
                      </p>
                      <button
                        onClick={handleCloseSection}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        Quay lại
                      </button>
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
