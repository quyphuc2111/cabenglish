"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { useUnitsColumns } from "@/components/admin/table/units/columns";
import { useUnitByClassId } from "@/hooks/use-units";
import { toast } from "react-toastify";
import { UnitByClassCombobox } from "@/components/admin/combobox/unitbyclass-combobox";
import { Plus, Download, Upload } from "lucide-react";
import { useLessonStore } from "@/store/use-lesson-store";

// Xử lý lỗi
const handleError = (error: any, component: string, operation: string, extra?: Record<string, any>) => {
  Sentry.captureException(error, {
    tags: { component, operation },
    extra
  });
};

interface UnitRow {
  unitId: number;
}

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
      <div className="flex flex-col gap-4 items-end flex-wrap justify-end w-full xl:w-auto">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white w-full xl:w-auto"
          onClick={onCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo unit mới
        </Button>
        <div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto">
       
          <Button variant="outline" onClick={onExport} >
            <Download className="w-4 h-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button variant="outline" onClick={onImport}>
            <Upload className="w-4 h-4 mr-2" />
            Nhập dữ liệu
          </Button>
             {Object.keys(rowSelection).length > 0 && onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              Xóa ({Object.keys(rowSelection).length})
            </Button>
          )}
        </div>
      </div>
    )}
  </>
);

function UnitsContainerClient() {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  const { activateClass, activateUnit, activateLesson, activeLesson } = useLessonStore();

  const { data, isLoading, error } = useUnitByClassId(activeLesson.classId);
  const columns = useUnitsColumns();
  const { onOpen } = useModal();

  // Xử lý lỗi data fetching
  React.useEffect(() => {
    if (error) {
      handleError(error, 'UnitsContainerClient', 'data_fetching');
    }
  }, [error]);

  // Reset states khi component mount để đảm bảo dữ liệu được load lại
  React.useEffect(() => {
    activateLesson("");
    activateUnit("");
    activateClass("");
  }, [activateLesson, activateUnit, activateClass]);


  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    
    let filtered = [...data.data];
    
    if (activeLesson.unitId) {
      filtered = filtered.filter(
        unit => unit.unitId === Number(activeLesson.unitId)
      );
    }
    
    return filtered;
  }, [data?.data, activeLesson.unitId, activeLesson.classId]);




  const handleCreateUnits = React.useCallback(() => {
    if (!activeLesson.classId) {
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
      classroomId: activeLesson.classId
    });
  }, [activeLesson.classId, onOpen]);

  // const handleSelectClassroom = React.useCallback((value: string) => {
  //   setSelectedClassId(value);
  //   setSelectedUnitId("");

  //   activateClass(value)
    
  //   if (value) {
  //     toast.success(
  //       <div className="flex flex-col gap-1">
  //         <p className="font-medium">Đã chọn lớp học!</p>
  //         <p className="text-sm text-gray-600">
  //           Bạn có thể bắt đầu tạo unit cho lớp học này.
  //         </p>
  //       </div>
  //     );
  //   }
  // }, []);

   const handleSelectClassroom = React.useCallback((value: string) => {
    activateClass(value);
    activateUnit("");
    
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
    activateUnit(value);
  }, []);

  const filterUnits = React.useCallback((data: any[], filter: string) => {
    if (!filter) return data;
    if (!Array.isArray(data)) return [];

    return data.filter((item) => 
      item.unitName.toLowerCase().includes(filter.toLowerCase())
    );
  }, []);



  const handleDeleteUnits = React.useCallback(() => {
    const selectedIds = Object.keys(rowSelection);
    const selectedUnits = data?.data?.filter(unit => 
      selectedIds.includes(unit.unitId.toString())
    );
    
    onOpen("deleteUnits", {
      unitIds: selectedIds,
      units: selectedUnits,
      onSuccess: () => {
        setRowSelection({});
        toast.success(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Xóa units thành công!</p>
            <p className="text-sm text-gray-600">
              Đã xóa {selectedIds.length} unit(s) khỏi lớp học.
            </p>
          </div>
        );
      }
    });
  }, [rowSelection, data?.data, onOpen]);

  const searchComponent = (
    <div className="flex flex-col 2xl:flex-row gap-4 items-center">
      <ClassroomCombobox
        onSelect={handleSelectClassroom}
        placeholder="Tìm kiếm lớp học..."
      />
      {activeLesson.classId && (
        <UnitByClassCombobox
          onSelect={handleSelectUnit}
          onChange={handleSelectUnit}
          placeholder="Chọn unit..."
          classId={activeLesson.classId}
        />
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={filteredData as any}
        columns={columns as any}
        isLoading={isLoading}
        searchComponent={searchComponent}
        actionButtons={
          <ActionButtons
            rowSelection={rowSelection}
            onDelete={handleDeleteUnits}
            onExport={() => onOpen("exportUnits", {
             selectedClassId: activeLesson.classId
            })}
            onImport={() => onOpen("importUnits", {
              selectedClassId: activeLesson.classId
            })}
            onCreate={handleCreateUnits}
            isEnabled={!!activeLesson.classId}
          />
        }
        filterFunction={filterUnits as any}
        enableRowSelection={true}
        getRowId={(row: UnitRow) => row.unitId.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        meta={{ selectedClassId: activeLesson.classId }}
      />
    </div>
  );
}

export default UnitsContainerClient;
