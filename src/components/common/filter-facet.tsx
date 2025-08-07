"use client";

import React, {
  useState,
  useTransition,
  useEffect,
  memo,
  useCallback,
  useMemo
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Loading } from "@/components/common/loading";
import { useSession } from "next-auth/react";
import { ScrollArea } from "../ui/scroll-area";

interface Classroom {
  id: string;
  class_id: string;
  classname: string;
}

interface Unit {
  unitId: string;
  unitName: string;
}

interface SchoolWeek {
  swId: string;
  value: number;
}

interface FilterData {
  classrooms: Classroom[];
  units: Unit[];
  schoolWeeks: SchoolWeek[];
}

interface FilterValues {
  classId: string;
  unitId: string;
  userId: string;
  weekId: string;
}

interface FilterFacetProps {
  initialFilterData: FilterData;
  fetchFilterData: (filters: Partial<FilterValues>) => Promise<FilterData>;
  onFilterChange: (filterValues: FilterValues) => void;
}

// Memoized empty state components
const EmptyUnitsState = memo(() => (
  <div className="flex flex-col items-center justify-center gap-2 py-3 px-3">
    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center">
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <div className="text-center">
      <p className="text-gray-600 font-medium text-xs sm:text-sm">
        Chưa có unit
      </p>
      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
        Trong lớp học này
      </p>
    </div>
  </div>
));

EmptyUnitsState.displayName = "EmptyUnitsState";

const EmptyWeeksState = memo(() => (
  <div className="flex flex-col items-center justify-center gap-2 py-3 px-3">
    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center">
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
    <div className="text-center">
      <p className="text-gray-600 font-medium text-xs sm:text-sm">
        Chưa có tuần học
      </p>
      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
        Trong unit này
      </p>
    </div>
  </div>
));

EmptyWeeksState.displayName = "EmptyWeeksState";

