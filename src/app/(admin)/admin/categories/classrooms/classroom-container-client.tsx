"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";
import { ClassroomCombobox } from "@/components/admin/combobox/classroom-combobox";
import { useClassroomColumns } from "@/components/admin/table/classroom-table/columns";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { useClassrooms } from "@/hooks/use-classrooms";
import { useModal } from "@/hooks/useModalStore";
import { Download, Upload } from "lucide-react";

function ClassroomContainerClient() {
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null);

  const { data, isLoading, error } = useClassrooms();
  const columns = useClassroomColumns();
  const { onOpen } = useModal();
  
  // Theo dõi lỗi từ data fetching
  React.useEffect(() => {
    if (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'ClassroomContainerClient',
          operation: 'data_fetching'
        }
      });
    }
  }, [error]);

  const handleCreateClassroom = () => {
    try {
      onOpen("createUpdateClassroom", { formType: "create" });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'ClassroomContainerClient',
          operation: 'create_classroom'
        }
      });
    }
  };

  const handleImportClassroom = () => {
    try {
      onOpen("importClassroom");
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'ClassroomContainerClient',
          operation: 'import_classroom'
        }
      });
    }
  };

  const handleExportClassroom = () => {
    try {
      onOpen("exportClassroom");
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'ClassroomContainerClient',
          operation: 'export_classroom'
        }
      });
    }
  };

  const filteredData = React.useMemo(() => {
    if (!data?.data) return [];
    
    let filtered = [...data.data];
    
    if (selectedClassId) {
      filtered = filtered.filter((classroom) => classroom.class_id === Number(selectedClassId));
    }

    return filtered;
  }, [data?.data, selectedClassId]);

  // const filterClassrooms = (classroom: any, searchQuery: string) => {
  //   return classroom.class_id === Number(searchQuery);
  // };

  const handleSelectClassroom = (value: string) => {
    try {
      setSelectedClassId(value);
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'ClassroomContainerClient',
          operation: 'select_classroom'
        },
        extra: {
          selectedValue: value
        }
      });
    }
  };

  const filterClassrooms = React.useCallback((classroom: any, searchQuery: string) => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase().trim();
    return (
      classroom.class_id.toString().toLowerCase().includes(searchTerm)
    );
  }, []);

  const actionButtons = (
    <>
      <Button variant="outline" onClick={handleExportClassroom}>
        <Download className="w-4 h-4 mr-2" />
        Xuất dữ liệu
      </Button>
      <Button variant="outline" onClick={handleImportClassroom}>
        <Upload className="w-4 h-4 mr-2" />
        Nhập dữ liệu
      </Button>
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleCreateClassroom}
      >
        Tạo mới lớp học
      </Button>
    </>
  );

  const searchComponent = (
    <ClassroomCombobox onSelect={handleSelectClassroom} placeholder="Tìm kiếm lớp học..." />
  );
  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        searchComponent={searchComponent}
        actionButtons={actionButtons}
        filterFunction={filterClassrooms}
      />
    </div>
  );
}

export default ClassroomContainerClient;
