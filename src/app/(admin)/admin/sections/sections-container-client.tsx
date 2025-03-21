"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useSchoolWeek } from "@/hooks/use-schoolweek";
import { ModalData, ModalType, useModal } from "@/hooks/useModalStore";
import { useSectionColumns } from "@/components/admin/table/sections/columns";
import { SchoolWeekCombobox } from "@/components/admin/combobox/schoolweek-combobox";
import { Download, Plus, Upload } from "lucide-react";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { UnitByClassCombobox } from "@/components/admin/combobox/unitbyclass-combobox";
import { showToast } from "@/utils/toast-config";
import { useUnitByClassId } from "@/hooks/use-units";
import { LessonCombobox } from "@/components/admin/combobox/lesson-combobox";
import { useGetSectionByLessonId } from "@/hooks/use-sections";
import { useLessonStore } from '@/store/use-lesson-store';

// Xử lý lỗi
const handleError = (
  error: any,
  component: string,
  operation: string,
  extra?: object
) => {
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
         <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={onCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo mới Section
        </Button>
        <div className="flex flex-row gap-4 items-center justify-end flex-wrap">
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
        </div>
       
       
      </div>
    )}
  </>
);

const fakeData = [
  {
    sectionId: 1,
    iconUrl: "string",
    sectionName: "string",
    estimateTime: "string",
    progress: 0.5,
    isLocked: true,
    order: 1
  },
  {
    sectionId: 2,
    iconUrl: "string",
    sectionName: "string",
    estimateTime: "string",
    progress: 1,
    isLocked: true,
    order: 2
  },
  {
    sectionId: 3,
    iconUrl: "string",
    sectionName: "string",
    estimateTime: "string",
    progress: 0,
    isLocked: true,
    order: 3
  },
  {
    sectionId: 4,
    iconUrl: "string",
    sectionName: "string",
    estimateTime: "string",
    progress: 0.5,
    isLocked: true,
    order: 1
  },
  {
    sectionId: 5,
    iconUrl: "string",
    sectionName: "string",
    estimateTime: "string",
    progress: 0.2,
    isLocked: true,
    order: 2
  },
  {
    sectionId: 6,
    iconUrl: "string",
    sectionName: "string",
    estimateTime: "string",
    progress: 0.8,
    isLocked: true,
    order: 3
  }
];

function SectionsContainerClient() {
  const [selectedWeekId, setSelectedWeekId] = React.useState<string | null>(
    null
  );
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedClassId, setSelectedClassId] = React.useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = React.useState<string>("");
  const { selectedLessonId, setSelectedLessonId } = useLessonStore();

  const columns = useSectionColumns();
  const { onOpen } = useModal();

  const { data, isLoading, error } = useSchoolWeek();
  const { data: unitData, isLoading: unitLoading } =
    useUnitByClassId(selectedClassId);
  const { data: sectionData, isLoading: sectionLoading } =
    useGetSectionByLessonId(Number(selectedLessonId));

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

  const handleDeleteSection = () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedSections = sectionData.filter((section) =>
      selectedIds.includes(section.sectionId.toString())
    );

    handleModalOpen("deleteSection", {
      sectionIds: selectedIds,
      sections: selectedSections,
      onSuccess: () => setRowSelection({})
    });

    setRowSelection({});
  };

  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];

    let filtered = [...data.data];
    if (!selectedWeekId) return filtered;

    return filtered.filter((week) => week.swId === Number(selectedWeekId));
  }, [data?.data, selectedWeekId]);

  // const filterSchoolWeeks = React.useCallback((schoolWeek: any, searchQuery: string) => {
  //   if (!searchQuery) return true;
  //   const searchTerm = searchQuery.toLowerCase().trim();
  //   console.log("searchTermsearchTerm", searchTerm);
  //   return (
  //     // schoolWeek.swId.toString().includes(searchTerm) ||
  //     schoolWeek.value.toLowerCase().includes(searchTerm)
  //   );
  // }, []);

  const handleSelectClassroom = React.useCallback((value: string) => {
    setSelectedClassId(value);
    // Reset selectedUnitId khi đổi lớp học
    setSelectedUnitId("");
    setSelectedLessonId("");

    if (value) {
      showToast.success(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Đã chọn lớp học!</p>
        </div>
      );
    }
  }, []);

  const handleSelectUnit = React.useCallback((value: string) => {
    setSelectedUnitId(value);
    setSelectedLessonId("");

    if (value) {
      showToast.success(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Đã chọn unit!</p>
        </div>
      );
    }
  }, []);

  const handleSelectLesson = React.useCallback((value: string) => {
    setSelectedLessonId(value);
    
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
  }, [setSelectedLessonId]);

  const searchComponent = (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
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
      {selectedUnitId && selectedClassId && (
        <LessonCombobox
          onSelect={handleSelectLesson}
          placeholder="Chọn bài học..."
          unitId={selectedUnitId}
          classId={selectedClassId}
          buttonClassName="w-full sm:w-[250px]"
        />
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={sectionData || []}
        columns={columns}
        isLoading={isLoading}
        searchComponent={searchComponent}
        actionButtons={
          <ActionButtons
            rowSelection={rowSelection}
            onDelete={handleDeleteSection}
            onExport={() => handleModalOpen("exportSection")}
            onImport={() => handleModalOpen("importSection")}
            onCreate={() =>
              handleModalOpen("createUpdateSection", {
                formType: "create",
                lessonIds: Number(selectedLessonId)
              })
            }
            selectedUnitId={selectedUnitId}
            selectedClassId={selectedClassId}
            selectedLessonId={selectedLessonId}
          />
        }
        // filterFunction={filterSchoolWeeks}
        enableRowSelection={true}
        getRowId={(row) => row.sectionId.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  );
}

export default SectionsContainerClient;
