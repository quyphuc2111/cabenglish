"use client";

import React from "react";
// ...existing code...
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useSchoolWeek } from "@/hooks/use-schoolweek";
import { ModalData, ModalType, useModal } from "@/hooks/useModalStore";
import { useSectionColumns } from "@/components/admin/table/sections/columns";
import { Download, Plus, Upload } from "lucide-react";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { UnitByClassCombobox } from "@/components/admin/combobox/unitbyclass-combobox";
import { showToast } from "@/utils/toast-config";
// import { useUnitByClassId } from "@/hooks/use-units";
import { LessonCombobox } from "@/components/admin/combobox/lesson-combobox";
import {
  useGetSectionByLessonId,
  useDeleteSection
} from "@/hooks/use-sections";
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
  selectedUnitId: string;
  selectedClassId: string;
  selectedLessonId: string;
}

const ActionButtons = ({
  rowSelection,
  onDelete,
  onExport,
  onImport,
  onCreate,
  selectedUnitId,
  selectedClassId,
  selectedLessonId
}: ActionButtonsProps) => (
  <>
    {!selectedClassId ? (
      <div className="flex items-center text-gray-500 italic">
        <p>Vui lòng chọn lớp học</p>
      </div>
    ) : !selectedUnitId ? (
      <div className="flex items-center text-gray-500 italic">
        <p>Vui lòng chọn unit</p>
      </div>
    ) : !selectedLessonId ? (
      <div className="flex items-center text-gray-500 italic">
        <p>Vui lòng chọn bài học</p>
      </div>
    ) : (
      <div className="flex flex-row gap-4 items-center flex-wrap justify-end">
           {Object.keys(rowSelection).length > 0 && (
            <Button variant="destructive" onClick={onDelete}>
              Xóa ({Object.keys(rowSelection).length})
            </Button>
          )}
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={onCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo mới Section
        </Button>
        <div className="flex flex-row gap-4 items-center justify-end flex-wrap">
       
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

function SectionsContainerClient() {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [orderFilter, setOrderFilter] = React.useState<string>("default");

  // Debounce search query để tối ưu hiệu suất
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { activeLesson, activateLesson, activateUnit, activateClass } =
    useLessonStore();

  const columns = useSectionColumns();
  const { onOpen } = useModal();

  React.useEffect(() => {
    activateLesson("");
    activateUnit("");
    activateClass("");
  }, []);

  const {
    data: sectionData,
    isLoading: sectionLoading,
    error: sectionError
  } = useGetSectionByLessonId(Number(activeLesson.lessonId));

  // Xử lý dữ liệu đã được lọc
  const filteredData = React.useMemo(() => {
    if (!sectionData?.data) return [];

    let filtered = [...sectionData.data];

    // Lọc theo tên section nếu có search query (sử dụng debounced value)
    if (debouncedSearchQuery.trim()) {
      const searchTerm = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((section) =>
        section.sectionName.toLowerCase().includes(searchTerm)
      );
    }

    // Sắp xếp theo order
    if (orderFilter === "asc") {
      filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    } else if (orderFilter === "desc") {
      filtered.sort((a, b) => (b.order || 0) - (a.order || 0));
    }

    return filtered;
  }, [
    sectionData?.data,
    debouncedSearchQuery,
    orderFilter
  ]);

  const { mutate: deleteSection, isPending: isDeleting } = useDeleteSection();

  React.useEffect(() => {
    if (sectionError) {
      handleError(sectionError, "SectionsContainerClient", "data_fetching");
    }
  }, [sectionError]);

  const handleModalOpen = (modalType: ModalType, options: ModalData = {}) => {
    try {
      onOpen(modalType, options);
    } catch (error) {
      handleError(error, "SectionsContainerClient", `open_${modalType}`);
    }
  };

  const handleDeleteSection = () => {
    const selectedIds = Object.keys(rowSelection);

    if (selectedIds.length === 0) {
      showToast.error("Vui lòng chọn ít nhất một section để xóa!");
      return;
    }

    if (!activeLesson.lessonId) {
      showToast.error("Không tìm thấy thông tin bài học!");
      return;
    }

    const lessonIdNumber = Number(activeLesson.lessonId);
    if (isNaN(lessonIdNumber) || lessonIdNumber <= 0) {
      showToast.error("ID bài học không hợp lệ!");
      return;
    }

    deleteSection(
      {
        sectionIds: selectedIds,
        lessonId: lessonIdNumber
      },
      {
        onSuccess: () => {
          showToast.success(`Đã xóa ${selectedIds.length} section thành công!`);
          setRowSelection({});
        },
        onError: (error: Error) => {
          console.error("Delete section error:", error);
          showToast.error(error.message || "Có lỗi xảy ra khi xóa section!");
        }
      }
    );
  };
  const handleSelectClassroom = React.useCallback(
    (value: string) => {
      activateClass(value);
      activateUnit("");
      activateLesson("");

      if (value) {
        showToast.success(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Đã chọn lớp học!</p>
          </div>
        );
      }
    },
    [activateClass, activateUnit, activateLesson]
  );

  const handleSelectUnit = React.useCallback(
    (value: string) => {
      activateUnit(value);
      activateLesson("");
      // Reset filters khi chọn unit mới
      setSearchQuery("");
      setOrderFilter("default");

      if (value) {
        showToast.success(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Đã chọn unit!</p>
          </div>
        );
      }
    },
    [activateUnit, activateLesson]
  );

  const handleSelectLesson = React.useCallback(
    (value: string) => {
      activateLesson(value);
      // Reset filters khi chọn lesson mới
      setSearchQuery("");
      setOrderFilter("default");

      if (value) {
        showToast.success(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Đã chọn bài học!</p>
            <p className="text-sm text-gray-600">
              Bạn có thể bắt đầu tạo section cho bài học này.
            </p>
          </div>
        );
      }
    },
    [activateLesson]
  );

  const handleCreateSection = () => {
    if (!activeLesson.lessonId || activeLesson.lessonId === "") {
      showToast.error("Vui lòng chọn bài học trước khi tạo section!");
      return;
    }

    const lessonIdNumber = Number(activeLesson.lessonId);
    if (isNaN(lessonIdNumber) || lessonIdNumber <= 0) {
      showToast.error("ID bài học không hợp lệ!");
      return;
    }

    handleModalOpen("createUpdateSection", {
      formType: "create",
      lessonIds: lessonIdNumber
    });
  };

  const handleUpdateSection = (section: any) => {
    if (!activeLesson.lessonId || activeLesson.lessonId === "") {
      showToast.error("Vui lòng chọn bài học trước khi cập nhật section!");
      return;
    }

    const lessonIdNumber = Number(activeLesson.lessonId);
    if (isNaN(lessonIdNumber) || lessonIdNumber <= 0) {
      showToast.error("ID bài học không hợp lệ!");
      return;
    }

    console.log("🔧 Opening update modal for section:", section);

    handleModalOpen("createUpdateSection", {
      formType: "update",
      lessonIds: lessonIdNumber,
      sections: [section] // Truyền dữ liệu section để update
    });
  };

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
        {activeLesson.unitId && activeLesson.classId && (
          <LessonCombobox
            onSelect={handleSelectLesson}
            placeholder="Chọn bài học..."
            unitId={activeLesson.unitId}
            classId={activeLesson.classId}
            buttonClassName="w-full sm:w-[250px]"
          />
        )}
      </div>
      {activeLesson.classId && activeLesson.unitId && activeLesson.lessonId && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Bộ lọc và tìm kiếm
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Tìm kiếm theo tên phần:
              </label>
              <Input
                placeholder="Nhập tên phần..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Sắp xếp theo thứ tự:
              </label>
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

  const getSafeRowId = (row: any) => {
    return row?.sectionId?.toString() || `temp-${Math.random()}`;
  };

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={filteredData}
        columns={columns}
        isLoading={sectionLoading || isDeleting}
        searchComponent={searchComponent}
        actionButtons={
          <ActionButtons
            rowSelection={rowSelection}
            onDelete={handleDeleteSection}
            onExport={() => handleModalOpen("exportSection")}
            onImport={() => handleModalOpen("importSection")}
            onCreate={handleCreateSection}
            selectedUnitId={activeLesson.unitId}
            selectedClassId={activeLesson.classId}
            selectedLessonId={activeLesson.lessonId}
          />
        }
        // filterFunction={filterSchoolWeeks}
        enableRowSelection={true}
        getRowId={getSafeRowId}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  );
}

export default SectionsContainerClient;
