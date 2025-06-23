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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useAutoUnlockNextLesson } from "@/hooks/client/useLesson";

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
  
  const formattedSlug = formatSlug(slug);
  const router = useRouter();

  // Sử dụng hook để tự động mở khóa bài học tiếp theo
  const { checkAndUnlockNextLesson } = useAutoUnlockNextLesson(lessonData);

  const formatTitle = (slug: string) => {
    return decodeURIComponent(slug)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLessonClick = async (lessonId: number) => {
    router.push(`/lesson/${lessonId}`);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const uniqueWeeks = React.useMemo(() => {
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
      .sort((a, b) => Number(a.id) - Number(b.id));
  }, [lessonData]);

  const filterLessons = React.useCallback(() => {
    let filtered = lessonData;

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

    setFilteredLessons(filtered);
  }, [lessonData, debouncedSearchQuery, selectedWeek, selectedUnit]);

  React.useEffect(() => {
    filterLessons();
  }, [debouncedSearchQuery, selectedWeek, selectedUnit, lessonData]);

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

console.log("123321_lessonData", lessonData)

  return (
    <BreadcrumbLayout title={formatTitle(formattedSlug)}>
      <ClassroomWrapper>
        <div className="px-3 py-2 mb-4 transition-all duration-200 w-1/2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
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
              <div className="flex gap-2 w-full sm:w-auto">
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
            <div className="text-xs text-gray-500 text-center sm:text-left">
              {filteredLessons.length}/{lessonData.length} bài học
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
              schoolWeek: lessonItem.schoolWeekId || 1,
              schoolWeekId: lessonItem.schoolWeekId || 1
            };

            return (
              <LessonCard
                {...lessonItemData}
                onClick={() => handleLessonClick(lessonItem.lessonId)}
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
