"use client";

import React, { useState, useTransition, useEffect } from "react";
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
import { filter } from "lodash";

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

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterValues>(() => ({
    classId: searchParams.get("classId") || "",
    unitId: searchParams.get("unitId") || "",
    userId: session?.user?.userId || "",
    weekId: searchParams.get("weekId") || ""
  }));

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

  // Update filters when URL params change
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

    // Nếu có URL params và có userId, fetch data ngay lập tức
    const hasUrlParams =
      searchParams.get("classId") ||
      searchParams.get("unitId") ||
      searchParams.get("weekId");
    if (hasUrlParams && session?.user?.userId && hasChanged) {
      startTransition(async () => {
        try {
          const newData = await fetchFilterData(newFilters);
          setFilterData(newData);
          setIsDataLoaded(true);
        } catch (error) {
          console.error("Error fetching filter data from URL params:", error);
        }
      });
    }
  }, [searchParams, session?.user?.userId, fetchFilterData]);

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

  // Fetch filterData khi filters thay đổi (chỉ khi không phải từ URL params)
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
        startTransition(async () => {
          try {
            const newData = await fetchFilterData(filters);
            setFilterData(newData);
          } catch (error) {
            console.error("Error fetching filter data:", error);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, fetchFilterData, isDataLoaded, searchParams]);

  // Update URL when filters change
  const updateURL = (newFilters: FilterValues) => {
    const params = new URLSearchParams();

    const filterKeys: (keyof FilterValues)[] = ["classId", "unitId", "weekId"];

    console.log("updateURL called with:", newFilters);

    filterKeys.forEach((key) => {
      // Chỉ thêm param khi có giá trị và không rỗng
      if (newFilters[key] && String(newFilters[key]).trim() !== "") {
        params.set(key, String(newFilters[key]));
      }
      // Nếu không có giá trị hoặc rỗng, không thêm vào params (tự động xóa)
    });

    // Tạo URL mới hoàn toàn
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    // Sử dụng window.history để đảm bảo URL được cập nhật
    window.history.replaceState(null, "", newUrl);
  };

  const updateFilters = (newFilters: Partial<FilterValues>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters
    };

    // Set state và update URL ngay lập tức
    setFilters(updatedFilters);
    updateURL(updatedFilters);

    // Chỉ gọi API cần thiết dựa trên filter nào thay đổi
    if (updatedFilters.userId) {
      startTransition(() => {
        // Nếu đổi classId → chỉ gọi API lấy Units
        if (
          newFilters.hasOwnProperty("classId") &&
          newFilters.classId !== filters.classId
        ) {
          // Nếu reset classId (về rỗng), chỉ update callback
          if (newFilters.classId === "") {
            setFilterData((prev) => ({
              ...prev,
              units: [],
              schoolWeeks: []
            }));
            onFilterChange(updatedFilters);
          } else {
            // Nếu chọn classId mới, gọi API
            fetchFilterData({ ...updatedFilters, unitId: "", weekId: "" }).then(
              (newData) => {
                setFilterData((prev) => ({
                  ...prev,
                  units: newData.units || [],
                  schoolWeeks: [] // Reset schoolWeeks khi đổi class
                }));
                setIsDataLoaded(true);
                onFilterChange(updatedFilters);
              }
            );
          }
        }

        // Nếu đổi unitId → chỉ gọi API lấy SchoolWeeks
        else if (
          newFilters.hasOwnProperty("unitId") &&
          newFilters.unitId !== filters.unitId
        ) {
          // Nếu reset unitId (về rỗng), chỉ update callback
          if (newFilters.unitId === "") {
            setFilterData((prev) => ({
              ...prev,
              schoolWeeks: []
            }));
            onFilterChange(updatedFilters);
          } else {
            // Nếu chọn unitId mới, gọi API
            fetchFilterData(updatedFilters).then((newData) => {
              setFilterData((prev) => ({
                ...prev,
                schoolWeeks: newData.schoolWeeks || []
              }));
              setIsDataLoaded(true);
              onFilterChange(updatedFilters);
            });
          }
        }

        // Nếu đổi weekId → không cần gọi API, chỉ update callback
        else if (
          newFilters.hasOwnProperty("weekId") &&
          newFilters.weekId !== filters.weekId
        ) {
          onFilterChange(updatedFilters);
        }
      });
    }
  };

  const handleClassChange = (value: string) => {
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
  };

  const handleUnitChange = (value: string) => {
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
  };

  const handleWeekChange = (value: string) => {
    if (value === "reset") {
      updateFilters({ weekId: "" });
      return;
    }
    updateFilters({ weekId: value });
  };

  // Kiểm tra xem có unit nào không
  const hasUnits = filterData.units && filterData.units.length > 0;

  // Kiểm tra xem có tuần học nào không
  const hasSchoolWeeks =
    filterData.schoolWeeks && filterData.schoolWeeks.length > 0;

  // Check if current unitId/weekId exists in the data
  const currentUnit = filterData.units?.find(
    (u) => String(u.unitId) === String(filters.unitId)
  );
  const currentWeek = filterData.schoolWeeks?.find(
    (w) => String(w.swId) === String(filters.weekId)
  );

  return (
    <div className="flex flex-wrap flex-row gap-4 w-full justify-between md:justify-start">
      {/* {isPending && <Loading />} */}

      <div className="w-[45%] md:w-1/5">
        <Select onValueChange={handleClassChange} value={filters.classId}>
          <SelectTrigger className="w-full h-9 px-3 text-ellipsis overflow-hidden whitespace-nowrap">
            <SelectValue
              placeholder="Chọn lớp học"
              className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[90%]"
            />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]" align="start">
            <ScrollArea className="max-h-[300px] overflow-auto">
              <SelectGroup>
                {filters.classId && (
                  <SelectItem
                    value="reset"
                    className="text-red-500 hover:text-red-700 truncate"
                  >
                    ↺ Reset lớp học
                  </SelectItem>
                )}
                {filterData.classrooms?.map((classroom) =>
                  classroom.class_id ? (
                    <SelectItem
                      key={classroom.class_id}
                      value={classroom.class_id}
                      className="text-ellipsis overflow-hidden whitespace-nowrap py-1.5"
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

      <div className="w-[45%] md:w-1/5">
        <Select
          onValueChange={handleUnitChange}
          value={filters.unitId}
          disabled={!filters.classId || !isDataLoaded}
        >
          <SelectTrigger className="w-full h-9 px-3 text-ellipsis overflow-hidden whitespace-nowrap">
            <SelectValue
              placeholder="Chọn unit"
              className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[90%]"
            >
              {isDataLoaded && currentUnit ? currentUnit.unitName : ""}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]" align="start">
            <ScrollArea className="max-h-[300px] overflow-auto">
              <SelectGroup>
                {filters.unitId && (
                  <SelectItem
                    value="reset"
                    className="text-red-500 hover:text-red-700 truncate"
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
                        className="text-ellipsis overflow-hidden whitespace-nowrap py-1.5"
                      >
                        {unit.unitName ?? "Không có unit"}
                      </SelectItem>
                    ) : null
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-4 px-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
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
                      <p className="text-gray-600 font-medium text-sm">
                        Chưa có unit
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Trong{" "}
                        {filterData.classrooms?.find(
                          (c) => c.class_id === filters.classId
                        )?.classname || "lớp học này"}
                      </p>
                    </div>
                  </div>
                )}
              </SelectGroup>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-1/5">
        <Select
          onValueChange={handleWeekChange}
          value={filters.weekId}
          disabled={!filters.unitId || !isDataLoaded}
        >
          <SelectTrigger className="w-full h-9 px-3 text-ellipsis overflow-hidden whitespace-nowrap">
            <SelectValue
              placeholder="Chọn tuần học"
              className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[90%]"
            >
              {isDataLoaded && currentWeek
                ? `Tuần học ${currentWeek.value}`
                : ""}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]" align="start">
            <ScrollArea className="max-h-[300px] overflow-auto">
              <SelectGroup>
                {filters.weekId && (
                  <SelectItem
                    value="reset"
                    className="text-red-500 hover:text-red-700 truncate"
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
                        className="text-ellipsis overflow-hidden whitespace-nowrap py-1.5"
                      >
                        {week.value
                          ? `Tuần học ${week.value}`
                          : "Không có tuần học"}
                      </SelectItem>
                    ) : null
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-4 px-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
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
                      <p className="text-gray-600 font-medium text-sm">
                        Chưa có tuần học
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Trong{" "}
                        {filterData.units?.find(
                          (u) => u.unitId === filters.unitId
                        )?.unitName || "unit này"}
                      </p>
                    </div>
                  </div>
                )}
              </SelectGroup>
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default FilterFacet;
