"use client";

import React from "react";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { useClassroomColumns } from "@/components/admin/table/classroom-table/columns";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useSchoolWeek } from "@/hooks/use-schoolweek";
import { useModal } from "@/hooks/useModalStore";
import { useSchoolWeekColumns } from "@/components/admin/table/school-weeks/columns";

function SchoolWeekContainerClient() {
  const { data, isLoading } = useSchoolWeek();
  const columns = useSchoolWeekColumns();
  const { onOpen } = useModal();

  const handleCreateSchoolWeek = () => {
    onOpen("createUpdateSchoolWeek", { formType: "create" });
  };

  const filterClassrooms = (classroom: any, searchQuery: string) => {
    return classroom.class_id === Number(searchQuery);
  };

  const actionButtons = (
    <>
      <Button variant="outline">Xuất dữ liệu</Button>
      <Button variant="outline">Nhập dữ liệu</Button>
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleCreateSchoolWeek}
      >
        Tạo mới tuần học
      </Button>
    </>
  );

  const searchComponent = (
    <ClassroomCombobox onSelect={() => {}} placeholder="Tìm kiếm lớp học..." />
  );
  return (
    <div className="bg-white rounded-lg p-10 h-full">
      {/* <ClassroomsTable /> */}
      <GenericTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        searchComponent={searchComponent}
        actionButtons={actionButtons}
        filterFunction={filterClassrooms}
      />
    </div>
  );
}

export default SchoolWeekContainerClient;
