"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { useClassroomColumns } from "@/components/admin/table/classroom-table/columns";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useClassrooms } from "@/hooks/use-classrooms";
import { ModalData, ModalType, useModal } from "@/hooks/useModalStore";
import { Download, Plus, Upload } from "lucide-react";

// Tách riêng các hàm xử lý lỗi
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

// Tách riêng component ActionButtons với responsive design
const ActionButtons = ({ rowSelection, onDelete, onExport, onImport, onCreate }: ActionButtonsProps) => (
  <>
    {Object.keys(rowSelection).length > 0 && (
      <Button variant="destructive" onClick={onDelete} className="w-full sm:w-auto">
        <span className="sm:hidden">Xóa ({Object.keys(rowSelection).length})</span>
        <span className="hidden sm:inline">Xóa ({Object.keys(rowSelection).length})</span>
      </Button>
    )}
    <Button variant="outline" onClick={onExport} className="w-full sm:w-auto">
      <Download className="w-4 h-4 mr-2" />
      <span className="sm:hidden">Xuất</span>
      <span className="hidden sm:inline">Xuất dữ liệu</span>
    </Button>
    <Button variant="outline" onClick={onImport} className="w-full sm:w-auto">
      <Upload className="w-4 h-4 mr-2" />
      <span className="sm:hidden">Nhập</span>
      <span className="hidden sm:inline">Nhập dữ liệu</span>
    </Button>
    <Button
      className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
      onClick={onCreate}
    >
      <Plus className="w-4 h-4 mr-2" />
      <span className="sm:hidden">Tạo mới</span>
      <span className="hidden sm:inline">Tạo mới lớp học</span>
    </Button>
  </>
);

function ClassroomContainerClient() {
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  const { data, isLoading, error } = useClassrooms();
  const columns = useClassroomColumns();
  const { onOpen } = useModal();

  // Xử lý lỗi data fetching
  React.useEffect(() => {
    if (error) {
      handleError(error, 'ClassroomContainerClient', 'data_fetching');
    }
  }, [error]);

  // Tách logic lọc dữ liệu
  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    
    let filtered = [...data.data];
    if (!selectedClassId) return filtered;

    const selectedClassroom = filtered.find(
      classroom => classroom.class_id === Number(selectedClassId)
    );
    
    return selectedClassroom 
      ? filtered.filter(classroom => classroom.classname === selectedClassroom.classname)
      : filtered;
  }, [data?.data, selectedClassId]);

  // Các hàm xử lý sự kiện
  const handleModalOpen = (modalType: ModalType, options?: ModalData) => {
    try {
      onOpen(modalType, options);
    } catch (error) {
      handleError(error, 'ClassroomContainerClient', `open_${modalType}`);
    }
  };

  const handleDeleteClassroom = () => {
    const selectedIds = Object.keys(rowSelection);
    
    handleModalOpen("deleteClassroom", {
      classroomIds: selectedIds,
      onSuccess: () => setRowSelection({})
    });
  };

  const filterClassrooms = React.useCallback((classroom: any, searchQuery: string) => {
    if (!searchQuery) return true;
    const searchTerm = searchQuery.toLowerCase().trim();
    return (
      classroom.classname.toLowerCase().includes(searchTerm) ||
      classroom.class_id.toString().includes(searchTerm)
    );
  }, []);

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        searchComponent={
          <ClassroomCombobox 
            onSelect={setSelectedClassId} 
            placeholder="Tìm kiếm lớp học..." 
          />
        }
        actionButtons={
          <ActionButtons
            rowSelection={rowSelection}
            onDelete={handleDeleteClassroom}
            onExport={() => handleModalOpen("exportClassroom")}
            onImport={() => handleModalOpen("importClassroom")}
            onCreate={() => handleModalOpen("createUpdateClassroom", { formType: "create" })}
          />
        }
        filterFunction={filterClassrooms}
        enableRowSelection={true}
        getRowId={(row) => row.class_id.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  );
}

export default ClassroomContainerClient;
