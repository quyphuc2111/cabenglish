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
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={onCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo mới Section Content
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

function SectionContentContainerClient() {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
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

  const {
    data: sectionContentData,
    isLoading: sectionContentLoading,
    error: sectionContentError
  } = useGetSectionContentBySectionId(Number(activeLesson.sectionId));

  React.useEffect(() => {
    if (sectionContentError) {
      handleError(
        sectionContentError,
        "SectionContentContainerClient",
        "data_fetching"
      );
    }
  }, [sectionContentError]);

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
      sectionContentData?.filter((sc) =>
        selectedIds.includes(sc.sc_id.toString())
      ) || [];

    handleModalOpen("deleteSectionContent", {
      sectionContentIds: selectedIds,
      sectionContents: selectedSections,
      onSuccess: () => setRowSelection({})
    });

    setRowSelection({});
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
  );

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={sectionContentData || []}
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
