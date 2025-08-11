"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { CourseCarousel } from "@/components/carousel/course-carousel";
import OptimizeImage from "@/components/common/optimize-image";
import { useNavigationStore } from "@/store/navigationStore";
import { useNavigationRestore } from "@/hooks/useNavigationRestore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUnitByClassId } from "@/actions/unitsAction";
import { getSchoolWeekByUnitId } from "@/actions/schoolWeekAction";
import { ChevronDown, Users, BookOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Select Component with better styling
const CustomSelect = memo(
  ({
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
    loading = false,
    icon: Icon,
    label
  }: {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: any;
    label: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => opt.value === value);
    const hasValue = value && value !== "";

    return (
      <div className="relative">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
          {Icon && <Icon className="w-4 h-4 text-green-600" />}
          {label}
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
            disabled={disabled || loading}
            className={cn(
              "w-full px-4 py-3 text-left border-2 rounded-xl transition-all duration-200",
              "flex items-center justify-between gap-2",
              "shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/20",
              "text-sm font-medium",
              // States
              hasValue
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-900"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
              disabled &&
                "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60",
              loading && "bg-gray-50 border-gray-200 cursor-wait"
            )}
          >
            <span
              className={cn(
                "truncate",
                hasValue ? "text-green-900 font-semibold" : "text-gray-500"
              )}
            >
              {loading ? "Đang tải..." : selectedOption?.label || placeholder}
            </span>

            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200 flex-shrink-0",
                isOpen && "rotate-180",
                hasValue ? "text-green-600" : "text-gray-400"
              )}
            />
          </button>

          {isOpen && !disabled && !loading && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              <div className="py-2">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm transition-colors duration-150",
                      "hover:bg-green-50 focus:outline-none focus:bg-green-50",
                      option.value === value
                        ? "bg-green-100 text-green-900 font-semibold"
                        : "text-gray-700 hover:text-green-800"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Overlay to close dropdown */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

interface LectureFavouriteListProps {
  courseData: any[];
  initialFilterData: any;
  fetchFilterData: ({
    classId,
    unitId,
    userId
  }: {
    classId?: string;
    unitId?: string;
    userId?: string;
  }) => Promise<any>;
  onDataRefetch?: () => Promise<void>;
  classrooms: any[];
}

const LectureFavouriteList = memo(function LectureFavouriteList({
  courseData,
  initialFilterData,
  fetchFilterData,
  onDataRefetch,
  classrooms
}: LectureFavouriteListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { lectureFavouriteState, setLectureFavouriteState, setPreviousPage } =
    useNavigationStore();
  const { isReturningFromLesson } = useNavigationRestore();

  // Local state for filters - restored from navigation store
  const [selectedClassId, setSelectedClassId] = useState(
    lectureFavouriteState?.selectedClassId || ""
  );
  const [selectedUnitId, setSelectedUnitId] = useState(
    lectureFavouriteState?.selectedUnitId || ""
  );
  const [selectedWeekId, setSelectedWeekId] = useState(
    lectureFavouriteState?.selectedWeekId || ""
  );

  // State để track những lesson đang trong quá trình removing
  const [removingLessons, setRemovingLessons] = useState<Set<number>>(
    new Set()
  );

  // State for filter options
  const [units, setUnits] = useState<any[]>([]);
  const [schoolWeeks, setSchoolWeeks] = useState<any[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingWeeks, setLoadingWeeks] = useState(false);

  const { t } = useTranslation("", "common");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug khi courseData thay đổi - clear removing lessons khi data update
  useEffect(() => {
    // Clear removing lessons khi data update (sau khi refetch hoàn tất)
    setRemovingLessons(new Set());
  }, [courseData]);

  // Hydrate dependent options when coming back with restored filters
  useEffect(() => {
    let cancelled = false;

    const loadUnitsIfNeeded = async () => {
      if (!selectedClassId || units.length > 0) return;
      try {
        setLoadingUnits(true);
        const unitsResponse = await getUnitByClassId(
          selectedClassId,
          session?.user?.userId || ""
        );
        if (cancelled) return;
        setUnits(
          Array.isArray(unitsResponse)
            ? unitsResponse
            : unitsResponse?.data || []
        );
      } catch (e) {
        if (!cancelled) {
          console.error("[lecture-favourite] restore units failed:", e);
          setUnits([]);
        }
      } finally {
        if (!cancelled) setLoadingUnits(false);
      }
    };

    const loadWeeksIfNeeded = async () => {
      if (!selectedUnitId || schoolWeeks.length > 0) return;
      try {
        setLoadingWeeks(true);
        const weeksResponse = await getSchoolWeekByUnitId({
          unitId: parseInt(selectedUnitId)
        });
        if (cancelled) return;
        setSchoolWeeks(Array.isArray(weeksResponse) ? weeksResponse : []);
      } catch (e) {
        if (!cancelled) {
          console.error("[lecture-favourite] restore weeks failed:", e);
          setSchoolWeeks([]);
        }
      } finally {
        if (!cancelled) setLoadingWeeks(false);
      }
    };

    // Only run on initial paint or when returning from lesson with stored state
    loadUnitsIfNeeded().then(loadWeeksIfNeeded);

    return () => {
      cancelled = true;
    };
  }, [selectedClassId, selectedUnitId, session?.user?.userId]);

  // Restore scroll when returning from lesson and we have stored position
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isReturningFromLesson && lectureFavouriteState?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, lectureFavouriteState.scrollPosition || 0);
      }, 100);
    }
  }, [isReturningFromLesson, lectureFavouriteState?.scrollPosition]);

  // Callback để trigger fadeout và refetch data từ server
  const handleLikeUpdate = useCallback(
    async (lessonId: number, newLikeCount: number) => {
      // Nếu unlike (newLikeCount = 0), thêm vào removing list và trigger fadeout
      if (newLikeCount === 0) {
        setRemovingLessons((prev) => new Set([...prev, lessonId]));

        // Delay để animation fadeout có thời gian chạy
        setTimeout(async () => {
          if (onDataRefetch) {
            await onDataRefetch();
          }
        }, 800); // 800ms để animation fadeout hoàn thành
      } else {
        // Nếu like, refetch ngay lập tức
        if (onDataRefetch) {
          await onDataRefetch();
        }
      }
    },
    [onDataRefetch]
  );

  // Memoize filtered data để tránh re-computation không cần thiết
  const filteredLessonData = useMemo(() => {
    return courseData
      .filter((item) => {
        const matchesLocked = !item.isLocked;
        const matchesProgress =
          item.numLiked > 0 || removingLessons.has(item.lessonId); // Include removing lessons
        const matchesClass =
          !selectedClassId || item.classId === Number(selectedClassId);
        const matchesUnit =
          !selectedUnitId || item.unitId === Number(selectedUnitId);

        // Thử nhiều cách so sánh school week
        const matchesSchoolWeek =
          !selectedWeekId ||
          item.schoolWeekId === Number(selectedWeekId) ||
          String(item.schoolWeekId) === selectedWeekId ||
          item.schoolWeek === Number(selectedWeekId) ||
          String(item.schoolWeek) === selectedWeekId;

        return (
          matchesClass &&
          matchesUnit &&
          matchesLocked &&
          matchesSchoolWeek &&
          matchesProgress
        );
      })
      .sort((a, b) => {
        const dateA = a.updatedAt || a.createdAt || a.lessonId;
        const dateB = b.updatedAt || b.createdAt || b.lessonId;
        return dateB - dateA;
      })
      .slice(0, 20);
  }, [
    courseData,
    selectedClassId,
    selectedUnitId,
    selectedWeekId,
    removingLessons
  ]);

  // Handle class change
  const handleClassChange = useCallback(
    async (classId: string) => {
      setSelectedClassId(classId);
      setSelectedUnitId(""); // Reset unit when changing class
      setSelectedWeekId(""); // Reset week when changing class
      setUnits([]);
      setSchoolWeeks([]); // Reset school weeks when changing class

      if (classId && classId !== "") {
        setLoadingUnits(true);
        try {
          const unitsResponse = await getUnitByClassId(
            classId,
            session?.user?.userId || ""
          );
          setUnits(
            Array.isArray(unitsResponse)
              ? unitsResponse
              : unitsResponse.data || []
          );
        } catch (error) {
          console.error("Error loading units:", error);
          setUnits([]);
        } finally {
          setLoadingUnits(false);
        }
      }
    },
    [session?.user?.userId]
  );

  // Handle unit change
  const handleUnitChange = useCallback(async (unitId: string) => {
    setSelectedUnitId(unitId);
    setSelectedWeekId(""); // Reset week when changing unit
    setSchoolWeeks([]); // Reset school weeks when changing unit

    if (unitId && unitId !== "") {
      setLoadingWeeks(true);
      try {
        const weeksResponse = await getSchoolWeekByUnitId({
          unitId: parseInt(unitId)
        });
        setSchoolWeeks(Array.isArray(weeksResponse) ? weeksResponse : []);
      } catch (error) {
        console.error("Error loading school weeks:", error);
        setSchoolWeeks([]);
      } finally {
        setLoadingWeeks(false);
      }
    }
  }, []);

  // Handle week change
  const handleWeekChange = useCallback((weekId: string) => {
    setSelectedWeekId(weekId);
  }, []);

  // Handle navigation to a specific lesson with state persistence
  const handleNavigateToLesson = useCallback(
    (lessonId: number) => {
      // Save previous page with filters and scroll
      setPreviousPage({
        url: "/tong-quan",
        title: "Tổng quan",
        state: {
          scrollPosition: window.scrollY,
          filters: {
            selectedClassId,
            selectedUnitId,
            selectedWeekId
          }
        }
      });

      // Persist lecture favourite state
      setLectureFavouriteState({
        selectedClassId,
        selectedUnitId,
        selectedWeekId,
        scrollPosition: window.scrollY
      });

      // Navigate
      router.push(`/lesson/${lessonId}`);
    },
    [
      router,
      selectedClassId,
      selectedUnitId,
      selectedWeekId,
      setLectureFavouriteState,
      setPreviousPage
    ]
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className="px-0 md:px-0 w-full">
      {/* Header with title */}
      <div className="flex items-center w-max gap-3 px-4 pt-3  bg-white rounded-t-xl">
        <Image
          src="/favourite.png"
          alt="favourite"
          width={30}
          height={30}
          className="w-6 h-6 md:w-8 md:h-8"
        />
        <h3 className="font-bold text-gray-800 ">{String(t("favourite"))}</h3>
      </div>
      <div className="bg-white px-3 md:px-7 py-3 md:py-5  relative rounded-tr-xl rounded-b-xl ">
        {/* Filter section */}
        <div className="mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-green-50/30 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Filter Lớp học */}
              <div className="flex-1 min-w-0">
                <CustomSelect
                  value={selectedClassId}
                  onChange={handleClassChange}
                  options={[
                    { value: "", label: "Tất cả lớp học" },
                    ...classrooms.map((classroom) => ({
                      value: classroom.class_id.toString(),
                      label: classroom.classname
                    }))
                  ]}
                  placeholder="Chọn lớp học"
                  icon={Users}
                  label="Lớp học"
                />
              </div>

              {/* Filter Unit */}
              <div className="flex-1 min-w-0">
                <CustomSelect
                  value={selectedUnitId}
                  onChange={handleUnitChange}
                  options={[
                    { value: "", label: "Tất cả đơn vị học" },
                    ...units.map((unit) => ({
                      value: unit.unitId.toString(),
                      label: unit.unitName
                    }))
                  ]}
                  placeholder="Chọn đơn vị học"
                  disabled={!selectedClassId}
                  loading={loadingUnits}
                  icon={BookOpen}
                  label="Đơn vị học"
                />
              </div>

              {/* Filter Tuần học */}
              <div className="flex-1 min-w-0">
                <CustomSelect
                  value={selectedWeekId}
                  onChange={handleWeekChange}
                  options={[
                    { value: "", label: "Tất cả tuần học" },
                    ...schoolWeeks.map((week) => ({
                      value: week.swId.toString(),
                      label: `Tuần ${week.value}`
                    }))
                  ]}
                  placeholder="Chọn tuần học"
                  disabled={!selectedUnitId}
                  loading={loadingWeeks}
                  icon={Calendar}
                  label="Tuần học"
                />
              </div>
            </div>

            {/* Filter status indicator */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-600 font-medium">
                  Bộ lọc đang áp dụng:
                </span>
                {selectedClassId && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    {
                      classrooms.find(
                        (c) => c.class_id.toString() === selectedClassId
                      )?.classname
                    }
                  </span>
                )}
                {selectedUnitId && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {
                      units.find((u) => u.unitId.toString() === selectedUnitId)
                        ?.unitName
                    }
                  </span>
                )}
                {selectedWeekId && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                    Tuần{" "}
                    {
                      schoolWeeks.find(
                        (w) => w.swId.toString() === selectedWeekId
                      )?.value
                    }
                  </span>
                )}
                {!selectedClassId && !selectedUnitId && !selectedWeekId && (
                  <span className="text-gray-500 italic">Hiển thị tất cả</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative images (hidden on mobile) */}
        <div className="hidden lg:flex gap-20 absolute -top-1 right-7 lg:right-[5%]">
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
        </div>

        <div className="relative pt-3">
          {filteredLessonData.length > 0 ? (
            <CourseCarousel
              courseData={filteredLessonData}
              onLikeUpdate={handleLikeUpdate}
              removingLessons={removingLessons}
              onLessonClick={handleNavigateToLesson}
            />
          ) : (
            <div className="flex justify-center items-center min-h-[200px] sm:min-h-[250px] md:min-h-[280px] h-full flex-col gap-4 sm:gap-8 md:gap-12">
              <p className="text-center text-base sm:text-lg md:text-2xl text-[#736E6E] font-medium px-2">
                Hiện tại chưa có bài học nào được yêu thích !
              </p>
              <OptimizeImage
                src="/assets/image/lesson/no_favourite_lesson.webp"
                alt="no-data"
                width={100}
                height={100}
                className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[130px] md:h-[130px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export { LectureFavouriteList };
