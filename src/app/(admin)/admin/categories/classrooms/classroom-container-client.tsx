"use client";
import SearchInput from "@/components/admin/search-input";
import {
  Classroom,
  columns
} from "@/components/admin/table/classroom-table/columns";
import { DataTable } from "@/components/admin/table/common/data-table";
import { ClassroomsTable } from "@/components/admin/table/classroom-table/classrooms-table";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import React from "react";

function ClassroomContainerClient() {
   const classroomData = Array.from({ length: 20 }, (_, i) => ({
    value: `classroom-${i}`,
    label: `Lớp học ${i}`
  }));

  const { onOpen } = useModal();

  const handleCreateClassroom = () => {
    onOpen("createUpdateClassroom", {
      formType: "create"
    });
  };

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <div className="flex justify-between items-center">
        <SearchInput data={classroomData} placeholder="Tìm kiếm lớp học" />
        <div className="flex gap-5">
          <Button variant="outline">Xuất dữ liệu</Button>
          <Button variant="outline">Nhập dữ liệu</Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleCreateClassroom}>
            Tạo mới lớp học
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <ClassroomsTable />
      </div>
    </div>
  );
}

export default ClassroomContainerClient;
