"use client";

import React from "react";
import { SortableGenericTable } from "@/components/admin/table/game-topics/sortable-generic-table";
import { Button } from "@/components/ui/button";
import { useGameAgesColumns } from "@/components/admin/table/game-ages/columns";
import { toast } from "react-toastify";
import { Plus, Download, Upload, Search } from "lucide-react";
import { getAllAges, deleteAges, reorderAges } from "@/app/api/actions/age";
import { GameAge } from "@/types/admin-game";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModalStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface AgeRow {
  age_id: number;
}

interface ActionButtonsProps {
  onDelete?: () => void;
  onExport: () => void;
  onImport: () => void;
  onCreate: () => void;
  rowSelection: Record<string, boolean>;
}

const ActionButtons = ({
  rowSelection,
  onDelete,
  onExport,
  onImport,
  onCreate
}: ActionButtonsProps) => (
  <div className="flex flex-col gap-4 items-end flex-wrap justify-end w-full xl:w-auto">
    <Button
      className="bg-purple-500 hover:bg-purple-600 text-white w-full xl:w-auto"
      onClick={onCreate}
    >
      <Plus className="w-4 h-4 mr-2" />
      Tạo nhóm tuổi mới
    </Button>
  </div>
);

function AgesContainerClient() {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [ages, setAges] = React.useState<GameAge[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [keyword, setKeyword] = React.useState("");

  const columns = useGameAgesColumns();
  const { onOpen } = useModal();

  // Drag & drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load ages
  const loadAges = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllAges({
        page: 1,
        pageSize: 100, // Max allowed by backend
        keyword: keyword || undefined
      });

      if (response.data) {
        setAges(response.data);
      }
    } catch (error) {
      console.error("Error loading ages:", error);
      const errorMessage = error instanceof Error ? error.message : "Không thể tải danh sách nhóm tuổi";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  // Load ages on mount and when keyword changes
  React.useEffect(() => {
    loadAges();
  }, [loadAges]);

  const handleCreateAge = React.useCallback(() => {
    onOpen("createUpdateGameAge", {
      onSuccess: loadAges
    });
  }, [onOpen, loadAges]);

  const handleDeleteAges = React.useCallback(async () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedAges = ages.filter((age) =>
      selectedIds.includes(age.age_id.toString())
    );

    if (selectedAges.length === 0) return;

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} nhóm tuổi?`)) {
      return;
    }

    try {
      // Xóa nhiều ages trong 1 request
      await deleteAges(selectedIds.map(id => parseInt(id)));
      
      setRowSelection({});
      loadAges();
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Xóa nhóm tuổi thành công!</p>
          <p className="text-sm text-gray-600">
            Đã xóa {selectedIds.length} nhóm tuổi.
          </p>
        </div>
      );
    } catch (error) {
      console.error("Error deleting ages:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa nhóm tuổi";
      toast.error(errorMessage);
    }
  }, [rowSelection, ages, loadAges]);

  const handleExport = React.useCallback(() => {
    onOpen("exportGameAges");
  }, [onOpen]);

  const handleImport = React.useCallback(() => {
    onOpen("importGameAges", {
      onSuccess: loadAges
    });
  }, [onOpen, loadAges]);

  const handleDragEnd = React.useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Convert IDs back to numbers for comparison
    const activeId = typeof active.id === 'string' ? parseInt(active.id) : active.id;
    const overId = typeof over.id === 'string' ? parseInt(over.id) : over.id;

    const oldIndex = ages.findIndex((a) => a.age_id === activeId);
    const newIndex = ages.findIndex((a) => a.age_id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI
    const newAges = arrayMove(ages, oldIndex, newIndex);
    
    // Recalculate order for all items
    const updatedAges = newAges.map((age, index) => ({
      ...age,
      order: index + 1
    }));
    
    setAges(updatedAges);

    try {
      // Call API to update order
      const reorderItems = updatedAges.map((age) => ({
        age_id: age.age_id,
        order: age.order
      }));

      await reorderAges(reorderItems);
      
      toast.success("Đã cập nhật thứ tự nhóm tuổi");
    } catch (error) {
      console.error("Error reordering ages:", error);
      const errorMessage = error instanceof Error ? error.message : "Không thể cập nhật thứ tự nhóm tuổi";
      toast.error(errorMessage);
      // Rollback on error
      loadAges();
    }
  }, [ages, loadAges]);

  const filterAges = React.useCallback((data: GameAge[], filter: string) => {
    if (!filter) return data;
    if (!Array.isArray(data)) return [];

    const lowerFilter = filter.toLowerCase();
    return data.filter((item) =>
      item.age_name.toLowerCase().includes(lowerFilter) ||
      item.age_name_en.toLowerCase().includes(lowerFilter) ||
      (item.description && item.description.toLowerCase().includes(lowerFilter))
    );
  }, []);

  const searchComponent = (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Tìm kiếm nhóm tuổi..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="pl-10"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý nhóm tuổi trò chơi</h2>
        <p className="text-gray-600 text-sm mt-1">
          Quản lý các nhóm tuổi phù hợp cho trò chơi (Kéo thả để sắp xếp thứ tự)
        </p>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ages.map((a) => a.age_id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <SortableGenericTable
            data={ages as any}
            columns={columns as any}
            isLoading={loading}
            searchComponent={searchComponent}
            actionButtons={
              <ActionButtons
                rowSelection={rowSelection}
                onDelete={handleDeleteAges}
                onExport={handleExport}
                onImport={handleImport}
                onCreate={handleCreateAge}
              />
            }
            filterFunction={filterAges as any}
            enableRowSelection={true}
            getRowId={(row: AgeRow) => row.age_id.toString()}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            meta={{
              onSuccess: loadAges
            }}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default AgesContainerClient;

