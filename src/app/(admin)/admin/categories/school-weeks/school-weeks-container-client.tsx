"use client";

import React from "react";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { useClassroomColumns } from "@/components/admin/table/classroom-table/columns";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useSchoolWeek } from "@/hooks/use-schoolweek";
import { useModal } from "@/hooks/useModalStore";
import { useSchoolWeekColumns } from "@/components/admin/table/school-weeks/columns";
import { SchoolWeekCombobox } from "@/components/admin/combobox/schoolweek-combobox";

function SchoolWeekContainerClient() {
  const { data, isLoading } = useSchoolWeek();
  const columns = useSchoolWeekColumns();
  const { onOpen } = useModal();

  const handleCreateSchoolWeek = () => {
    onOpen("createUpdateSchoolWeek", { formType: "create" });
  };

  const filterSchoolWeeks = (schoolWeek: any, searchQuery: string) => {
    console.log("123", schoolWeek);
    return schoolWeek.swId === Number(searchQuery);
  };

  const handleSelectSchoolWeek = (value: string) => {
    console.log("123213", value);
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
    <SchoolWeekCombobox onSelect={handleSelectSchoolWeek} placeholder="Tìm kiếm tuần học..." />
  );
  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        searchComponent={searchComponent}
        actionButtons={actionButtons}
        filterFunction={filterSchoolWeeks}
      />
    </div>
  );
}

export default SchoolWeekContainerClient;
