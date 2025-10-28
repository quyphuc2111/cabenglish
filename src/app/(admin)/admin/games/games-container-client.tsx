"use client";

import React from "react";
import { SortableGenericTable } from "@/components/admin/table/game-topics/sortable-generic-table";
import { Button } from "@/components/ui/button";
import { useGamesColumns } from "@/components/admin/table/games/columns";
import { toast } from "react-toastify";
import { Plus, Download, Upload, Search, X, Filter } from "lucide-react";
import { Game } from "@/types/admin-game";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetGames, useDeleteGames, useReorderGames } from "@/hooks/use-game";
import { useGetTopics } from "@/hooks/use-topics";
import { useGetAges } from "@/hooks/use-ages";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

interface GameRow {
  game_id: number;
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
      Tạo game mới
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

function GamesContainerClient() {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10); // Default page size
  
  // Search state with debounce
  const [searchInput, setSearchInput] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  
  // Filter states
  const [selectedTopics, setSelectedTopics] = React.useState<number[]>([]);
  const [selectedAges, setSelectedAges] = React.useState<number[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<"easy" | "medium" | "hard" | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = React.useState<boolean | undefined>(undefined);
  const [openFilterSheet, setOpenFilterSheet] = React.useState(false);
  
  // Loading states for individual rows
  const [loadingRows, setLoadingRows] = React.useState<Set<number>>(new Set());
  const [loadingTrigger, setLoadingTrigger] = React.useState(0);

  // Force table re-render when loadingRows changes
  React.useEffect(() => {
    console.log("🔄 LoadingRows changed:", Array.from(loadingRows));
    setLoadingTrigger(prev => prev + 1);
  }, [loadingRows]);

  const columns = useGamesColumns();
  const { onOpen } = useModal();

  // React Query hooks with dynamic pageSize (server-side pagination)
  const { data: gamesData, isLoading: loading, refetch: refetchGames } = useGetGames({
    page: page,
    pageSize: pageSize,
    keyword: keyword || undefined,
    topicIds: selectedTopics.length > 0 ? selectedTopics : undefined,
    ageIds: selectedAges.length > 0 ? selectedAges : undefined,
    difficultyLevel: selectedDifficulty,
    isActive: selectedStatus,
    sortBy: "order",
    sortOrder: "asc"
  });

  const { data: topicsData } = useGetTopics({ page: 1, pageSize: 100 });
  const { data: agesData } = useGetAges({ page: 1, pageSize: 100 });

  const deleteGamesMutation = useDeleteGames();
  const reorderGamesMutation = useReorderGames();

  // Extract data from React Query responses
  const games = gamesData?.data || [];
  const topics = topicsData?.data || [];
  const ages = agesData?.data || [];

  // Memoize meta để table re-render khi loadingRows thay đổi
  const tableMeta = React.useMemo(() => ({
    onSuccess: refetchGames,
    topicsData: topics,
    agesData: ages,
    loadingRows: loadingRows,
    setLoadingRows: setLoadingRows,
    _trigger: loadingTrigger // Force re-render trigger
  }), [refetchGames, topics, ages, loadingRows, loadingTrigger]);

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

  // Debounce search - 500ms
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setPage(1); // Reset về trang 1 khi search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset về trang 1 khi filters thay đổi
  React.useEffect(() => {
    setPage(1);
  }, [selectedTopics, selectedAges, selectedDifficulty, selectedStatus]);

  const handleCreateGame = React.useCallback(() => {
    onOpen("createUpdateGame", {
      ...tableMeta,
      onSuccess: refetchGames
    });
  }, [onOpen, refetchGames, tableMeta]);

  const handleDeleteGames = React.useCallback(async () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedGames = games.filter((game) =>
      selectedIds.includes(game.game_id.toString())
    );

    if (selectedGames.length === 0) return;

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} game?`)) {
      return;
    }

    try {
      await deleteGamesMutation.mutateAsync(selectedIds.map(id => parseInt(id)));
      
      setRowSelection({});
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-medium">Xóa game thành công!</p>
          <p className="text-sm text-gray-600">
            Đã xóa {selectedIds.length} game.
          </p>
        </div>
      );
    } catch (error) {
      console.error("Error deleting games:", error);
      toast.error("Có lỗi xảy ra khi xóa game");
    }
  }, [rowSelection, games, deleteGamesMutation]);

  const handleImport = React.useCallback(() => {
    onOpen("importGames", {
      ...tableMeta,
      onSuccess: refetchGames
    });
  }, [onOpen, refetchGames, tableMeta]);

  const handleDragEnd = React.useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = typeof active.id === 'string' ? parseInt(active.id) : active.id;
    const overId = typeof over.id === 'string' ? parseInt(over.id) : over.id;

    const oldIndex = games.findIndex((g) => g.game_id === activeId);
    const newIndex = games.findIndex((g) => g.game_id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newGames = arrayMove(games, oldIndex, newIndex);
    
    // Update order for reordering
    const reorderItems = newGames.map((game, index) => ({
      game_id: game.game_id,
      order: index + 1
    }));

    try {
      await reorderGamesMutation.mutateAsync(reorderItems);
      toast.success("Đã cập nhật thứ tự game");
    } catch (error) {
      console.error("Error reordering games:", error);
      toast.error("Không thể cập nhật thứ tự game");
    }
  }, [games, reorderGamesMutation]);

  // Clear all filters
  const handleClearFilters = React.useCallback(() => {
    setSearchInput("");
    setKeyword("");
    setSelectedTopics([]);
    setSelectedAges([]);
    setSelectedDifficulty(undefined);
    setSelectedStatus(undefined);
  }, []);

  // Check if any filter is active
  const hasActiveFilters = keyword || selectedTopics.length > 0 || selectedAges.length > 0 || selectedDifficulty || selectedStatus !== undefined;

  const handleExport = React.useCallback(() => {
    // Get selected games
    const selected = games.filter((game) => 
      Object.keys(rowSelection).includes(game.game_id.toString())
    );

    // Pass filter params to export modal
    onOpen("exportGames", {
      selectedGames: selected,
      filterParams: {
        keyword: keyword || undefined,
        topicIds: selectedTopics.length > 0 ? selectedTopics : undefined,
        ageIds: selectedAges.length > 0 ? selectedAges : undefined,
        difficultyLevel: selectedDifficulty,
        isActive: selectedStatus as boolean | undefined,
        sortBy: "order",
        sortOrder: "asc"
      },
      hasFilters: Boolean(hasActiveFilters)
    });
  }, [onOpen, games, rowSelection, keyword, selectedTopics, selectedAges, selectedDifficulty, selectedStatus, hasActiveFilters]);

  // Filter function for client-side filtering (additional to server-side)
  const filterGames = React.useCallback((data: Game[], filter: string) => {
    if (!filter) return data;
    if (!Array.isArray(data)) return [];

    const lowerFilter = filter.toLowerCase();
    return data.filter((item) =>
      item.game_name.toLowerCase().includes(lowerFilter) ||
      item.game_name_vi.toLowerCase().includes(lowerFilter) ||
      (item.description && item.description.toLowerCase().includes(lowerFilter))
    );
  }, []);

  // Toggle topic filter
  const toggleTopicFilter = (topicId: number) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Toggle age filter
  const toggleAgeFilter = (ageId: number) => {
    setSelectedAges(prev => 
      prev.includes(ageId) 
        ? prev.filter(id => id !== ageId)
        : [...prev, ageId]
    );
  };

  const searchComponent = (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm game... "
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setOpenFilterSheet(true)}
          className={hasActiveFilters ? "bg-blue-50 border-blue-200" : ""}
        >
          <Filter className="w-4 h-4 mr-2" />
          Bộ lọc
          {hasActiveFilters && (
            <Badge className="ml-2 h-5 px-1.5 bg-blue-500">
              {[
                selectedTopics.length,
                selectedAges.length,
                selectedDifficulty ? 1 : 0,
                selectedStatus !== undefined ? 1 : 0
              ].reduce((a, b) => a + b, 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {keyword && (
            <Badge variant="secondary" className="gap-1">
              Search: {keyword}
              <X className="w-3 h-3 cursor-pointer" onClick={() => { setSearchInput(""); setKeyword(""); }} />
            </Badge>
          )}
          {selectedTopics.map(id => {
            const topic = topics.find(t => t.topic_id === id);
            return topic && (
              <Badge key={id} variant="secondary" className="gap-1">
                {topic.icon_url} {topic.topic_name_vi}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTopicFilter(id)} />
              </Badge>
            );
          })}
          {selectedAges.map(id => {
            const age = ages.find(a => a.age_id === id);
            return age && (
              <Badge key={id} variant="secondary" className="gap-1">
                👶 {age.age_name}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleAgeFilter(id)} />
              </Badge>
            );
          })}
          {selectedDifficulty && (
            <Badge variant="secondary" className="gap-1">
              Độ khó: {selectedDifficulty === "easy" ? "Dễ" : selectedDifficulty === "medium" ? "Trung bình" : "Khó"}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDifficulty(undefined)} />
            </Badge>
          )}
          {selectedStatus !== undefined && (
            <Badge variant="secondary" className="gap-1">
              {selectedStatus ? "Hoạt động" : "Vô hiệu"}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStatus(undefined)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg p-10 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quản lý trò chơi</h2>
          <p className="text-gray-600 text-sm mt-1">
            Quản lý thư viện trò chơi giáo dục (Kéo thả để sắp xếp thứ tự)
          </p>
          {gamesData && (
            <p className="text-sm text-gray-500 mt-1">
              Hiển thị {games.length} / {gamesData.totalCount} game
              {hasActiveFilters && " (đã lọc)"}
              {gamesData.totalPages > 1 && ` - Trang ${page}/${gamesData.totalPages}`}
            </p>
          )}
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={games.map((g) => g.game_id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <SortableGenericTable
              data={games as any}
              columns={columns as any}
              isLoading={loading}
              searchComponent={searchComponent}
              actionButtons={
                <ActionButtons
                  rowSelection={rowSelection}
                  onDelete={handleDeleteGames}
                  onExport={handleExport}
                  onImport={handleImport}
                  onCreate={handleCreateGame}
                />
              }
              filterFunction={filterGames as any}
              enableRowSelection={true}
              getRowId={(row: GameRow) => row.game_id.toString()}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              serverPagination={{
                currentPage: page,
                pageSize: pageSize,
                totalPages: gamesData?.totalPages || 1,
                totalItems: gamesData?.totalCount || 0,
                onPageChange: setPage,
                onPageSizeChange: (newSize) => {
                  setPageSize(newSize);
                  setPage(1); // Reset to page 1 when changing page size
                }
              }}
              meta={tableMeta}
            />
          </SortableContext>
        </DndContext>
      </div>

      {/* Filter Sheet */}
      <Sheet open={openFilterSheet} onOpenChange={setOpenFilterSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Bộ lọc nâng cao</SheetTitle>
            <SheetDescription>
              Tùy chỉnh bộ lọc để tìm kiếm game phù hợp
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Topics Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Chủ đề</Label>
                {selectedTopics.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTopics([])}
                    className="h-7 text-xs text-red-600 hover:text-red-700"
                  >
                    Xóa ({selectedTopics.length})
                  </Button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                {topics.map(topic => (
                  <label 
                    key={topic.topic_id} 
                    className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                  >
                    <Checkbox
                      checked={selectedTopics.includes(topic.topic_id)}
                      onCheckedChange={() => toggleTopicFilter(topic.topic_id)}
                    />
                    <span className="text-sm flex-1">
                      <span className="mr-2">{topic.icon_url}</span>
                      {topic.topic_name_vi}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ages Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Nhóm tuổi</Label>
                {selectedAges.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAges([])}
                    className="h-7 text-xs text-red-600 hover:text-red-700"
                  >
                    Xóa ({selectedAges.length})
                  </Button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                {ages.map(age => (
                  <label 
                    key={age.age_id} 
                    className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                  >
                    <Checkbox
                      checked={selectedAges.includes(age.age_id)}
                      onCheckedChange={() => toggleAgeFilter(age.age_id)}
                    />
                    <span className="text-sm flex-1">
                      <span className="mr-2">👶</span>
                      {age.age_name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Độ khó</Label>
              <Select
                value={selectedDifficulty || "all"}
                onValueChange={(value) => setSelectedDifficulty(value === "all" ? undefined : value as "easy" | "medium" | "hard")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn độ khó" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="easy">🟢 Dễ</SelectItem>
                  <SelectItem value="medium">🟡 Trung bình</SelectItem>
                  <SelectItem value="hard">🔴 Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Trạng thái</Label>
              <Select
                value={selectedStatus === undefined ? "all" : selectedStatus ? "active" : "inactive"}
                onValueChange={(value) => setSelectedStatus(value === "all" ? undefined : value === "active")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">✅ Hoạt động</SelectItem>
                  <SelectItem value="inactive">❌ Vô hiệu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1"
              disabled={!hasActiveFilters}
            >
              <X className="w-4 h-4 mr-2" />
              Xóa tất cả
            </Button>
            <Button
              onClick={() => setOpenFilterSheet(false)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Áp dụng
              {hasActiveFilters && (
                <Badge className="ml-2 bg-white text-blue-600">
                  {[
                    selectedTopics.length,
                    selectedAges.length,
                    selectedDifficulty ? 1 : 0,
                    selectedStatus !== undefined ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default GamesContainerClient;

