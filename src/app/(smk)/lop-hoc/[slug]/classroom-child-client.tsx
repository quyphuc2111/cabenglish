"use client";
import React from "react";
import { BreadcrumbLayout } from "@/components/admin-panel/breadcrumb-layout";
import ClassroomWrapper from "@/components/common/classroom-wrapper";
import { PaginatedContent } from "@/components/common/paginated-content";
import { formatSlug } from "@/lib/utils";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
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
import { useSelectLessonStore } from "@/store/useSelectLesson";
import { useUnitsOrder } from "@/hooks/client/useUnitsOrder";
import { getSchoolWeekByUnitId } from "@/actions/schoolWeekAction";
import { useClassroomLessons } from "@/hooks/useLessonData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchoolWeekType } from "@/types/schoolweek";
import { useSession } from "next-auth/react";
import { useNavigationStore } from "@/store/navigationStore";
import { useNavigationRestore } from "@/hooks/useNavigationRestore";

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
  const [schoolWeekData, setSchoolWeekData] = React.useState<SchoolWeekType[]>(
    []
  );

  // Pagination state to persist/restore
  const [pageState, setPageState] = React.useState<number>(() => {
    // Check if we're returning from lesson and have saved pagination state
    if (typeof window !== "undefined") {
      const isReturning = document.referrer.includes("/lesson/");
      if (isReturning) {
        try {
          const stored = localStorage.getItem("navigation-store");
          if (stored) {
            const parsed = JSON.parse(stored);
            const savedPage =
              parsed?.state?.previousPage?.state?.filters?.pagination
                ?.currentPage;
            if (
              savedPage &&
              parsed?.state?.previousPage?.url === `/lop-hoc/${slug}`
            ) {
              return savedPage;
            }
          }
        } catch (e) {
          console.warn("Failed to restore pagination state:", e);
        }
      }
    }
    return 1;
  });
  const [itemsPerPageState, setItemsPerPageState] = React.useState<number>(
    () => {
      // Check if we're returning from lesson and have saved pagination state
      if (typeof window !== "undefined") {
        const isReturning = document.referrer.includes("/lesson/");
        if (isReturning) {
          try {
            const stored = localStorage.getItem("navigation-store");
            if (stored) {
              const parsed = JSON.parse(stored);
              const savedItemsPerPage =
                parsed?.state?.previousPage?.state?.filters?.pagination
                  ?.itemsPerPage;
              if (
                savedItemsPerPage &&
                parsed?.state?.previousPage?.url === `/lop-hoc/${slug}`
              ) {
                return savedItemsPerPage;
              }
            }
          } catch (e) {
            console.warn("Failed to restore pagination state:", e);
          }
        }
      }
      return 6;
    }
  );
  const [paginationKey, setPaginationKey] = React.useState<number>(0);

  // State để track lessons đang being removed (khi unlike)
  const [removingLessons, setRemovingLessons] = React.useState<Set<number>>(
    new Set()
  );

  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { setPreviousPage } = useNavigationStore();
  const { isReturningFromLesson, previousPageInfo } = useNavigationRestore();

  // Decode classname từ slug
  const classname = React.useMemo(() => {
    return decodeURIComponent(slug);
  }, [slug]);

  // Sử dụng hook mới để quản lý lesson data
  const {
    lessons: currentLessons,
    isLoading: lessonsLoading,
    isFetching: lessonsFetching,
    error: lessonsError,
    invalidateLessons,
    updateLessonInCache,
    removeLessonFromCache
  } = useClassroomLessons(classname);

  // Sử dụng currentLessons từ hook, fallback to lessonData chỉ khi loading
  const localLessonData = React.useMemo(() => {
    if (lessonsLoading && currentLessons.length === 0) {
      return lessonData;
    }
    return currentLessons;
  }, [currentLessons, lessonData, lessonsLoading]);

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
          const data = await getSchoolWeekByUnitId({
            unitId: parseInt(selectedUnit)
          });
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

    // Debounce API call để tránh gọi liên tục
    const timeoutId = setTimeout(() => {
      fetchSchoolWeeks();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedUnit]);

  // Restore filters, pagination and scroll when returning from lesson
  React.useEffect(() => {
    if (!isReturningFromLesson || !previousPageInfo) return;
    // Ensure we only restore when coming back to the same classroom page and slug
    if (previousPageInfo.url !== `/lop-hoc/${slug}`) return;

    console.log("🔄 Restoring classroom state:", {
      url: previousPageInfo.url,
      filters: previousPageInfo.state?.filters,
      pagination: previousPageInfo.state?.filters?.pagination
    });

    const filters = previousPageInfo.state?.filters || {};
    setSearchQuery(filters.searchQuery || "");
    setDebouncedSearchQuery(filters.searchQuery || "");
    setSelectedUnit(filters.selectedUnit || "");
    setSelectedWeek(filters.selectedWeek || "");

    const pagination = filters.pagination || {};
    setItemsPerPageState(pagination.itemsPerPage || 6);
    setPageState(pagination.currentPage || 1);

    // Force re-render of PaginatedContent to ensure pagination state is applied
    setPaginationKey((prev) => prev + 1);

    console.log("✅ Restored pagination state:", {
      currentPage: pagination.currentPage || 1,
      itemsPerPage: pagination.itemsPerPage || 6
    });

    // Restore scroll slightly after paint
    const t = setTimeout(() => {
      window.scrollTo(0, previousPageInfo.state?.scrollPosition || 0);
    }, 100);
    return () => clearTimeout(t);
  }, [isReturningFromLesson, previousPageInfo, slug]);

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
          // Remove from cache after animation
          removeLessonFromCache(lessonId);
        }, 800);
      } else {
        // Update lesson in cache
        updateLessonInCache(lessonId, { numLiked: sanitizedLikeCount });
      }
    },
    [updateLessonInCache, removeLessonFromCache]
  );

  // Effect để invalidate cache khi navigate về trang classroom - optimized
  React.useEffect(() => {
    // Chỉ invalidate khi thực sự cần thiết
    if (pathname.includes("/lop-hoc/") && session?.user?.userId && classname) {
      // Debounce để tránh gọi liên tục với delay lớn hơn cho mobile
      const timeoutId = setTimeout(() => {
        invalidateLessons();
      }, 1500); // Tăng delay lên 1.5s để giảm tần suất gọi API

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, session?.user?.userId, classname]); // Loại bỏ invalidateLessons khỏi dependency

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

      // Save previous page state (URL, filters, scroll) before navigating
      setPreviousPage({
        url: `/lop-hoc/${slug}`,
        title: `Lớp học ${classname}`,
        state: {
          scrollPosition: typeof window !== "undefined" ? window.scrollY : 0,
          filters: {
            searchQuery,
            selectedUnit,
            selectedWeek,
            pagination: {
              currentPage: pageState,
              itemsPerPage: itemsPerPageState
            }
          }
        }
      });

      router.push(`/lesson/${lessonId}`);
    },
    [
      localLessonData,
      setSelectedLesson,
      router,
      setPreviousPage,
      slug,
      classname,
      searchQuery,
      selectedUnit,
      selectedWeek,
      pageState,
      itemsPerPageState
    ]
  );

  // Debounced search với delay lớn hơn cho mobile
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 800); // Tăng delay lên 800ms để giảm tần suất filter

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const uniqueWeeks = React.useMemo(() => {
    if (!schoolWeekData || schoolWeekData.length === 0) {
      return [];
    }

    const weeks = schoolWeekData
      .map((sw) => sw.value)
      .filter((week): week is number => week !== undefined && week !== null)
      .sort((a, b) => Number(a) - Number(b));
    return weeks;
  }, [schoolWeekData]);

  const uniqueUnits = React.useMemo(() => {
    return units.map((unit) => ({
      id: unit.unitId,
      name: unit.unitName
    }));
  }, [units]);

  // Tối ưu hóa filteredLessons với early returns và less computation
  const filteredLessons = React.useMemo(() => {
    if (unitsLoading || !units.length) {
      return [];
    }

    let filtered = sortedLessons;

    // Early return nếu không có lessons
    if (!filtered || filtered.length === 0) {
      return [];
    }

    // Unit filter trước (ít tốn kém hơn)
    if (selectedUnit && selectedUnit !== "all") {
      filtered = filtered.filter(
        (lesson) => lesson.unitId.toString() === selectedUnit
      );
    }

    // Week filter
    if (selectedWeek && selectedUnit && selectedUnit !== "all") {
      filtered = filtered.filter(
        (lesson) =>
          lesson.schoolWeek && lesson.schoolWeek.toString() === selectedWeek
      );
    }

    // Search filter cuối cùng (tốn kém nhất)
    if (debouncedSearchQuery.trim()) {
      const normalizedQuery = debouncedSearchQuery
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/gi, "");

      filtered = filtered.filter((lesson) => {
        const normalizedLessonName = lesson.lessonName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s]/gi, "");

        const normalizedUnitName = lesson.unitName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s]/gi, "");

        return (
          normalizedLessonName.includes(normalizedQuery) ||
          normalizedUnitName.includes(normalizedQuery)
        );
      });
    }

    // Remove lessons đang được removed
    return filtered.filter((lesson) => !removingLessons.has(lesson.lessonId));
  }, [
    sortedLessons,
    debouncedSearchQuery,
    selectedWeek,
    selectedUnit,
    removingLessons,
    unitsLoading,
    units.length // Chỉ theo dõi length thay vì toàn bộ units object
  ]);

  // Throttle search input để giảm re-render
  const handleSearchChange = React.useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Throttle để giảm update frequency
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          // Additional throttling nếu cần
        }, 100);
      };
    }, []),
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
                  placeholder={React.useMemo(
                    () =>
                      !selectedUnit || selectedUnit === "all"
                        ? "Tìm kiếm bài học, tên unit, ..."
                        : (() => {
                            const unitName =
                              uniqueUnits.find(
                                (unit) => unit.id.toString() === selectedUnit
                              )?.name || selectedUnit;
                            const maxLength = 25;
                            return unitName.length > maxLength
                              ? `Tìm kiếm bài học của ${unitName.substring(
                                  0,
                                  maxLength
                                )}...`
                              : `Tìm kiếm bài học của ${unitName}`;
                          })(),
                    [selectedUnit, uniqueUnits]
                  )}
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
                        {uniqueUnits.length > 0 &&
                          uniqueUnits.map((unit) => (
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
                    value={
                      !selectedUnit || selectedUnit === "all"
                        ? ""
                        : selectedWeek || "all"
                    }
                    disabled={!selectedUnit || selectedUnit === "all"}
                  >
                    <SelectTrigger
                      className={`w-full h-9 text-sm ${
                        !selectedUnit || selectedUnit === "all"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <SelectValue
                        placeholder={
                          !selectedUnit || selectedUnit === "all"
                            ? "Vui lòng chọn unit"
                            : "Tuần học"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="max-h-80 overflow-auto">
                        <SelectGroup>
                          {selectedUnit && selectedUnit !== "all" && (
                            <SelectItem value="all">Tất cả tuần</SelectItem>
                          )}
                          {uniqueWeeks.length > 0 &&
                            uniqueWeeks.map((week) =>
                              week && week.toString() ? (
                                <SelectItem
                                  key={`week-${week}`}
                                  value={week.toString()}
                                >
                                  Tuần {week}
                                </SelectItem>
                              ) : null
                            )}
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

        {lessonsError ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-red-500">
              Có lỗi khi tải dữ liệu. Vui lòng thử lại.
            </p>
          </div>
        ) : unitsLoading || lessonsLoading ? (
          <div className="flex justify-center items-center py-8">
            {/* <p className="text-gray-500">Đang tải dữ liệu...</p> */}
            {lessonsFetching && (
              <span className="ml-2 text-sm text-blue-500">
                Đang tải dữ liệu...
              </span>
            )}
          </div>
        ) : sortedLessons && sortedLessons.length > 0 ? (
          <PaginatedContent
            key={`pagination-${paginationKey}`}
            items={filteredLessons}
            itemsPerPage={itemsPerPageState}
            initialPage={pageState}
            onPageChange={(p) => setPageState(p)}
            onItemsPerPageChange={(count) => setItemsPerPageState(count)}
            renderItem={renderLessonItem}
            itemInPage={[6, 12, 18, 24]}
            rowPerPage={3}
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

export default React.memo(ClassroomChildClient);
