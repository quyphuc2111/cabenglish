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

  // Update filters when URL params change - với debouncing
  useEffect(() => {
    const newFilters = {
      classId: searchParams.get("classId") || "",
      unitId: searchParams.get("unitId") || "",
      userId: session?.user?.userId || "",
      weekId: searchParams.get("weekId") || ""
    };

    // Chỉ cập nhật nếu filters thực sự thay đổi
    const hasChanged =
      newFilters.classId !== filters.classId ||
      newFilters.unitId !== filters.unitId ||
      newFilters.weekId !== filters.weekId ||
      newFilters.userId !== filters.userId;

    if (hasChanged) {
      setFilters(newFilters);
    }

    // Nếu có URL params và có userId, fetch data với debouncing
    const hasUrlParams =
      searchParams.get("classId") ||
      searchParams.get("unitId") ||
      searchParams.get("weekId");

    if (hasUrlParams && session?.user?.userId && hasChanged) {
      // Debounce API call
      const timeoutId = setTimeout(() => {
        startTransition(async () => {
          try {
            const newData = await fetchFilterData(newFilters);
            setFilterData(newData);
            setIsDataLoaded(true);
          } catch (error) {
            console.error("Error fetching filter data from URL params:", error);
          }
        });
      }, 150); // 150ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, session?.user?.userId, fetchFilterData, filters]);

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

  // Fetch filterData khi filters thay đổi (chỉ khi không phải từ URL params) - với debouncing
  useEffect(() => {
    // Chỉ fetch khi có userId và có filter nào đó được set
    if (
      filters.userId &&
      (filters.classId || filters.unitId || filters.weekId) &&
      isDataLoaded // Chỉ fetch khi đã load data ban đầu
    ) {
      // Kiểm tra xem có phải từ URL params không
      const currentUrlClassId = searchParams.get("classId");
      const currentUrlUnitId = searchParams.get("unitId");
      const currentUrlWeekId = searchParams.get("weekId");

      // Chỉ fetch nếu không phải từ URL params
      if (
        filters.classId !== currentUrlClassId ||
        filters.unitId !== currentUrlUnitId ||
        filters.weekId !== currentUrlWeekId
      ) {
        // Debounce API call
        const timeoutId = setTimeout(() => {
          startTransition(async () => {
            try {
              const newData = await fetchFilterData(filters);
              setFilterData(newData);
            } catch (error) {
              console.error("Error fetching filter data:", error);
            }
          });
        }, 200); // 200ms debounce cho user-initiated changes

        return () => clearTimeout(timeoutId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, fetchFilterData, isDataLoaded, searchParams]);

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

      // Set state và update URL ngay lập tức
      setFilters(updatedFilters);
      updateURL(updatedFilters);

      // Gọi callback ngay lập tức cho UI responsiveness
      onFilterChange(updatedFilters);

      // Chỉ gọi API cần thiết dựa trên filter nào thay đổi
      if (updatedFilters.userId) {
        // Debounce API calls
        const timeoutId = setTimeout(() => {
          startTransition(() => {
            // Nếu đổi classId → chỉ gọi API lấy Units
            if (
              newFilters.hasOwnProperty("classId") &&
              newFilters.classId !== filters.classId
            ) {
              // Nếu reset classId (về rỗng), chỉ update local state
              if (newFilters.classId === "") {
                setFilterData((prev) => ({
                  ...prev,
                  units: [],
                  schoolWeeks: []
                }));
              } else {
                // Nếu chọn classId mới, gọi API
                fetchFilterData({
                  ...updatedFilters,
                  unitId: "",
                  weekId: ""
                }).then((newData) => {
                  setFilterData((prev) => ({
                    ...prev,
                    units: newData.units || [],
                    schoolWeeks: [] // Reset schoolWeeks khi đổi class
                  }));
                  setIsDataLoaded(true);
                });
              }
            }
            // Nếu đổi unitId → chỉ gọi API lấy SchoolWeeks
            else if (
              newFilters.hasOwnProperty("unitId") &&
              newFilters.unitId !== filters.unitId
            ) {
              // Nếu reset unitId (về rỗng), chỉ update local state
              if (newFilters.unitId === "") {
                setFilterData((prev) => ({
                  ...prev,
                  schoolWeeks: []
                }));
              } else {
                // Nếu chọn unitId mới, gọi API
                fetchFilterData(updatedFilters).then((newData) => {
                  setFilterData((prev) => ({
                    ...prev,
                    schoolWeeks: newData.schoolWeeks || []
                  }));
                  setIsDataLoaded(true);
                });
              }
            }
            // Nếu đổi weekId → không cần gọi API, đã update callback ở trên
          });
        }, 100); // 100ms debounce cho filter API calls

        return () => clearTimeout(timeoutId);
      }
    },
    [filters, updateURL, onFilterChange, fetchFilterData]
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
