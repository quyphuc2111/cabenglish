"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";
import { GenericTable } from "@/components/admin/table/common/generic-table";
import { Button } from "@/components/ui/button";
import { ModalData, ModalType, useModal } from "@/hooks/useModalStore";
import { Plus, Upload } from "lucide-react";
import { useNoti } from "@/hooks/useNoti";
import { useNotiColumns } from "@/components/admin/table/noti/columns";
import { NotiTypeCombobox } from "@/components/admin/combobox/notitype-combobox";
import { useNotiStore } from "@/store/useNoti";

// Xử lý lỗi
const handleError = (error: any, component: string, operation: string, extra?: Record<string, any>) => {
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
  selectedNotiType: string | null;
}

const ActionButtons = ({
  rowSelection,
  onDelete,
  onExport,
  onImport,
  onCreate,
  selectedNotiType
}: ActionButtonsProps) => (
  <>
    <div className="flex flex-row gap-4 items-center flex-wrap justify-end">
      <div className="flex flex-row gap-4 items-center justify-end flex-wrap">
        {!selectedNotiType ? (
          <p className="flex items-center text-gray-500 italic">
            Vui lòng chọn loại thông báo
          </p>
        ) : (
          <>
            {Object.keys(rowSelection).length > 0 && (
              <Button variant="destructive" onClick={onDelete}>
                Xóa ({Object.keys(rowSelection).length})
              </Button>
            )}
            <Button variant="outline" onClick={onImport}>
              <Upload className="w-4 h-4 mr-2" />
              Nhập dữ liệu
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={onCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo mới thông báo
            </Button>
          </>
        )}
      </div>
    </div>
  </>
);

function NotiContainerClient() {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const {selectedNotiType, setSelectedNotiType} = useNotiStore();

  const columns = useNotiColumns();
  const { onOpen } = useModal();

  const {
    data: notiData,
    isLoading: notiLoading,
    error: notiError
  } = useNoti();

  // Xử lý lỗi data fetching
  React.useEffect(() => {
    if (notiError) {
      handleError(notiError, "NotiContainerClient", "data_fetching");
    }
  }, [notiError]);

  const handleModalOpen = (modalType: ModalType, options: ModalData = {}) => {
    try {
      onOpen(modalType, options);
    } catch (error) {
      handleError(error, "NotiContainerClient", `open_${modalType}`);
    }
  };

  const handleDeleteNoti = () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedNotis = notiData?.data?.filter((noti) =>
      selectedIds.includes(noti.notificationId.toString())
    );

    handleModalOpen("deleteNoti", {
      notiIds: selectedIds,
      notis: selectedNotis,
      onSuccess: () => setRowSelection({})
    });

    setRowSelection({});
  };

  const handleSelectNotiType = React.useCallback((value: string) => {
    setSelectedNotiType(value);
  }, []);

  const filteredData = React.useMemo(() => {
    if (!notiData?.data) return [];
    if (!selectedNotiType) return [];

    return notiData.data.filter(
      (noti) => noti.ntId === Number(selectedNotiType)
    );
  }, [notiData?.data, selectedNotiType]);

  const searchComponent = (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
      <NotiTypeCombobox
        onSelect={handleSelectNotiType}
        placeholder="Tìm kiếm loại thông báo..."
        buttonClassName="w-full sm:w-[250px]"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <GenericTable
        data={filteredData}
        columns={columns}
        isLoading={notiLoading}
        searchComponent={searchComponent}
        actionButtons={
          <ActionButtons
            rowSelection={rowSelection}
            onDelete={handleDeleteNoti}
            onExport={() => handleModalOpen("exportNoti")}
            onImport={() => handleModalOpen("importNoti")}
            onCreate={() =>
              handleModalOpen("createUpdateNoti", {
                formType: "create"
              })
            }
            selectedNotiType={selectedNotiType}
          />
        }
        // filterFunction={filterSchoolWeeks}
        enableRowSelection={true}
        getRowId={(row) => row.notificationId.toString()}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  );
}

export default NotiContainerClient;
