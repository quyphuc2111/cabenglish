"use client";

import React from "react";

import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { useNotiType } from "@/hooks/use-notitype";
import { useNotiTypeColumns } from "@/components/admin/table/notitype/columns";
import { NotiTypeCombobox } from "@/components/admin/combobox/notitype-combobox";

function NotificationTypesContainerClient() {
  const { data, isLoading } = useNotiType();
  const columns = useNotiTypeColumns();
  const { onOpen } = useModal();

  const handleCreateNotitype = () => {
    onOpen("createUpdateNotiType", { formType: "create" });
  };

  const filterNotiTypes = (notiType: any, searchQuery: string) => {
    return notiType.ntId === Number(searchQuery);
  };

  const handleSelectNotiType = (value: string) => {
    console.log("123213", value);
  };

  const actionButtons = (
    <>
      <Button variant="outline">Xuất dữ liệu</Button>
      <Button variant="outline">Nhập dữ liệu</Button>
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleCreateNotitype}
      >
        Tạo mới loại thông báo
      </Button>
    </>
  );

  const searchComponent = (
    <NotiTypeCombobox
      onSelect={handleSelectNotiType}
      placeholder="Tìm kiếm loại thông báo..."
    />
  );
  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        searchComponent={searchComponent}
        actionButtons={actionButtons}
        filterFunction={filterNotiTypes}
      />
    </div>
  );
}

export default NotificationTypesContainerClient;
