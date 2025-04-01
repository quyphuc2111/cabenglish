"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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

interface Section {
  section_id: number;
  section_name: string;
  estimate_time: number;
  icon_url: string;
  section_contents: SectionContent[];
  progress: number;
  is_locked: boolean;
}

function LessonClient({
  sectionData,
  sectionContentData
}:
{
  sectionData: SectionType[];
  sectionContentData: SectionContentType[];
  updateLockedSectionContentAction?: (
    sectionContentId: number
  ) => Promise<void>;
  updateProgressSectionContentAction?: (
    sectionContentId: number,
    progress: number
  ) => Promise<void>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate: updateProgressSectionContent } =
    useUpdateProgressSectionContent();
  const { mutate: updateSectionContentLocked } =
    useUpdateSectionContentLocked();

  const [selectedSection, setSelectedSection] = useState<number | null>(() => {
    const sectionParam = searchParams.get("section");
    if (!sectionParam) return null;

    const sectionId = Number(sectionParam);
    const selectedSection = sectionData.find((s) => s.sectionId === sectionId);

    if (selectedSection?.isLocked) {
      showToast.error("Bạn cần hoàn thành các phần học trước!");
      return null;
    }
    return sectionId;
  });

  const handleSectionClick = useCallback((sectionId: number) => {
    const section = sectionData.find((s) => s.sectionId === sectionId);

    if (section?.isLocked) {
      showToast.error("Bạn cần hoàn thành các phần học trước!");
      return;
    }

    setSelectedSection(sectionId);
    router.push(`?section=${sectionId}`);
  }, [sectionData, router]);

  const handleCloseSection = useCallback((sectionId: number) => {
    setSelectedSection(null);
    router.push(`/lesson/${sectionId}`);
  }, [router]);

  const handleBack = useCallback(() => {
    if(!selectedSection) {
      router.push("/lop-hoc")
    } else {
      router.back()
    }
  }, [router, selectedSection])

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
                  className="w-6 h-6 md:w-14 md:h-14"
                />
              </div>
            )}
          </div>
          <div
            className={`w-full transition-all duration-500 ${
              selectedSection
                ? "translate-x-[-100%] opacity-0"
                : "translate-x-0 opacity-100"
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
                      className={`bg-white p-4 flex items-center justify-between cursor-pointer ${
                        section.isLocked ? "opacity-50" : "hover:bg-gray-50"
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
            {selectedSection && sectionContentData && (
              <TabsContainer
                sectionContents={sectionContentData}
                sectionName={
                  sectionData.find((s) => s.sectionId === selectedSection)
                    ?.sectionName || ""
                }
                onClose={() => handleCloseSection(selectedSection)}
                updateProgressSectionContent={updateProgressSectionContent}
                updateSectionContentLocked={updateSectionContentLocked}
                nextSection={sectionData.find(
                  (s) => s.order === (
                    sectionData.find(curr => curr.sectionId === selectedSection)?.order || 0
                  ) + 1
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonClient;
