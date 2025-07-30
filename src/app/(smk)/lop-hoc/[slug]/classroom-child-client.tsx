"use client";
import React from "react";
import { BreadcrumbLayout } from "@/components/admin-panel/breadcrumb-layout";
import ClassroomWrapper from "@/components/common/classroom-wrapper";
import { PaginatedContent } from "@/components/common/paginated-content";
import { formatSlug, getSwValueById } from "@/lib/utils";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useAutoUnlockNextLesson } from "@/hooks/client/useLesson";
import { useSelectLessonStore } from "@/store/useSelectLesson";

function ClassroomChildClient({
  slug,
  lessonData,
}: {
  slug: string;
  lessonData: LessonType[];
}) {
  const [filteredLessons, setFilteredLessons] = React.useState<LessonType[]>(lessonData);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState<string>("");
  const [selectedWeek, setSelectedWeek] = React.useState<string>("");
  const [selectedUnit, setSelectedUnit] = React.useState<string>("");
  
  // State để track lesson updates
  const [localLessonData, setLocalLessonData] = React.useState<LessonType[]>(lessonData);
  
  // State để track lessons đang being removed (khi unlike)
  const [removingLessons, setRemovingLessons] = React.useState<Set<number>>(new Set());
  
  const formattedSlug = formatSlug(slug);
  const router = useRouter();

  const { checkAndUnlockNextLesson } = useAutoUnlockNextLesson(localLessonData);
  const { setSelectedLesson } = useSelectLessonStore();

  const {data: schoolWeekData} = useSchoolWeek()

  // Cập nhật callback để nhận đúng params: lessonId và newLikeCount (0 hoặc 1)
  const updateLessonLike = React.useCallback((lessonId: number, newLikeCount: number) => {
    // Ensure like count is only 0 or 1
    const sanitizedLikeCount = newLikeCount > 0 ? 1 : 0;
    
    // If unliking (newLikeCount = 0), add to removing set for fadeout animation
    if (sanitizedLikeCount === 0) {
      setRemovingLessons(prev => new Set([...prev, lessonId]));
      
      // Remove from removing set after animation completes
      setTimeout(() => {
        setRemovingLessons(prev => {
          const newSet = new Set(prev);
          newSet.delete(lessonId);
          return newSet;
        });
      }, 800); // Match animation duration
    }
    
    // Update local lesson data
    setLocalLessonData(prevData => 
      prevData.map(lesson => 
        lesson.lessonId === lessonId 
          ? { ...lesson, numLiked: sanitizedLikeCount }
          : lesson
      )
    );
  }, []);

  // Update local data khi props thay đổi
  React.useEffect(() => {
    setLocalLessonData(lessonData);
  }, [lessonData]);

  const formatTitle = (slug: string) => {
    return decodeURIComponent(slug)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLessonClick = async (lessonId: number) => {
    // Tìm lesson data từ localLessonData
    const selectedLesson = localLessonData.find(lesson => lesson.lessonId === lessonId);
    
    if (selectedLesson) {
      // Lưu lesson vào store
      setSelectedLesson(selectedLesson);
    }
    
    router.push(`/lesson/${lessonId}`);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const uniqueWeeks = React.useMemo(() => {
     const schoolWeekValue = getSwValueById(schoolWeekData?.data, 'label', 'value', lesson.schoolWeekId);
    const weeks = Array.from(new Set(lessonData.map(lesson => lesson.schoolWeekId)))
      .filter((week): week is number => week !== undefined && week !== null)
      .sort((a, b) => Number(a) - Number(b));
    return weeks;
  }, [lessonData]);

  const uniqueUnits = React.useMemo(() => {
    const unitMap = new Map();
    lessonData.forEach(lesson => {
      if (lesson.unitId && lesson.unitName) {
        unitMap.set(lesson.unitId, lesson.unitName);
      }
    });
    return Array.from(unitMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.order - b.order);
  }, [lessonData]);

  const filterLessons = React.useCallback(() => {
    let filtered = localLessonData;

    if (debouncedSearchQuery.trim()) {
      filtered = filtered.filter(lesson =>
        lesson.lessonName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        lesson.unitName.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    if (selectedWeek) {
      filtered = filtered.filter(lesson => 
        lesson.schoolWeekId && lesson.schoolWeekId.toString() === selectedWeek
      );
    }

    if (selectedUnit) {
      filtered = filtered.filter(lesson => 
        lesson.unitId.toString() === selectedUnit
      );
    }

    filtered = filtered.filter(lesson => !removingLessons.has(lesson.lessonId));
    filtered = filtered.sort((a, b) => a.lessonOrder - b.lessonOrder);  

    setFilteredLessons(filtered);
  }, [localLessonData, debouncedSearchQuery, selectedWeek, selectedUnit, removingLessons]);

  React.useEffect(() => {
    filterLessons();
  }, [debouncedSearchQuery, selectedWeek, selectedUnit, localLessonData, removingLessons]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleWeekChange = (value: string) => {
    setSelectedWeek(value === "all" ? "" : value);
  };

  const handleUnitChange = (value: string) => {
    setSelectedUnit(value === "all" ? "" : value);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedWeek("");
    setSelectedUnit("");
  };

  return (
    <BreadcrumbLayout title={formatTitle(formattedSlug)}>
      <ClassroomWrapper>
        <div className="px-3 py-2 mb-4 transition-all duration-200 w-5/6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm bài học..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 h-9 bg-white"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex gap-2 w-1/2">
                {/* Week Filter */}
                <div className="flex-1 sm:w-40">
                  <Select onValueChange={handleWeekChange} value={selectedWeek || "all"}>
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue placeholder="Tuần học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Tất cả tuần</SelectItem>
                        {uniqueWeeks.map((week) => (
                          <SelectItem key={`week-${week}`} value={week.toString()}>
                            Tuần {week}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Unit Filter */}
                <div className="flex-1 sm:w-40">
                  <Select onValueChange={handleUnitChange} value={selectedUnit || "all"}>
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Tất cả units</SelectItem>
                        {uniqueUnits.map((unit) => (
                          <SelectItem key={`unit-${unit.id}`} value={unit.id.toString()}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
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

            {/* Results Count - Compact */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="text-center sm:text-left">
                {filteredLessons.length}/{localLessonData.length} bài học
              </span>
              
              {/* Removing indicator */}
              {removingLessons.size > 0 && (
                <span className="text-orange-500 animate-pulse">
                  Đang cập nhật {removingLessons.size} bài học...
                </span>
              )}
            </div>
          </div>
        </div>

        <PaginatedContent
          items={filteredLessons}
          itemsPerPage={8}
          renderItem={(lessonItem) => {
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
                onLikeUpdate={(lessonId, newLikeCount) => updateLessonLike(lessonId, newLikeCount)}
                removingLessons={removingLessons}
              />
            );
          }}
          itemInPage={[8, 16, 24, 32, 40]}
          rowPerPage={4}
        />
      </ClassroomWrapper>
    </BreadcrumbLayout>
  );
}

export default ClassroomChildClient;
