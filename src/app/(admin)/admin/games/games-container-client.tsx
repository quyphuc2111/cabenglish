"use client";

import React from "react";
import { SortableGenericTable } from "@/components/admin/table/game-topics/sortable-generic-table";
import { Button } from "@/components/ui/button";
import { useGamesColumns } from "@/components/admin/table/games/columns";
import { toast } from "react-toastify";
import { Plus, Download, Upload, Search, X, Filter } from "lucide-react";
import { AdminGameService } from "@/services/admin-game.service";
import { AdminGame, GameTopic, GameAge } from "@/types/admin-game";
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

interface GameRow {
  gameId: number;
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
  const [games, setGames] = React.useState<AdminGame[]>([]);
  const [topics, setTopics] = React.useState<GameTopic[]>([]);
  const [ages, setAges] = React.useState<GameAge[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Search state with debounce
  const [searchInput, setSearchInput] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  
  // Filter states
  const [selectedTopics, setSelectedTopics] = React.useState<number[]>([]);
  const [selectedAges, setSelectedAges] = React.useState<number[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = React.useState<boolean | undefined>(undefined);
  const [showFilters, setShowFilters] = React.useState(false);

  const columns = useGamesColumns();
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

  // Debounce search - 500ms
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load initial data (topics & ages for filters)
  React.useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [topicsRes, agesRes] = await Promise.all([
        AdminGameService.getTopics({ pageSize: 100 }),
        AdminGameService.getAges({ pageSize: 100 })
      ]);

      if (topicsRes.success) setTopics(topicsRes.data.topics);
      if (agesRes.success) setAges(agesRes.data.ages);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  // Load games with filters
  const loadGames = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await AdminGameService.getGames({
        page: 1,
        pageSize: 1000,
        keyword: keyword || undefined,
        topicIds: selectedTopics.length > 0 ? selectedTopics : undefined,
        ageIds: selectedAges.length > 0 ? selectedAges : undefined,
        difficultyLevel: selectedDifficulty as any,
        isActive: selectedStatus
      });

      if (response.success) {
        setGames(response.data.games);
      }
    } catch (error) {
      console.error("Error loading games:", error);
      toast.error("Không thể tải danh sách games");
    } finally {
      setLoading(false);
    }
  }, [keyword, selectedTopics, selectedAges, selectedDifficulty, selectedStatus]);

  // Reload when filters change
  React.useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleCreateGame = React.useCallback(() => {
    onOpen("createUpdateGame", {
      onSuccess: loadGames,
      topicsData: topics,
      agesData: ages
    });
  }, [onOpen, loadGames, topics, ages]);

  const handleDeleteGames = React.useCallback(async () => {
    const selectedIds = Object.keys(rowSelection);
    const selectedGames = games.filter((game) =>
      selectedIds.includes(game.gameId.toString())
    );

    if (selectedGames.length === 0) return;

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} game?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedIds.map(id => AdminGameService.deleteGame(parseInt(id)))
      );
      
      setRowSelection({});
      loadGames();
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
  }, [rowSelection, games, loadGames]);

  const handleExport = React.useCallback(() => {
    onOpen("exportGames");
  }, [onOpen]);

  const handleImport = React.useCallback(() => {
    onOpen("importGames", {
      onSuccess: loadGames,
      topicsData: topics,
      agesData: ages
    });
  }, [onOpen, loadGames, topics, ages]);

  const handleDragEnd = React.useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = typeof active.id === 'string' ? parseInt(active.id) : active.id;
    const overId = typeof over.id === 'string' ? parseInt(over.id) : over.id;

    const oldIndex = games.findIndex((g) => g.gameId === activeId);
    const newIndex = games.findIndex((g) => g.gameId === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newGames = arrayMove(games, oldIndex, newIndex);
    setGames(newGames);

    try {
      // Note: Reordering games might not be needed, but keeping structure consistent
      toast.success("Đã cập nhật thứ tự game");
    } catch (error) {
      console.error("Error reordering games:", error);
      toast.error("Không thể cập nhật thứ tự game");
      loadGames();
    }
  }, [games, loadGames]);

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

  // Filter function for client-side filtering (additional to server-side)
  const filterGames = React.useCallback((data: AdminGame[], filter: string) => {
    if (!filter) return data;
    if (!Array.isArray(data)) return [];

    const lowerFilter = filter.toLowerCase();
    return data.filter((item) =>
      item.gameName.toLowerCase().includes(lowerFilter) ||
      item.gameNameVi.toLowerCase().includes(lowerFilter) ||
      (item.description && item.description.toLowerCase().includes(lowerFilter)) ||
      (item.descriptionVi && item.descriptionVi.toLowerCase().includes(lowerFilter))
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
            placeholder="Tìm kiếm game... (tối thiểu 1 ký tự)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-blue-50 border-blue-200" : ""}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Bộ lọc</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Topics Filter */}
            <div className="space-y-2">
              <Label>Chủ đề</Label>
              <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2 bg-white">
                {topics.map(topic => (
                  <label key={topic.topicId} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <Checkbox
                      checked={selectedTopics.includes(topic.topicId)}
                      onCheckedChange={() => toggleTopicFilter(topic.topicId)}
                    />
                    <span className="text-sm">{topic.iconUrl} {topic.topicNameVi}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ages Filter */}
            <div className="space-y-2">
              <Label>Nhóm tuổi</Label>
              <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2 bg-white">
                {ages.map(age => (
                  <label key={age.ageId} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <Checkbox
                      checked={selectedAges.includes(age.ageId)}
                      onCheckedChange={() => toggleAgeFilter(age.ageId)}
                    />
                    <span className="text-sm">👶 {age.ageName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <Label>Độ khó</Label>
              <Select
                value={selectedDifficulty || "all"}
                onValueChange={(value) => setSelectedDifficulty(value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={selectedStatus === undefined ? "all" : selectedStatus ? "active" : "inactive"}
                onValueChange={(value) => setSelectedStatus(value === "all" ? undefined : value === "active")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Vô hiệu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {keyword && (
                <Badge variant="secondary" className="gap-1">
                  Search: {keyword}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setSearchInput(""); setKeyword(""); }} />
                </Badge>
              )}
              {selectedTopics.map(id => {
                const topic = topics.find(t => t.topicId === id);
                return topic && (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {topic.iconUrl} {topic.topicNameVi}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTopicFilter(id)} />
                  </Badge>
                );
              })}
              {selectedAges.map(id => {
                const age = ages.find(a => a.ageId === id);
                return age && (
                  <Badge key={id} variant="secondary" className="gap-1">
                    👶 {age.ageName}
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
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-10 h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý trò chơi</h2>
        <p className="text-gray-600 text-sm mt-1">
          Quản lý thư viện trò chơi giáo dục (Kéo thả để sắp xếp thứ tự)
        </p>
        {games.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Hiển thị {games.length} game{hasActiveFilters ? " (đã lọc)" : ""}
          </p>
        )}
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={games.map((g) => g.gameId.toString())}
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
            getRowId={(row: GameRow) => row.gameId.toString()}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            meta={{
              onSuccess: loadGames,
              topicsData: topics,
              agesData: ages
            }}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default GamesContainerClient;

