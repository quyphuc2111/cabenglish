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
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSchoolWeek } from "@/hooks/use-schoolweek";

// Xử lý lỗi
const handleError = (
  error: any,
  component: string,
  operation: string,
  extra?: Record<string, any>
) => {
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

const ActionButtons = ({
  rowSelection,
  onDelete,
  onExport,
  onImport,
  onCreate,
  isEnabled
}: ActionButtonsProps) => (
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
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [schoolWeekFilter, setSchoolWeekFilter] = React.useState<string>("all");
  const [orderFilter, setOrderFilter] = React.useState<string>("default");

  // Debounce search query để tối ưu hiệu suất
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { activeLesson, activateLesson, activateUnit, activateClass } =
    useLessonStore();

  const { data, isLoading, error } = useLessonsByClassIdUnitId(
    activeLesson.classId,
    activeLesson.unitId
  );
  const { data: schoolWeekData, isLoading: isLoadingSchoolWeek } =
    useSchoolWeek();

  const columns = useLessonsColumns();
  const { onOpen } = useModal();

  // Xử lý lỗi data fetching
  React.useEffect(() => {
    if (error) {
      handleError(error, "LessonsContainerClient", "data_fetching");
    }
  }, [error]);

  React.useEffect(() => {
    activateLesson("");
    activateUnit("");
    activateClass("");
  }, []);

  // Lấy danh sách tuần học từ useSchoolWeek
  const uniqueSchoolWeeks = React.useMemo(() => {
    if (!schoolWeekData?.data) return [];
    return schoolWeekData.data
      .map(sw => ({
        id: sw.swId,
        value: sw.value,
        label: sw.value
      }))
      .sort((a, b) => a.value - b.value);
  }, [schoolWeekData?.data]);

  // Xử lý dữ liệu đã được lọc
  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];

    let filtered = [...data.data];

    // Lọc theo tên bài học nếu có search query (sử dụng debounced value)
    if (debouncedSearchQuery.trim()) {
      const searchTerm = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((lesson) =>
        lesson.lessonName.toLowerCase().includes(searchTerm)
      );
    }

    // Lọc theo tuần học
    if (schoolWeekFilter && schoolWeekFilter !== "all") {
      // Tìm schoolWeek object từ filter value
      const selectedSchoolWeek = uniqueSchoolWeeks.find(sw => sw.id.toString() === schoolWeekFilter);
      if (selectedSchoolWeek) {
        filtered = filtered.filter(
          (lesson) => lesson.schoolWeekID === selectedSchoolWeek.id
        );
      }
    }

    // Sắp xếp theo order
    if (orderFilter === "asc") {
      filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    } else if (orderFilter === "desc") {
      filtered.sort((a, b) => (b.order || 0) - (a.order || 0));
    }

    return filtered;
  }, [
    data?.data,
    activeLesson.unitId,
    debouncedSearchQuery,
    schoolWeekFilter,
    orderFilter,
    uniqueSchoolWeeks
  ]);

  const handleCreateLesson = React.useCallback(() => {
    if (!activeLesson.classId || !activeLesson.unitId) {
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
      classroomId: activeLesson.classId,
      unitId: Number(activeLesson.unitId)
    });
  }, [activeLesson.classId, activeLesson.unitId, onOpen]);

  const handleSelectClassroom = React.useCallback((value: string) => {
    activateClass(value);
    activateUnit("");
    activateLesson("");

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
    console.log("value", value);
    activateUnit(value);
    activateLesson("");
    // Reset filters khi chọn unit mới
    setSearchQuery("");
    setSchoolWeekFilter("all");
    setOrderFilter("default");
  }, []);

  const searchComponent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center">
        <ClassroomCombobox
          onSelect={handleSelectClassroom}
          placeholder="Tìm kiếm lớp học..."
          buttonClassName="w-full sm:w-[250px]"
        />
        {activeLesson.classId && (
          <UnitByClassCombobox
            onSelect={handleSelectUnit}
            placeholder="Chọn unit..."
            classId={activeLesson.classId}
            buttonClassName="w-full sm:w-[250px]"
          />
        )}
      </div>
      {activeLesson.classId && activeLesson.unitId && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Bộ lọc và tìm kiếm</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Tìm kiếm bài học:</label>
              <Input
                placeholder="Nhập tên bài học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Tuần học:</label>
              <Select value={schoolWeekFilter} onValueChange={setSchoolWeekFilter}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Chọn tuần học" />
                </SelectTrigger>
                <SelectContent className="h-[300px] overflow-auto bg-white">
                  <SelectItem value="all">Tất cả tuần học</SelectItem>
                  {uniqueSchoolWeeks.map((week) => (
                    <SelectItem key={week.id} value={week.id.toString()}>
                      Tuần {week.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Sắp xếp theo thứ tự:</label>
              <Select value={orderFilter} onValueChange={setOrderFilter}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Chọn thứ tự sắp xếp" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="asc">Thứ tự tăng dần</SelectItem>
                  <SelectItem value="desc">Thứ tự giảm dần</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const handleDeleteLesson = React.useCallback(() => {
    const selectedIds = Object.keys(rowSelection).map(Number);
    const selectedLessons = data?.data?.filter((lesson) =>
      selectedIds.includes(lesson.lessonId)
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
            isEnabled={!!(activeLesson.classId && activeLesson.unitId)}
          />
        }
        // filterFunction={filterUnits}
        enableRowSelection={true}
        getRowId={(row) => row.lessonId.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        meta={{ activeLesson }}
      />
    </div>
  );
}

export default LessonsContainerClient;
