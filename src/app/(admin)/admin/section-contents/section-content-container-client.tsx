"use client";

import React from "react";

import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { ModalData, ModalType, useModal } from "@/hooks/useModalStore";
import { Download, Plus, Upload } from "lucide-react";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { UnitByClassCombobox } from "@/components/admin/combobox/unitbyclass-combobox";
import { showToast } from "@/utils/toast-config";
import { LessonCombobox } from "@/components/admin/combobox/lesson-combobox";
import { useLessonStore } from "@/store/use-lesson-store";
import { SectionsCombobox } from "@/components/admin/combobox/sections-combox";
import { useGetSectionContentBySectionId } from "@/hooks/useSectionContent";
import { useSectionContentColumns } from "@/components/admin/table/secton-content/columns";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

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
  selectedSectionId: string;
}

const ActionButtons = ({
  rowSelection,
  onDelete,
  onExport,
  onImport,
  onCreate,
  selectedUnitId,
  selectedClassId,
  selectedLessonId,
  selectedSectionId
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
    ) : !selectedSectionId ? (
      <div className="flex items-center text-gray-500 italic">
        <p>Vui lòng chọn section</p>
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
          Tạo mới Section Content
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

function SectionContentContainerClient() {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [orderFilter, setOrderFilter] = React.useState<string>("all");
  const [sortOrder, setSortOrder] = React.useState<string>("default");
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const {
    activeLesson,
    activateClass,
    activateUnit,
    activateLesson,
    activateSection,
    activateFullPath
  } = useLessonStore();

  const columns = useSectionContentColumns();
  const { onOpen } = useModal();

  React.useEffect(() => {
    activateLesson("");
    activateUnit("");
    activateClass("");
  }, []);

  console.log("activeLesson in section content container client", activeLesson);
  console.log("activateClass in section content container client", activateClass);
  console.log("activateUnit in section content container client", activateUnit);
  console.log("activateLesson in section content container client", activateLesson);
  console.log("activateSection in section content container client", activateSection);
  console.log("activateFullPath in section content container client", activateFullPath);

  const {
    data: sectionContentData,
    isLoading: sectionContentLoading,
    error: sectionContentError,
    refetch
  } = useGetSectionContentBySectionId(Number(activeLesson.sectionId));

  const processedData = React.useMemo(() => {
    // Chỉ hiển thị dữ liệu khi đã chọn section hợp lệ
    if (!activeLesson.sectionId) return [];
    if (!sectionContentData || !Array.isArray(sectionContentData)) return [];

    let filtered = [...sectionContentData];

    if (debouncedSearchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    if (orderFilter !== "all") {
      const orderValue = parseInt(orderFilter);
      filtered = filtered.filter((item) => item.order === orderValue);
    }

    const sorted = filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.order - b.order;
      } else if (sortOrder === "desc") {
        return b.order - a.order;
      } else {
        return a.order - b.order;
      }
    });

    return sorted;
  }, [activeLesson.sectionId, sectionContentData, debouncedSearchQuery, orderFilter, sortOrder]);

  // Khi thay đổi lớp, unit, bài học hoặc section: reset selection và bộ lọc
  React.useEffect(() => {
    setRowSelection({});
    setSearchQuery("");
    setOrderFilter("all");
    setSortOrder("default");
  }, [activeLesson.classId, activeLesson.unitId, activeLesson.lessonId, activeLesson.sectionId]);

  // Tự refetch khi chọn section mới
  React.useEffect(() => {
    if (activeLesson.sectionId) {
      refetch();
    }
  }, [activeLesson.sectionId, refetch]);

  React.useEffect(() => {
    if (sectionContentError) {
      handleError(
        sectionContentError,
        "SectionContentContainerClient",
        "data_fetching"
      );
    }
  }, [sectionContentError]);

  // Reset UI state whenever class/unit/lesson/section changes
  React.useEffect(() => {
    setRowSelection({});
    setSearchQuery("");
    setOrderFilter("all");
    setSortOrder("default");
  }, [activeLesson.classId, activeLesson.unitId, activeLesson.lessonId, activeLesson.sectionId]);

  // Refetch on section change when valid
  React.useEffect(() => {
    if (activeLesson.sectionId) {
      refetch();
    }
  }, [activeLesson.sectionId, refetch]);

  const handleModalOpen = (modalType: ModalType, options: ModalData = {}) => {
    try {
      onOpen(modalType, options);
    } catch (error) {
      handleError(error, "SectionContentContainerClient", `open_${modalType}`);
    }
  };

  const handleDeleteSection = () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedSections =
      processedData?.filter((sc) =>
        selectedIds.includes(sc.sc_id.toString())
      ) || [];

    handleModalOpen("deleteSectionContent", {
      sectionContentIds: selectedIds,
      sectionContents: selectedSections,
      onSuccess: () => {
        setRowSelection({});
        refetch();
      }
    });

    setRowSelection({});
  };
  const handleSelectClassroom = React.useCallback(
    (value: string) => {
      activateClass(value);
      activateUnit("");
      activateLesson("");
      setRowSelection({});
      setSearchQuery("");
      setOrderFilter("all");
      setSortOrder("default");

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
      activateSection("");
      setRowSelection({});

      if (value) {
        showToast.success(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Đã chọn unit!</p>
          </div>
        );
      }
    },
    [activateLesson, activateUnit]
  );

  const handleSelectLesson = React.useCallback(
    (value: string) => {
      activateLesson(value);
      setRowSelection({});

      if (value) {
        showToast.success(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Đã chọn bài học!</p>
          </div>
        );
      }
    },
    [activateLesson]
  );

  const handleSelectSection = React.useCallback(
    (value: string) => {
      activateSection(value);

      if (value) {
        showToast.success(
          <div className="flex flex-col gap-1">
            <p className="font-medium">Đã chọn bài học!</p>
            <p className="text-sm text-gray-600">
              Bạn có thể bắt đầu tạo section content cho bài học này.
            </p>
          </div>
        );
      }
    },
    [activateSection]
  );

  const searchComponent = (
    <div className="flex flex-col gap-4">
      {/* Selection filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
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
        {activeLesson.lessonId && activeLesson.unitId && activeLesson.classId && (
          <SectionsCombobox
            onSelect={handleSelectSection}
            placeholder="Chọn section..."
            lessonId={activeLesson.lessonId}
            buttonClassName="w-full sm:w-[250px]"
          />
        )}
      </div>
      
      {/* Data filters - only show when section is selected */}
      {activeLesson.sectionId && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
          <div className="w-full sm:w-[300px] relative">
            <Input
              placeholder="Tìm kiếm theo tên section content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Select value={sortOrder} onValueChange={setSortOrder} defaultValue="default">
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
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={processedData}
        columns={columns}
        isLoading={sectionContentLoading}
        searchComponent={searchComponent}
        actionButtons={
          <ActionButtons
            rowSelection={rowSelection}
            onDelete={handleDeleteSection}
            onExport={() => handleModalOpen("exportSectionContent")}
            onImport={() => handleModalOpen("importSectionContent")}
            onCreate={() =>
              handleModalOpen("createUpdateSectionContent", {
                formType: "create",
                sectionIds: Number(activeLesson.sectionId)
              })
            }
            selectedUnitId={activeLesson.unitId}
            selectedClassId={activeLesson.classId}
            selectedLessonId={activeLesson.lessonId}
            selectedSectionId={activeLesson.sectionId}
          />
        }
        // filterFunction={filterSchoolWeeks}
        enableRowSelection={true}
        getRowId={(row) => row.sc_id.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  );
}

export default SectionContentContainerClient;
