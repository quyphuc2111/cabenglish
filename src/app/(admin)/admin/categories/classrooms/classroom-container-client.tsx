"use client";

import React from "react";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { useClassroomColumns } from "@/components/admin/table/classroom-table/columns";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useClassrooms } from "@/hooks/use-classrooms";
import { useModal } from "@/hooks/useModalStore";

function ClassroomContainerClient() {
  const { data, isLoading } = useClassrooms();
  const columns = useClassroomColumns();
  const { onOpen } = useModal();

  const handleCreateClassroom = () => {
    onOpen("createUpdateClassroom", { formType: "create" });
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
        onClick={handleCreateClassroom}
      >
        Tạo mới lớp học
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

export default ClassroomContainerClient;
