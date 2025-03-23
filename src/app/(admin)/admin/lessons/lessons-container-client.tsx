"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { toast } from "react-toastify";
import { UnitByClassCombobox } from "@/components/admin/combobox/unitbyclass-combobox";
import { useLessonsByClassIdUnitId } from "@/hooks/use-lessons";
import { useLessonsColumns } from "@/components/admin/table/lessons/columns";
import { Download, Plus, Upload } from "lucide-react";
import { useLessonStore } from "@/store/use-lesson-store";

// Xử lý lỗi
const handleError = (error: any, component: string, operation: string, extra?: object) => {
  Sentry.captureException(error, {
    tags: { component, operation },
    extra
  });
};

interface ActionButtonsProps {
  rowSelection: Record<string, boolean>;
  onDelete?: () => void;
  onExport: () => void;
  onImport: () => void;
  onCreate: () => void;
  isEnabled: boolean;
}

const ActionButtons = ({ rowSelection, onDelete, onExport, onImport, onCreate, isEnabled }: ActionButtonsProps) => (
  <>
    {!isEnabled ? (
      <div className="flex items-center text-gray-500 italic">
        Vui lòng chọn lớp học và unit để xem các tùy chọn
      </div>
    ) : (
      <div className="flex flex-col gap-4 items-end flex-wrap justify-end">
          <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={onCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo bài học mới
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

function LessonsContainerClient() {
  // const [selectedClassId, setSelectedClassId] = React.useState<string>("");
  // const [selectedUnitId, setSelectedUnitId] = React.useState<string>("");
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  const { selectedClassId, selectedUnitId, setSelectedClassId, setSelectedUnitId } = useLessonStore();

  const { data, isLoading, error } = useLessonsByClassIdUnitId(selectedClassId, selectedUnitId);
  const columns = useLessonsColumns();
  const { onOpen } = useModal();

  // Xử lý lỗi data fetching
  React.useEffect(() => {
    if (error) {
      handleError(error, 'LessonsContainerClient', 'data_fetching');
    }
  }, [error]);

  React.useEffect(() => {
    setSelectedClassId("")
    setSelectedUnitId("")
  }, []);

  // Xử lý dữ liệu đã được lọc
  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    
    let filtered = [...data.data];
    
    // Lọc theo unitId nếu đã chọn
    // if (selectedUnitId) {
    //   filtered = filtered.filter(
    //     unit => unit.unitId === Number(selectedUnitId)
    //   );
    // }
    
    return filtered;
  }, [data?.data, selectedUnitId]);

  const handleCreateLesson = React.useCallback(() => {
    if (!selectedClassId || !selectedUnitId) {
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Không thể tạo bài học!</p>
          <p className="text-sm text-gray-600">
            Vui lòng chọn lớp học và unit trước khi tạo bài học mới.
          </p>
        </div>
      );
      return;
    }
    
    onOpen("createUpdateLessons", {
      formType: "create",
      classroomId: selectedClassId,
      unitId: Number(selectedUnitId)
    });
  }, [selectedClassId, onOpen, selectedUnitId]);

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
  // const filterUnits = React.useCallback((data: any[], filter: string) => {
  //   if (!filter) return data;
    
  //   return data.filter((item) => 
  //     item.unitName.toLowerCase().includes(filter.toLowerCase())
  //   );
  // }, []);

  const searchComponent = (
    <div className="flex flex-row gap-4 items-center">
      <ClassroomCombobox
        onSelect={handleSelectClassroom}
        placeholder="Tìm kiếm lớp học..."
        buttonClassName="w-full sm:w-[250px]"
      />
      {selectedClassId && (
        <UnitByClassCombobox
          onSelect={handleSelectUnit}
          placeholder="Chọn unit..."
          classId={selectedClassId}
           buttonClassName="w-full sm:w-[250px]"
        />
      )}
    </div>
  );

  const handleDeleteLesson = React.useCallback(() => {
    const selectedIds = Object.keys(rowSelection);
    const selectedLessons = data?.data?.filter(lesson => 
      selectedIds.includes(lesson.lessonId.toString())
    );
    
    onOpen("deleteLesson", {
      lessonIds: selectedIds,
      lessons: selectedLessons,
      onSuccess: () => setRowSelection({})
    });
  }, [rowSelection, data?.data, onOpen]);

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
            onDelete={handleDeleteLesson}
            onExport={() => onOpen("exportLessons")}
            onImport={() => onOpen("importLessons")}
            onCreate={handleCreateLesson}
            isEnabled={!!(selectedClassId && selectedUnitId)}
          />
        }
        // filterFunction={filterUnits}
        enableRowSelection={true}
        getRowId={(row) => row.lessonId.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        meta={{ selectedClassId }}
      />
    </div>
  );
}

export default LessonsContainerClient;