function FilterFacet({
  initialFilterData,
  fetchFilterData,
  onFilterChange
}: FilterFacetProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [filterData, setFilterData] = useState<FilterData>(initialFilterData);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag để track initial load

  // Ref để track previous filter values và tránh duplicate API calls
  const prevFiltersRef = React.useRef<FilterValues>({
    classId: "",
    unitId: "",
    userId: "",
    weekId: ""
  });

  // Ref để track API call đang pending
  const apiCallInProgress = React.useRef(false);

  // URL synchronization
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize filters from URL params - memoized
  const [filters, setFilters] = useState<FilterValues>(() => ({
    classId: searchParams.get("classId") || "",
    unitId: searchParams.get("unitId") || "",
    userId: session?.user?.userId || "",
    weekId: searchParams.get("weekId") || ""
  }));

  // Memoized current selections để tránh tìm kiếm không cần thiết
  const currentSelections = useMemo(() => {
    const currentClass = filterData.classrooms?.find(
      (c) => String(c.class_id) === String(filters.classId)
    );
    const currentUnit = filterData.units?.find(
      (u) => String(u.unitId) === String(filters.unitId)
    );
    const currentWeek = filterData.schoolWeeks?.find(
      (w) => String(w.swId) === String(filters.weekId)
    );

    return { currentClass, currentUnit, currentWeek };
  }, [filterData, filters]);

  // Set isDataLoaded to true if no URL params
  useEffect(() => {
    const hasUrlParams =
      searchParams.get("classId") ||
      searchParams.get("unitId") ||
      searchParams.get("weekId");

    if (!hasUrlParams && session?.user?.userId) {
      setIsDataLoaded(true);
    }
  }, [searchParams, session?.user?.userId]);

  // 🚀 Initial load: Apply URL params filter một lần duy nhất
  useEffect(() => {
    const hasUrlParams =
      searchParams.get("classId") ||
      searchParams.get("unitId") ||
      searchParams.get("weekId");

    if (
      hasUrlParams &&
      session?.user?.userId &&
      isDataLoaded &&
      isInitialLoad
    ) {
      const initialFilters = {
        classId: searchParams.get("classId") || "",
        unitId: searchParams.get("unitId") || "",
        userId: session.user.userId || "",
        weekId: searchParams.get("weekId") || ""
      };

      // Chỉ gọi onFilterChange một lần khi initial load
      console.log("🎯 Initial URL params filter applied:", initialFilters);
      onFilterChange(initialFilters);
      setIsInitialLoad(false); // Đánh dấu đã xong initial load
    } else if (!hasUrlParams && session?.user?.userId) {
      // Không có URL params, set flag ngay
      setIsInitialLoad(false);
    }
  }, [
    session?.user?.userId,
    isDataLoaded,
    isInitialLoad,
    searchParams,
    onFilterChange
  ]); // Thêm dependencies cần thiết

  // Update filters when URL params change - KHÔNG gọi API
  useEffect(() => {
    const newFilters = {
      classId: searchParams.get("classId") || "",
      unitId: searchParams.get("unitId") || "",
      userId: session?.user?.userId || "",
      weekId: searchParams.get("weekId") || ""
    };

    // Chỉ cập nhật nếu filters thực sự thay đổi (so với prevFiltersRef)
    const hasChanged =
      newFilters.classId !== prevFiltersRef.current.classId ||
      newFilters.unitId !== prevFiltersRef.current.unitId ||
      newFilters.weekId !== prevFiltersRef.current.weekId ||
      newFilters.userId !== prevFiltersRef.current.userId;

    if (hasChanged) {
      console.log("🔄 URL params changed, updating filters:", newFilters);
      console.log("🔍 Previous URL filters:", prevFiltersRef.current);
      setFilters(newFilters);
      // ❌ KHÔNG gọi API từ đây, để API effect xử lý
    }
  }, [searchParams, session?.user?.userId]); // Loại bỏ isInitialLoad để tránh conflict

  // Khởi tạo filters khi session có userId (chỉ chạy 1 lần)
  useEffect(() => {
    if (session?.user?.userId && !filters.userId) {
      setFilters((prev) => ({
        ...prev,
        userId: session.user.userId || ""
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.userId]);

  // Set isDataLoaded khi có data
  useEffect(() => {
    if (filterData.classrooms && filterData.classrooms.length > 0) {
      setIsDataLoaded(true);
    }
  }, [filterData.classrooms]);

  // UNIFIED API calls effect - xử lý cả URL params và user interactions
  useEffect(() => {
    const shouldFetchData =
      filters.userId && (filters.classId || filters.unitId) && isDataLoaded;

    // Kiểm tra xem có thay đổi thực sự không
    const hasRealChange =
      filters.classId !== prevFiltersRef.current.classId ||
      filters.unitId !== prevFiltersRef.current.unitId ||
      filters.userId !== prevFiltersRef.current.userId;

    if (shouldFetchData && hasRealChange && !apiCallInProgress.current) {
      console.log("🌐 [UNIFIED] API call triggered for filters:", filters);
      console.log("🌐 Previous filters:", prevFiltersRef.current);
      console.log("🌐 isInitialLoad:", isInitialLoad);

      // Đánh dấu API call đang chạy
      apiCallInProgress.current = true;

      // Update previous filters
      prevFiltersRef.current = { ...filters };

      const timeoutId = setTimeout(() => {
        startTransition(async () => {
          try {
            const newData = await fetchFilterData(filters);
            setFilterData(newData);

            // Đánh dấu đã load xong nếu là initial load
            if (isInitialLoad) {
              setIsDataLoaded(true);
            }
          } catch (error) {
            console.error("Error fetching filter data:", error);
          } finally {
            // Reset flag khi API call xong
            apiCallInProgress.current = false;
          }
        });
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        apiCallInProgress.current = false;
      };
    }
  }, [
    filters.classId,
    filters.unitId,
    filters.userId,
    isDataLoaded,
    isInitialLoad
  ]);

  // Update URL when filters change - với requestIdleCallback để tối ưu hiệu năng
  const updateURL = useCallback(
    (newFilters: FilterValues) => {
      const updateUrlInBackground = () => {
        const params = new URLSearchParams();
        const filterKeys: (keyof FilterValues)[] = [
          "classId",
          "unitId",
          "weekId"
        ];

        filterKeys.forEach((key) => {
          // Chỉ thêm param khi có giá trị và không rỗng
          if (newFilters[key] && String(newFilters[key]).trim() !== "") {
            params.set(key, String(newFilters[key]));
          }
        });

        // Tạo URL mới hoàn toàn
        const newUrl = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;

        // Sử dụng window.history để đảm bảo URL được cập nhật
        window.history.replaceState(null, "", newUrl);
      };

      // Sử dụng requestIdleCallback nếu có sẵn, otherwise fallback to setTimeout
      if ("requestIdleCallback" in window) {
        requestIdleCallback(updateUrlInBackground);
      } else {
        setTimeout(updateUrlInBackground, 0);
      }
    },
    [pathname]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<FilterValues>) => {
      const updatedFilters = {
        ...filters,
        ...newFilters
      };

      console.log(
        "🔧 UpdateFilters called:",
        newFilters,
        "isInitialLoad:",
        isInitialLoad
      );

      // Set state và update URL ngay lập tức
      setFilters(updatedFilters);
      updateURL(updatedFilters);

      // 🚀 Chỉ gọi onFilterChange khi user thực sự thay đổi filter (không phải initial load)
      if (!isInitialLoad) {
        console.log("✅ Calling onFilterChange from updateFilters");
        onFilterChange(updatedFilters);
      } else {
        console.log("⏳ Skipping onFilterChange - still in initial load");
      }

      // Simplified API logic - chỉ update local state nếu cần
      if (updatedFilters.userId) {
        // Nếu reset classId → clear units và schoolWeeks
        if (newFilters.hasOwnProperty("classId") && newFilters.classId === "") {
          setFilterData((prev) => ({
            ...prev,
            units: [],
            schoolWeeks: []
          }));
        }
        // Nếu reset unitId → clear schoolWeeks
        else if (
          newFilters.hasOwnProperty("unitId") &&
          newFilters.unitId === ""
        ) {
          setFilterData((prev) => ({
            ...prev,
            schoolWeeks: []
          }));
        }
        // Các trường hợp khác để useEffect xử lý
      }
    },
    [filters, updateURL, isInitialLoad] // Loại bỏ onFilterChange để tránh re-create
  );

  const handleClassChange = useCallback(
    (value: string) => {
      if (value === "reset") {
        updateFilters({
          classId: "",
          unitId: "",
          weekId: ""
        });
        return;
      }
      updateFilters({
        classId: value,
        unitId: "",
        weekId: ""
      });
    },
    [updateFilters]
  );

  const handleUnitChange = useCallback(
    (value: string) => {
      if (value === "reset") {
        updateFilters({
          unitId: "",
          weekId: ""
        });
        return;
      }
      updateFilters({
        unitId: value,
        weekId: ""
      });
    },
    [updateFilters]
  );

  const handleWeekChange = useCallback(
    (value: string) => {
      if (value === "reset") {
        updateFilters({ weekId: "" });
        return;
      }
      updateFilters({ weekId: value });
    },
    [updateFilters]
  );

  // Kiểm tra xem có unit nào không - memoized
  const hasUnits = useMemo(
    () => filterData.units && filterData.units.length > 0,
    [filterData.units]
  );

  // Kiểm tra xem có tuần học nào không - memoized
  const hasSchoolWeeks = useMemo(
    () => filterData.schoolWeeks && filterData.schoolWeeks.length > 0,
    [filterData.schoolWeeks]
  );

  return (
    <div className="flex flex-wrap flex-row gap-2 sm:gap-3 md:gap-4 w-full justify-between md:justify-start">
      {/* {isPending && <Loading />} */}

      <div className="w-[48%] sm:w-[30%] md:w-1/5">
        <Select onValueChange={handleClassChange} value={filters.classId}>
          <SelectTrigger className="w-full h-8 sm:h-9 px-2 sm:px-3 text-ellipsis overflow-hidden whitespace-nowrap text-xs sm:text-sm">
            <SelectValue
              placeholder="Chọn lớp học"
              className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[90%]"
            />
          </SelectTrigger>
          <SelectContent
            className="max-h-[250px] sm:max-h-[300px]"
            align="start"
          >
            <ScrollArea className="max-h-[250px] sm:max-h-[300px] overflow-auto">
              <SelectGroup>
                {filters.classId && (
                  <SelectItem
                    value="reset"
                    className="text-red-500 hover:text-red-700 truncate text-xs sm:text-sm"
                  >
                    ↺ Reset lớp học
                  </SelectItem>
                )}
                {filterData.classrooms?.map((classroom) =>
                  classroom.class_id ? (
                    <SelectItem
                      key={classroom.class_id}
                      value={classroom.class_id}
                      className="text-ellipsis overflow-hidden whitespace-nowrap py-1.5 text-xs sm:text-sm"
                    >
                      {classroom.classname ?? "Không có tên"}
                    </SelectItem>
                  ) : null
                )}
              </SelectGroup>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[48%] sm:w-[30%] md:w-1/5">
        <Select
          onValueChange={handleUnitChange}
          value={filters.unitId}
          disabled={!filters.classId || !isDataLoaded}
        >
          <SelectTrigger className="w-full h-8 sm:h-9 px-2 sm:px-3 text-ellipsis overflow-hidden whitespace-nowrap text-xs sm:text-sm">
            <SelectValue
              placeholder="Chọn unit"
              className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[90%]"
            >
              {isDataLoaded && currentSelections.currentUnit
                ? currentSelections.currentUnit.unitName
                : ""}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            className="max-h-[250px] sm:max-h-[300px]"
            align="start"
          >
            <ScrollArea className="max-h-[250px] sm:max-h-[300px] overflow-auto">
              <SelectGroup>
                {filters.unitId && (
                  <SelectItem
                    value="reset"
                    className="text-red-500 hover:text-red-700 truncate text-xs sm:text-sm"
                  >
                    ↺ Reset unit
                  </SelectItem>
                )}
                {hasUnits ? (
                  filterData.units?.map((unit) =>
                    unit.unitId ? (
                      <SelectItem
                        key={unit.unitId}
                        value={unit.unitId}
                        className="text-ellipsis overflow-hidden whitespace-nowrap py-1.5 text-xs sm:text-sm"
                      >
                        {unit.unitName ?? "Không có unit"}
                      </SelectItem>
                    ) : null
                  )
                ) : (
                  <EmptyUnitsState />
                )}
              </SelectGroup>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-[30%] md:w-1/5">
        <Select
          onValueChange={handleWeekChange}
          value={filters.weekId}
          disabled={!filters.unitId || !isDataLoaded}
        >
          <SelectTrigger className="w-full h-8 sm:h-9 px-2 sm:px-3 text-ellipsis overflow-hidden whitespace-nowrap text-xs sm:text-sm">
            <SelectValue
              placeholder="Chọn tuần học"
              className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[90%]"
            >
              {isDataLoaded && currentSelections.currentWeek
                ? `Tuần học ${currentSelections.currentWeek.value}`
                : ""}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            className="max-h-[250px] sm:max-h-[300px]"
            align="start"
          >
            <ScrollArea className="max-h-[250px] sm:max-h-[300px] overflow-auto">
              <SelectGroup>
                {filters.weekId && (
                  <SelectItem
                    value="reset"
                    className="text-red-500 hover:text-red-700 truncate text-xs sm:text-sm"
                  >
                    ↺ Reset tuần học
                  </SelectItem>
                )}
                {hasSchoolWeeks ? (
                  filterData.schoolWeeks?.map((week) =>
                    week.swId ? (
                      <SelectItem
                        key={week.swId}
                        value={week.swId}
                        className="text-ellipsis overflow-hidden whitespace-nowrap py-1.5 text-xs sm:text-sm"
                      >
                        {week.value
                          ? `Tuần học ${week.value}`
                          : "Không có tuần học"}
                      </SelectItem>
                    ) : null
                  )
                ) : (
                  <EmptyWeeksState />
                )}
              </SelectGroup>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default memo(FilterFacet);
