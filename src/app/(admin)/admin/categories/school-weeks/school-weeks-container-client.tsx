"use client";

import React from "react";

import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useSchoolWeek } from "@/hooks/use-schoolweek";
import { ModalData, ModalType, useModal } from "@/hooks/useModalStore";
import { useSchoolWeekColumns } from "@/components/admin/table/school-weeks/columns";
import { SchoolWeekCombobox } from "@/components/admin/combobox/schoolweek-combobox";
import { Download, Plus, Upload } from "lucide-react";

// Xử lý lỗi
const handleError = (
  error: any,
  component: string,
  operation: string,
  extra?: Record<string, any>
) => {
  // ...existing code...
};

interface ActionButtonsProps {
  rowSelection: Record<string, boolean>;
  onDelete: () => void;
  onExport: () => void;
  onImport: () => void;
  onCreate: () => void;
}

const ActionButtons = ({
  rowSelection,
  onDelete,
  onExport,
  onImport,
  onCreate
}: ActionButtonsProps) => (
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
      Tạo mới tuần học
    </Button>
  </>
);

function SchoolWeekContainerClient() {
  const [selectedWeekId, setSelectedWeekId] = React.useState<string | null>(
    null
  );
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const { data, isLoading, error } = useSchoolWeek();
  const columns = useSchoolWeekColumns();
  const { onOpen } = useModal();

  // Xử lý lỗi data fetching
  React.useEffect(() => {
    if (error) {
      handleError(error, "SchoolWeekContainerClient", "data_fetching");
    }
  }, [error]);

  const handleModalOpen = (modalType: ModalType, options: ModalData = {}) => {
    try {
      onOpen(modalType, options);
    } catch (error) {
      handleError(error, "SchoolWeekContainerClient", `open_${modalType}`);
    }
  };

  const handleDeleteSchoolWeek = () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedWeeks = data?.data.filter((week) =>
      selectedIds.includes(week.swId.toString())
    );

    handleModalOpen("deleteSchoolWeek", {
      schoolWeekIds: selectedIds,
      schoolWeeks: selectedWeeks,
      onSuccess: () => setRowSelection({})
    });
  };

  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];

    let filtered = [...data.data];

    // Lọc theo tuần học được chọn
    if (selectedWeekId) {
      filtered = filtered.filter(
        (week) => week.swId === Number(selectedWeekId)
      );
    }

    // Mặc định sắp xếp từ thấp đến cao theo giá trị tuần học
    filtered.sort((a, b) => {
      const valueA = parseInt(String(a.value)) || 0;
      const valueB = parseInt(String(b.value)) || 0;
      return valueA - valueB;
    });

    return filtered;
  }, [data?.data, selectedWeekId]);

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        searchComponent={
          <SchoolWeekCombobox
            onSelect={setSelectedWeekId}
            placeholder="Tìm kiếm tuần học..."
          />
        }
        actionButtons={
          <ActionButtons
            rowSelection={rowSelection}
            onDelete={handleDeleteSchoolWeek}
            onExport={() => handleModalOpen("exportSchoolWeek")}
            onImport={() => handleModalOpen("importSchoolWeek")}
            onCreate={() =>
              handleModalOpen("createUpdateSchoolWeek", { formType: "create" })
            }
          />
        }
        // filterFunction={filterSchoolWeeks}
        enableRowSelection={true}
        getRowId={(row) => row.swId.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  );
}

export default SchoolWeekContainerClient;
