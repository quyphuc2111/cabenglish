'use client'

import React, { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";

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
  const [isPending, startTransition] = useTransition();
  const [filterData, setFilterData] = useState<FilterData>(initialFilterData);
  const [filters, setFilters] = useState<FilterValues>({
    classId: '',
    unitId: '',
    userId: 'user2'
  });

  const updateFilters = async (newFilters: Partial<FilterValues>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters
    };

    startTransition(async () => {
      const newData = await fetchFilterData(updatedFilters);
      setFilterData(newData);
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    });
  };

  const handleClassChange = (value: string) => {
    if (value === 'reset') {
      updateFilters({ classId: '', unitId: '' });
      return;
    }
    updateFilters({ classId: value, unitId: '' });
  };

  const handleUnitChange = (value: string) => {
    if (value === 'reset') {
      updateFilters({ unitId: '' });
      return;
    }
    updateFilters({ unitId: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-1/2">
      {isPending && <div className="absolute right-0 top-0">Đang tải...</div>}
      
      <div className="w-full sm:w-1/3">
        <Select onValueChange={handleClassChange} value={filters.classId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Lớp học" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filters.classId && (
                <SelectItem value="reset" className="text-red-500 hover:text-red-700">
                  ↺ Reset lớp học
                </SelectItem>
              )}
              {filterData.classrooms?.map((classroom) => (
                classroom.class_id ? (
                  <SelectItem key={classroom.class_id} value={classroom.class_id}>
                    {classroom.classname ?? 'Không có tên'}
                  </SelectItem>
                ) : null
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-1/3">
        <Select 
          onValueChange={handleUnitChange} 
          value={filters.unitId}
          disabled={!filters.classId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filters.unitId && (
                <SelectItem value="reset" className="text-red-500 hover:text-red-700">
                  ↺ Reset unit
                </SelectItem>
              )}
              {filterData.units?.map((unit) => (
                unit.unitId ? (
                  <SelectItem key={unit.unitId} value={unit.unitId}>
                    {unit.unitName ?? 'Không có unit'}
                  </SelectItem>
                ) : null
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-1/3">
        <Select disabled={!filters.unitId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tuần học" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filterData.schoolWeeks?.map((week) => (
                week.swId ? (
                  <SelectItem key={week.swId} value={week.swId}>
                    {week.value ? `Tuần học ${week.value}` : 'Không có tuần học'}
                  </SelectItem>
                ) : null
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default FilterFacet;
