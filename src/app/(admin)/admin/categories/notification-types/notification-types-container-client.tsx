"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";
import { Download, Plus, Upload } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { ModalData, ModalType, useModal } from "@/hooks/useModalStore";
import { useNotiType } from "@/hooks/use-notitype";
import { useNotiTypeColumns } from "@/components/admin/table/notitype/columns";
import { NotiTypeCombobox } from "@/components/admin/combobox/notitype-combobox";

// Xử lý lỗi
const handleError = (error: any, component: string, operation: string, extra?: Record<string, any>) => {
  Sentry.captureException(error, {
    tags: { component, operation },
    extra
  });
};

interface ActionButtonsProps {
  rowSelection: Record<string, boolean>;
  onDelete: () => void;
  onExport: () => void;
  onImport: () => void;
  onCreate: () => void;
}

const ActionButtons = ({ rowSelection, onDelete, onExport, onImport, onCreate }: ActionButtonsProps) => (
  <>
    {Object.keys(rowSelection).length > 0 && (
      <Button variant="destructive" onClick={onDelete}>
        Xóa ({Object.keys(rowSelection).length})
      </Button>
    )}
    <Button variant="outline" onClick={onExport}>
      <Download className="w-4 h-4 mr-2" />
      Xuất dữ liệu
    </Button>
    <Button variant="outline" onClick={onImport}>
      <Upload className="w-4 h-4 mr-2" />
      Nhập dữ liệu
    </Button>
    <Button
      className="bg-blue-500 hover:bg-blue-600 text-white"
      onClick={onCreate}
    >
      <Plus className="w-4 h-4 mr-2" />
      Tạo mới loại thông báo
    </Button>
  </>
);

function NotificationTypesContainerClient() {
  const [selectedNotiId, setSelectedNotiId] = React.useState<string | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  
  const { data, isLoading, error } = useNotiType();
  const columns = useNotiTypeColumns();
  const { onOpen } = useModal();

  // Xử lý lỗi data fetching
  React.useEffect(() => {
    if (error) {
      handleError(error, 'NotificationTypesContainerClient', 'data_fetching');
    }
  }, [error]);

  const handleModalOpen = (modalType: ModalType, options: ModalData = {}) => {
    try {
      onOpen(modalType, options);
    } catch (error) {
      handleError(error, 'NotificationTypesContainerClient', `open_${modalType}`);
    }
  };

  const handleDeleteNotiTypes = () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedNotiTypes = data?.data.filter(noti => 
      selectedIds.includes(noti.ntId.toString())
    );
    
    handleModalOpen("deleteNotiType", {
      notiTypeIds: selectedIds,
      notiTypes: selectedNotiTypes,
      onSuccess: () => setRowSelection({})
    });
  };

  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    if (!selectedNotiId) return data.data;
    return data.data.filter(noti => noti.ntId === Number(selectedNotiId));
  }, [data?.data, selectedNotiId]);

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={filteredData}
        columns={columns  as ColumnDef<any>[]}
        isLoading={isLoading}
        searchComponent={
          <NotiTypeCombobox 
            onSelect={setSelectedNotiId}
            placeholder="Tìm kiếm loại thông báo..." 
          />
        }
        actionButtons={
          <ActionButtons
            rowSelection={rowSelection}
            onDelete={handleDeleteNotiTypes}
            onExport={() => handleModalOpen("exportNotiType")}
            onImport={() => handleModalOpen("importNotiType")}
            onCreate={() => handleModalOpen("createUpdateNotiType", { formType: "create" })}
          />
        }
        enableRowSelection={true}
        getRowId={(row) => row.ntId.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  );
}

export default NotificationTypesContainerClient;

