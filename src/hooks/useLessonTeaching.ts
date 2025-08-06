import { useState, useEffect, useMemo, useCallback } from "react";
import { LessonType } from "@/types/lesson";
import { ClassroomType } from "@/types/classroom";
import { useRouter, useSearchParams } from "next/navigation";

interface UseLessonTeachingProps {
  teachingLessons: LessonType[];
  classrooms: ClassroomType[];
}

interface UseLessonTeachingReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredLessons: LessonType[];
  lessonCounts: Record<string, number>;
}

export const useLessonTeaching = ({
  teachingLessons,
  classrooms
}: UseLessonTeachingProps): UseLessonTeachingReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy activeTab từ URL parameter
  const urlActiveTab = searchParams.get("classId") || "all";
  const [activeTab, setActiveTabState] = useState<string>(urlActiveTab);

  // Đồng bộ với URL params
  useEffect(() => {
    setActiveTabState(urlActiveTab);
  }, [urlActiveTab]);

  // Tính toán lesson counts một lần
  const lessonCounts = useMemo(() => {
    const counts: Record<string, number> = { all: teachingLessons.length };

    teachingLessons.forEach((lesson) => {
      const classId = lesson.classId.toString();
      counts[classId] = (counts[classId] || 0) + 1;
    });

    return counts;
  }, [teachingLessons]);

  // Filter lessons theo active tab
  const filteredLessons = useMemo(() => {
    if (activeTab === "all") return teachingLessons;

    return teachingLessons
      .filter((lesson) => lesson.classId.toString() === activeTab)
      .sort((a, b) => {
        if (a.classId !== b.classId) return a.classId - b.classId;
        if (a.unitId !== b.unitId) return a.unitId - b.unitId;
        return a.lessonId - b.lessonId;
      });
  }, [teachingLessons, activeTab]);

  // Optimized setActiveTab với URL update
  const setActiveTab = useCallback(
    (tab: string) => {
      setActiveTabState(tab);

      // Debounced URL update
      requestIdleCallback(() => {
        const params = new URLSearchParams(searchParams);
        if (tab === "all") {
          params.delete("classId");
        } else {
          params.set("classId", tab);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router]
  );

  return {
    activeTab,
    setActiveTab,
    filteredLessons,
    lessonCounts
  };
};
