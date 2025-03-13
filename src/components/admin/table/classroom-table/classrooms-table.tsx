"use client";

import { useClassrooms } from "@/hooks/use-classrooms";
import { DataTable } from "@/components/admin/table/common/data-table";
import { useState, useMemo } from "react";
import { useClassroomColumns } from "./columns";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";

export function ClassroomsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useClassrooms();
  const columns = useClassroomColumns();

  // Đảm bảo data.data là một mảng
  const classrooms = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  // Lọc dữ liệu dựa trên search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return classrooms;
    
    return classrooms.filter((classroom) => 
      // classroom.classname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // classroom.description.toLowerCase().includes(searchQuery.toLowerCase())
      // classroom.class_id.toString().includes(searchQuery)
      classroom.class_id === Number(searchQuery)
    );
  }, [classrooms, searchQuery]);

  // Tính toán dữ liệu cho trang hiện tại
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, pageSize]);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredData.length / pageSize);
  
  // Tính tổng số items
  const totalItems = filteredData.length;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); 
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ClassroomCombobox 
          onSelect={handleSearch}
          placeholder="Tìm kiếm lớp học..."
        />
      </div>
      <DataTable
        data={paginatedData}
        columns={columns}
        pageCount={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(1);
        }}
        isLoading={isLoading}
        totalItems={totalItems}
      />
    </div>
  );
}