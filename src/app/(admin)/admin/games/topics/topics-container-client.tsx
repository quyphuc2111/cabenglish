"use client";

import React from "react";
import { SortableGenericTable } from "@/components/admin/table/game-topics/sortable-generic-table";
import { Button } from "@/components/ui/button";
import { useGameTopicsColumns } from "@/components/admin/table/game-topics/columns";
import { toast } from "react-toastify";
import { Plus, Download, Upload, Search } from "lucide-react";
import { AdminGameService } from "@/services/admin-game.service";
import { GameTopic } from "@/types/admin-game";
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

interface TopicRow {
  topicId: number;
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
      className="bg-blue-500 hover:bg-blue-600 text-white w-full xl:w-auto"
      onClick={onCreate}
    >
      <Plus className="w-4 h-4 mr-2" />
      Tạo chủ đề mới
    </Button>
    <div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto">
      <Button variant="outline" onClick={onExport}>
        <Download className="w-4 h-4 mr-2" />
        Xuất dữ liệu
      </Button>
      <Button variant="outline" onClick={onImport}>
        <Upload className="w-4 h-4 mr-2" />
        Nhập dữ liệu
      </Button>
      {Object.keys(rowSelection).length > 0 && onDelete && (
        <Button variant="destructive" onClick={onDelete}>
          Xóa ({Object.keys(rowSelection).length})
        </Button>
      )}
    </div>
  </div>
);

function TopicsContainerClient() {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [topics, setTopics] = React.useState<GameTopic[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [keyword, setKeyword] = React.useState("");

  const columns = useGameTopicsColumns();
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

  // Load topics
  const loadTopics = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await AdminGameService.getTopics({
        page: 1,
        pageSize: 1000, // Load all for client-side filtering
        keyword: keyword || undefined
      });

      if (response.success) {
        setTopics(response.data.topics);
      }
    } catch (error) {
      console.error("Error loading topics:", error);
      toast.error("Không thể tải danh sách chủ đề");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  // Load topics on mount and when keyword changes
  React.useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const handleCreateTopic = React.useCallback(() => {
    onOpen("createUpdateGameTopic", {
      onSuccess: loadTopics
    });
  }, [onOpen, loadTopics]);

  const handleDeleteTopics = React.useCallback(async () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedTopics = topics.filter((topic) =>
      selectedIds.includes(topic.topicId.toString())
    );

    if (selectedTopics.length === 0) return;

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} chủ đề?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedIds.map(id => AdminGameService.deleteTopic(parseInt(id)))
      );
      
      setRowSelection({});
      loadTopics();
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Xóa chủ đề thành công!</p>
          <p className="text-sm text-gray-600">
            Đã xóa {selectedIds.length} chủ đề.
          </p>
        </div>
      );
    } catch (error) {
      console.error("Error deleting topics:", error);
      toast.error("Có lỗi xảy ra khi xóa chủ đề");
    }
  }, [rowSelection, topics, loadTopics]);

  const handleExport = React.useCallback(() => {
    onOpen("exportGameTopics");
  }, [onOpen]);

  const handleImport = React.useCallback(() => {
    onOpen("importGameTopics", {
      onSuccess: loadTopics
    });
  }, [onOpen, loadTopics]);

  const handleDragEnd = React.useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Convert IDs back to numbers for comparison
    const activeId = typeof active.id === 'string' ? parseInt(active.id) : active.id;
    const overId = typeof over.id === 'string' ? parseInt(over.id) : over.id;

    const oldIndex = topics.findIndex((t) => t.topicId === activeId);
    const newIndex = topics.findIndex((t) => t.topicId === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI
    const newTopics = arrayMove(topics, oldIndex, newIndex);
    
    // Recalculate order for all items
    const updatedTopics = newTopics.map((topic, index) => ({
      ...topic,
      order: index + 1
    }));
    
    setTopics(updatedTopics);

    try {
      // Call API to update order
      const reorderItems = updatedTopics.map((topic) => ({
        id: topic.topicId,
        order: topic.order
      }));

      await AdminGameService.reorderTopics(reorderItems);
      
      toast.success("Đã cập nhật thứ tự chủ đề");
    } catch (error) {
      console.error("Error reordering topics:", error);
      toast.error("Không thể cập nhật thứ tự chủ đề");
      // Rollback on error
      loadTopics();
    }
  }, [topics, loadTopics]);

  const filterTopics = React.useCallback((data: GameTopic[], filter: string) => {
    if (!filter) return data;
    if (!Array.isArray(data)) return [];

    const lowerFilter = filter.toLowerCase();
    return data.filter((item) =>
      item.topicName.toLowerCase().includes(lowerFilter) ||
      item.topicNameVi.toLowerCase().includes(lowerFilter) ||
      (item.description && item.description.toLowerCase().includes(lowerFilter))
    );
  }, []);

  const searchComponent = (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Tìm kiếm chủ đề..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="pl-10"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý chủ đề trò chơi</h2>
        <p className="text-gray-600 text-sm mt-1">
          Quản lý các chủ đề cho thư viện trò chơi (Kéo thả để sắp xếp thứ tự)
        </p>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={topics.map((t) => t.topicId.toString())}
          strategy={verticalListSortingStrategy}
        >
          <SortableGenericTable
            data={topics as any}
            columns={columns as any}
            isLoading={loading}
            searchComponent={searchComponent}
            actionButtons={
              <ActionButtons
                rowSelection={rowSelection}
                onDelete={handleDeleteTopics}
                onExport={handleExport}
                onImport={handleImport}
                onCreate={handleCreateTopic}
              />
            }
            filterFunction={filterTopics as any}
            enableRowSelection={true}
            getRowId={(row: TopicRow) => row.topicId.toString()}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            meta={{
              onSuccess: loadTopics
            }}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default TopicsContainerClient;

