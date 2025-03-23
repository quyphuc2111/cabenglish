"use client";

import React from "react";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { useUnitsColumns } from "@/components/admin/table/units/columns";
import { useUnitByClassId } from "@/hooks/use-units";
import { toast } from "react-toastify";
import { UnitByClassCombobox } from "@/components/admin/combobox/unitbyclass-combobox";
import { Plus, Download, Upload } from "lucide-react";

// Thêm interface cho ActionButtons
interface ActionButtonsProps {
  onDelete?: () => void;
  onExport: () => void;
  onImport: () => void;
  onCreate: () => void;
  isEnabled: boolean;
  rowSelection: Record<string, boolean>;
}

const ActionButtons = ({ rowSelection, onDelete, onExport, onImport, onCreate, isEnabled }: ActionButtonsProps) => (
  <>
    {!isEnabled ? (
      <div className="flex items-center text-gray-500 italic">
        Vui lòng chọn lớp học để xem các tùy chọn
      </div>
    ) : (
      <div className="flex flex-col gap-4 items-end flex-wrap justify-end">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={onCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo unit mới
        </Button>
        <div className="flex flex-row gap-4">
          {Object.keys(rowSelection).length > 0 && onDelete && (
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
        </div>
      </div>
    )}
  </>
);

function UnitsContainerClient() {
  const [selectedClassId, setSelectedClassId] = React.useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = React.useState<string>("");
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const { data, isLoading } = useUnitByClassId(selectedClassId);
  const columns = useUnitsColumns();
  const { onOpen } = useModal();

  // Xử lý dữ liệu đã được lọc
  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    
    let filtered = [...data.data];
    
    // Lọc theo unitId nếu đã chọn
    if (selectedUnitId) {
      filtered = filtered.filter(
        unit => unit.unitId === Number(selectedUnitId)
      );
    }
    
    return filtered;
  }, [data?.data, selectedUnitId]);

  const handleCreateNotitype = React.useCallback(() => {
    if (!selectedClassId) {
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Không thể tạo unit!</p>
          <p className="text-sm text-gray-600">
            Vui lòng chọn lớp học trước khi tạo unit mới.
          </p>
        </div>
      );
      return;
    }
    
    onOpen("createUpdateUnits", {
      formType: "create",
      classroomId: selectedClassId
    });
  }, [selectedClassId, onOpen]);

  const handleSelectClassroom = React.useCallback((value: string) => {
    setSelectedClassId(value);
    // Reset selectedUnitId khi đổi lớp học
    setSelectedUnitId("");
    
    if (value) {
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Đã chọn lớp học!</p>
          <p className="text-sm text-gray-600">
            Bạn có thể bắt đầu tạo unit cho lớp học này.
          </p>
        </div>
      );
    }
  }, []);

  const handleSelectUnit = React.useCallback((value: string) => {
    setSelectedUnitId(value);
  }, []);

  // Hàm filter cho search
  const filterUnits = React.useCallback((data: any[], filter: string) => {
    if (!filter) return data;
    
    return data.filter((item) => 
      item.unitName.toLowerCase().includes(filter.toLowerCase())
    );
  }, []);

  const handleDeleteUnits = React.useCallback(() => {
    const selectedIds = Object.keys(rowSelection);
    const selectedUnits = data?.data?.filter(unit => 
      selectedIds.includes(unit.unitId.toString())
    );
    
    onOpen("deleteUnit", {
      unitIds: selectedIds,
      units: selectedUnits,
      onSuccess: () => setRowSelection({})
    });
  }, [rowSelection, data?.data, onOpen]);

  const searchComponent = (
    <div className="flex flex-row gap-4 items-center">
      <ClassroomCombobox
        onSelect={handleSelectClassroom}
        placeholder="Tìm kiếm lớp học..."
      />
      {selectedClassId && (
        <UnitByClassCombobox
          onSelect={handleSelectUnit}
          placeholder="Chọn unit..."
          classId={selectedClassId}
        />
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        searchComponent={searchComponent}
        actionButtons={
          <ActionButtons
            rowSelection={rowSelection}
            onDelete={handleDeleteUnits}
            onExport={() => onOpen("exportUnits")}
            onImport={() => onOpen("importUnits")}
            onCreate={handleCreateNotitype}
            isEnabled={!!selectedClassId}
          />
        }
        filterFunction={filterUnits}
        enableRowSelection={true}
        getRowId={(row) => row.unitId.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        meta={{ selectedClassId }}
      />
    </div>
  );
}

export default UnitsContainerClient;
