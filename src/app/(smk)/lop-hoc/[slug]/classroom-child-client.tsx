"use client";
import React from "react";
import { BreadcrumbLayout } from "@/components/admin-panel/breadcrumb-layout";
import ClassroomWrapper from "@/components/common/classroom-wrapper";
import { PaginatedContent } from "@/components/common/paginated-content";
import { formatSlug } from "@/lib/utils";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useAutoUnlockNextLesson } from "@/hooks/client/useLesson";
import { useSelectLessonStore } from "@/store/useSelectLesson";
import { useUnitsOrder } from "@/hooks/client/useUnitsOrder";
import { getSchoolWeekByUnitId } from "@/actions/schoolWeekAction";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchoolWeekType } from "@/types/schoolweek";

function ClassroomChildClient({
  slug,
  lessonData,
  classId
}: {
  slug: string;
  lessonData: LessonType[];
  classId: number;
}) {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    React.useState<string>("");
  const [selectedWeek, setSelectedWeek] = React.useState<string>("");
  const [selectedUnit, setSelectedUnit] = React.useState<string>("");
  const [schoolWeekData, setSchoolWeekData] = React.useState<SchoolWeekType[]>([]);

  // State để track lesson updates
  const [localLessonData, setLocalLessonData] =
    React.useState<LessonType[]>(lessonData);

  // State để track lessons đang being removed (khi unlike)
  const [removingLessons, setRemovingLessons] = React.useState<Set<number>>(
    new Set()
  );

  const router = useRouter();

  const { checkAndUnlockNextLesson } = useAutoUnlockNextLesson(localLessonData);
  const { setSelectedLesson } = useSelectLessonStore();

  // Use units order hook to get sorted lessons
  const {
    sortedLessons,
    units,
    isLoading: unitsLoading
  } = useUnitsOrder({
    classId,
    lessons: localLessonData
  });

  React.useEffect(() => {
    const fetchSchoolWeeks = async () => {
      if (selectedUnit && selectedUnit !== "all") {
        try {
          const data = await getSchoolWeekByUnitId({ unitId: parseInt(selectedUnit) });
          setSchoolWeekData(data || []);
        } catch (error) {
          console.error("Error fetching school weeks:", error);
          setSchoolWeekData([]);
        }
      } else {
        setSchoolWeekData([]);
        setSelectedWeek(""); 
      }
    };

    fetchSchoolWeeks();
  }, [selectedUnit]);

  const updateLessonLike = React.useCallback(
    (lessonId: number, newLikeCount: number) => {
      const sanitizedLikeCount = newLikeCount > 0 ? 1 : 0;

      if (sanitizedLikeCount === 0) {
        setRemovingLessons((prev) => new Set([...prev, lessonId]));

        setTimeout(() => {
          setRemovingLessons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(lessonId);
            return newSet;
          });
        }, 800);
      }

      setLocalLessonData((prevData) =>
        prevData.map((lesson) =>
          lesson.lessonId === lessonId
            ? { ...lesson, numLiked: sanitizedLikeCount }
            : lesson
        )
      );
    },
    []
  );

  React.useEffect(() => {
    setLocalLessonData(lessonData);
  }, [lessonData]);

  const formattedTitle = React.useMemo(() => {
    const formattedSlug = formatSlug(slug);
    return decodeURIComponent(formattedSlug)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [slug]);

  const handleLessonClick = React.useCallback(
    async (lessonId: number) => {
      const selectedLesson = localLessonData.find(
        (lesson) => lesson.lessonId === lessonId
      );

      if (selectedLesson) {
        setSelectedLesson(selectedLesson);
      }

      router.push(`/lesson/${lessonId}`);
    },
    [localLessonData, setSelectedLesson, router]
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const uniqueWeeks = React.useMemo(() => {
    if (!schoolWeekData || schoolWeekData.length === 0) {
      return [];
    }
    
    const weeks = schoolWeekData
      .map(sw => sw.value)
      .filter((week): week is number => week !== undefined && week !== null)
      .sort((a, b) => Number(a) - Number(b));
    return weeks;
  }, [schoolWeekData]);
  
  console.log("uniqueWeeks", uniqueWeeks)

  const uniqueUnits = React.useMemo(() => {
    return units.map((unit) => ({
      id: unit.unitId,
      name: unit.unitName
    }));
  }, [units]);

  console.log("uniqueUnits", uniqueUnits)

  const filteredLessons = React.useMemo(() => {
    if (unitsLoading || !units.length) {
      return [];
    }

    let filtered = sortedLessons;

    if (debouncedSearchQuery.trim()) {
      const normalizedQuery = debouncedSearchQuery
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/gi, '');
      
      filtered = filtered.filter(
        (lesson) => {
          const normalizedLessonName = lesson.lessonName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/gi, '');
          
          const normalizedUnitName = lesson.unitName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/gi, '');
          
          return normalizedLessonName.includes(normalizedQuery) ||
                 normalizedUnitName.includes(normalizedQuery);
        }
      );
    }

    if (selectedWeek && selectedUnit && selectedUnit !== "all") {
      filtered = filtered.filter(
        (lesson) =>
          lesson.schoolWeek && lesson.schoolWeek.toString() === selectedWeek
      );
    }

    if (selectedUnit) {
      filtered = filtered.filter(
        (lesson) => lesson.unitId.toString() === selectedUnit
      );
    }

    return filtered.filter((lesson) => !removingLessons.has(lesson.lessonId));
  }, [
    sortedLessons,
    debouncedSearchQuery,
    selectedWeek,
    selectedUnit,
    removingLessons,
    unitsLoading,
    units
  ]);

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const clearSearch = React.useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }, []);

  const handleWeekChange = React.useCallback((value: string) => {
    setSelectedWeek(value === "all" ? "" : value);
  }, []);

  const handleUnitChange = React.useCallback((value: string) => {
    setSelectedUnit(value === "all" ? "" : value);
  }, []);

  const resetFilters = React.useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedWeek("");
    setSelectedUnit("");
  }, []);

  const renderLessonItem = React.useCallback(
    (lessonItem: LessonType) => {
      const lessonItemData = {
        ...lessonItem,
        classRoomName: lessonItem.className,
        schoolWeek: lessonItem.schoolWeek || 1,
        schoolWeekId: lessonItem.schoolWeekId || 1
      };

      return (
        <LessonCard
          {...lessonItemData}
          onClick={() => handleLessonClick(lessonItem.lessonId)}
          onLikeUpdate={(lessonId, newLikeCount) =>
            updateLessonLike(lessonId, newLikeCount)
          }
          removingLessons={removingLessons}
        />
      );
    },
    [handleLessonClick, updateLessonLike, removingLessons]
  );



  return (
    <BreadcrumbLayout title={formattedTitle}>
      <ClassroomWrapper>
        <div className="px-0 lg:px-3 py-2 mb-4 transition-all duration-200 w-full lg:w-5/6">
          <div className="flex flex-col gap-2  flex-wrap">
            <div className="flex flex-col 2xl:flex-row gap-3 items-start 2xl:items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-full w-full  lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={(!selectedUnit || selectedUnit === "all") ? "Tìm kiếm bài học, tên unit, ..." : (() => {
                    const unitName = uniqueUnits.find(unit => unit.id.toString() === selectedUnit)?.name || selectedUnit;
                    const maxLength = 25;
                    return unitName.length > maxLength 
                      ? `Tìm kiếm bài học của ${unitName.substring(0, maxLength)}...`
                      : `Tìm kiếm bài học của ${unitName}`;
                  })()}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-10 h-9 bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-1/2">
                {/* Unit Filter - Moved first */}
                <div className="flex-1 sm:w-40">
                  <Select
                    onValueChange={handleUnitChange}
                    value={selectedUnit || "all"}
                  >
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Tất cả units</SelectItem>
                        {uniqueUnits.length > 0 && uniqueUnits.map((unit) => (
                          <SelectItem
                            key={`unit-${unit.id}`}
                            value={unit.id.toString()}
                          >
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Week Filter - Moved second and conditional */}
                <div className="flex-1 sm:w-40">
                  <Select
                    onValueChange={handleWeekChange}
                    value={(!selectedUnit || selectedUnit === "all") ? "" : (selectedWeek || "all")}
                    disabled={!selectedUnit || selectedUnit === "all"}
                  >
                    <SelectTrigger className={`w-full h-9 text-sm ${
                      !selectedUnit || selectedUnit === "all" 
                        ? "opacity-50 cursor-not-allowed" 
                        : ""
                    }`}>
                      <SelectValue placeholder={
                        !selectedUnit || selectedUnit === "all" 
                          ? "Vui lòng chọn unit" 
                          : "Tuần học"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                     <ScrollArea className="max-h-80 overflow-auto">
                       <SelectGroup>
                        {selectedUnit && selectedUnit !== "all" && (
                          <SelectItem value="all">Tất cả tuần</SelectItem>
                        )}
                        {uniqueWeeks.length > 0 && uniqueWeeks.map((week) => (
                          week && week.toString() ? (
                            <SelectItem
                              key={`week-${week}`}
                              value={week.toString()}
                            >
                              Tuần {week}
                            </SelectItem>
                          ) : null
                        ))}
                      </SelectGroup>
                     </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Đặt lại
                </button>
              </div>
            </div>

     
          </div>
        </div>

        {unitsLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : sortedLessons && sortedLessons.length > 0 ? (
          <PaginatedContent
            items={filteredLessons}
            itemsPerPage={8}
            renderItem={renderLessonItem}
            itemInPage={[8, 16, 24, 32, 40]}
            rowPerPage={4}
          />
        ) : (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Không có bài học nào</p>
          </div>
        )}
      </ClassroomWrapper>
    </BreadcrumbLayout>
  );
}

export default ClassroomChildClient;
