"use client";

import React from "react";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { toast } from "react-toastify";
import { UnitByClassCombobox } from "@/components/admin/combobox/unitbyclass-combobox";
import { useLessonsByClassIdUnitId } from "@/hooks/use-lessons";
import { useLessonsColumns } from "@/components/admin/table/lessons/columns";

function LessonsContainerClient() {
  const [selectedClassId, setSelectedClassId] = React.useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = React.useState<string>("");

  const { data, isLoading } = useLessonsByClassIdUnitId(selectedClassId, selectedUnitId);
  const columns = useLessonsColumns();
  const { onOpen } = useModal();

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
      unitId: selectedUnitId
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
  const filterUnits = React.useCallback((data: any[], filter: string) => {
    if (!filter) return data;
    
    return data.filter((item) => 
      item.unitName.toLowerCase().includes(filter.toLowerCase())
    );
  }, []);

  const actionButtons = (
    <>
      {selectedClassId && selectedUnitId ? (
        <div className="flex flex-row gap-4">
          <Button variant="outline">Xuất dữ liệu</Button>
          <Button variant="outline">Nhập dữ liệu</Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleCreateLesson}
          >
            Tạo bài học mới
          </Button>
        </div>
      ) : (
        <div className="flex items-center text-gray-500 italic">
          Vui lòng chọn lớp học và unit để xem các tùy chọn
        </div>
      )}
    </>
  );

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
        actionButtons={actionButtons}
        filterFunction={filterUnits}
        meta={{ selectedClassId }}
      />
    </div>
  );
}

export default LessonsContainerClient;
