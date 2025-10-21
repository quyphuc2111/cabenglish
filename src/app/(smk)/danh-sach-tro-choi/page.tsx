"use client";

import { useState, useEffect } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import GameCard from "@/components/games/game-card";
import GameFilters from "@/components/games/game-filters";
import GamePagination from "@/components/games/game-pagination";
import { ActiveFilterBadges } from "@/components/games/active-filter-badges";
import { GamePerformanceManager } from "@/components/games/game-performance-manager";
import { GameProgress } from "@/components/games/game-progress";
import { GamePlayerModal } from "@/components/games/game-player-modal";
import { GameService } from "@/services/game.service";
import { Game } from "@/types/game";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function ListOfGamesPage() {
  const { t } = useTranslation();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
  
  // Game player modal
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  // Progress tracking
  const [progress, setProgress] = useState({
    playedCount: 0,
    totalCount: 0,
    percentage: 0
  });
  const [filteredProgress, setFilteredProgress] = useState({
    playedCount: 0,
    totalCount: 0,
    percentage: 0
  });
  
  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [ageGroup, setAgeGroup] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // User age (you can get this from user context/session)
  const userAge = 5; // Example age

  // Topics list for badges
  const topicsList = [
    { value: "Animals", label: "Động vật", emoji: "🐾" },
    { value: "Numbers", label: "Số học", emoji: "🔢" },
    { value: "Colors", label: "Màu sắc", emoji: "🎨" },
    { value: "Alphabet", label: "Chữ cái", emoji: "🔤" },
    { value: "Shapes", label: "Hình khối", emoji: "⭐" },
    { value: "Music", label: "Âm nhạc", emoji: "🎵" },
    { value: "Logic", label: "Logic", emoji: "🧩" },
    { value: "Memory", label: "Trí nhớ", emoji: "🧠" }
  ];

  // Load topic counts and initial progress on mount
  useEffect(() => {
    const loadInitialData = async () => {
      const counts = await GameService.getTopicCounts();
      setTopicCounts(counts);
      
      // Load overall progress
      await loadProgress();
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    loadGames();
    // Load filtered progress when topics change
    if (selectedTopics.length > 0) {
      loadProgress(selectedTopics);
    }
  }, [currentPage, ageGroup, selectedTopics, search]);

  const loadGames = async () => {
    setLoading(true);
    try {
      const response = await GameService.getGames({
        page: currentPage,
        pageSize,
        ageGroup: ageGroup || undefined,
        topic: selectedTopics.length > 0 ? selectedTopics : undefined,
        search: search || undefined
      });

      if (response.success) {
        setGames(response.data.games);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.error("Error loading games:", error);
      toast.error("Không thể tải danh sách game");
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async (topics?: string[]) => {
    try {
      const response = await GameService.getProgress(
        topics && topics.length > 0 ? { topics } : undefined
      );

      if (response.success) {
        if (topics && topics.length > 0) {
          setFilteredProgress(response.data);
        } else {
          setProgress(response.data);
        }
      }
    } catch (error) {
      console.error("Error loading progress:", error);
      toast.error("Không thể tải tiến độ");
    }
  };

  const handleLike = async (gameId: number, isLiked: boolean) => {
    try {
      await GameService.toggleLike(gameId);
      // Optionally refresh the games list or update state
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleGameClick = async (game: Game) => {
    // Mark as played if not already
    if (!game.isPlayedByUser) {
      try {
        await GameService.markAsPlayed(game.gameId);
        
        // Reload progress after marking as played
        await loadProgress();
        if (selectedTopics.length > 0) {
          await loadProgress(selectedTopics);
        }
        
        // Reload games to reflect the change
        await loadGames();
        
        toast.success("Đã cập nhật tiến độ!");
      } catch (error) {
        console.error("Error marking game as played:", error);
      }
    }
    
    // Open game in modal player
    setSelectedGame(game);
    setIsPlayerOpen(true);
  };

  const handlePlayerClose = () => {
    setIsPlayerOpen(false);
    // Small delay before clearing selected game to allow for animations
    setTimeout(() => {
      setSelectedGame(null);
    }, 300);
  };

  const handlePlayTimeUpdate = async (gameId: number, playTime: number) => {
    try {
      await GameService.updatePlayTime(gameId, playTime);
      console.log(`Updated play time for game ${gameId}: ${playTime}s`);
    } catch (error) {
      console.error("Error updating play time:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = () => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const handleRemoveTopic = (topic: string) => {
    setSelectedTopics(prev => prev.filter(t => t !== topic));
    setCurrentPage(1);
  };

  const handleClearAllTopics = () => {
    setSelectedTopics([]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <ContentLayout title={t("listOfGames")}>
      {/* Remove performance-mode khi ở trang này */}
      <GamePerformanceManager />

      {/* Game Player Modal */}
      <GamePlayerModal
        game={selectedGame}
        isOpen={isPlayerOpen}
        onClose={handlePlayerClose}
        onPlayTimeUpdate={handlePlayTimeUpdate}
      />
      
      <div className="mx-auto px-4 py-6 space-y-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <span className="text-4xl">🎮</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
                  {t("listOfGames")}
                </h1>
                <p className="text-blue-100 text-sm md:text-base font-medium">
                  Khám phá {totalCount} trò chơi giáo dục thú vị cho bé yêu ✨
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <p className="text-xs text-blue-100 font-medium">Chủ đề</p>
                    <p className="text-lg font-bold text-white">8+</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👶</span>
                  <div>
                    <p className="text-xs text-blue-100 font-medium">Độ tuổi</p>
                    <p className="text-lg font-bold text-white">3-6 tuổi</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="text-xs text-blue-100 font-medium">Độ khó</p>
                    <p className="text-lg font-bold text-white">Đa dạng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <GameFilters
          ageGroup={ageGroup}
          selectedTopics={selectedTopics}
          search={search}
          topicCounts={topicCounts}
          onAgeGroupChange={(value) => {
            setAgeGroup(value);
            handleFilterChange();
          }}
          onTopicsChange={(topics) => {
            setSelectedTopics(topics);
            handleFilterChange();
          }}
          onSearchChange={(value) => {
            setSearch(value);
            handleFilterChange();
          }}
        />

        {/* Active Filter Badges */}
        {selectedTopics.length > 0 && (
          <ActiveFilterBadges
            selectedTopics={selectedTopics}
            topics={topicsList}
            onRemoveTopic={handleRemoveTopic}
            onClearAll={handleClearAllTopics}
          />
        )}

        {/* Overall Progress */}
        <GameProgress
          playedCount={progress.playedCount}
          totalCount={progress.totalCount}
          showAchievement={true}
        />

        {/* Filtered Progress (only show when topics are selected) */}
        {selectedTopics.length > 0 && (
          <GameProgress
            playedCount={filteredProgress.playedCount}
            totalCount={filteredProgress.totalCount}
            isFiltered={true}
            filterLabel={selectedTopics.map(t => 
              topicsList.find(topic => topic.value === t)?.label
            ).filter(Boolean).join(", ")}
            showAchievement={false}
          />
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-2 border-blue-100">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-200 rounded-full animate-ping" />
              </div>
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải trò chơi...</p>
            <p className="text-sm text-gray-500">Vui lòng đợi một chút nhé! 🎮</p>
          </div>
        ) : games.length === 0 ? (
          // Enhanced Empty State
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-dashed border-gray-300">
            <div className="relative inline-block mb-6">
              <div className="text-8xl mb-2 animate-bounce">🎮</div>
              <div className="absolute -top-2 -right-2 text-3xl animate-spin-slow">🔍</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Không tìm thấy trò chơi nào
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm nhiều trò chơi thú vị nhé! ✨
            </p>
            <button
              onClick={() => {
                setAgeGroup("");
                setSelectedTopics([]);
                setSearch("");
                setCurrentPage(1);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              🔄 Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          <>
            {/* Games Count Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-bold shadow-md">
                  {games.length} trò chơi
                </div>
                <span className="text-gray-600 text-sm">
                  (Trang {currentPage}/{totalPages})
                </span>
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game) => (
                <GameCard
                  key={game.gameId}
                  game={game}
                  userAge={userAge}
                  onLike={handleLike}
                  onClick={handleGameClick}
                />
              ))}
            </div>

            {/* Pagination */}
            <GamePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </ContentLayout>
  );
}