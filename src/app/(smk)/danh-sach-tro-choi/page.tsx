"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { flatMap, sortBy } from "lodash";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import GameCard from "@/components/games/game-card";
import { ActiveFilterBadges } from "@/components/games/active-filter-badges";
import { GamePerformanceManager } from "@/components/games/game-performance-manager";
import { GameProgress } from "@/components/games/game-progress";
import { GamePlayerModal } from "@/components/games/game-player-modal";
import { GameService } from "@/services/game.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserInfo } from "@/hooks/useUserInfo";
import { getAllAges } from "@/app/api/actions/age";
import { getAllTopics } from "@/app/api/actions/topics";
import type { GameAge, GameTopic, AdminGame } from "@/types/admin-game";
import { useGameProgress } from "@/hooks/use-game-progress";
import { useGetGamesInfinite } from "@/hooks/use-game";

export default function ListOfGamesPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfo(session?.user?.userId);
  
  // State
  const [ages, setAges] = useState<GameAge[]>([]);
  const [topics, setTopics] = useState<GameTopic[]>([]);
  const [selectedGame, setSelectedGame] = useState<AdminGame | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  
  // Refs
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  
  // Constants
  const pageSize = 12;
  const userAge = 5; // TODO: Get from user context

  // Filter conversions
  const selectedTopicIds = useMemo(() => 
    selectedTopics
      .map(name => topics.find(t => t.topic_name === name)?.topic_id)
      .filter((id): id is number => id !== undefined),
    [selectedTopics, topics]
  );

  const selectedAgeIds = useMemo(() => {
    if (!ageGroup) return undefined;
    const age = ages.find(a => a.age_name === ageGroup);
    return age?.age_id === -1 ? undefined : age ? [age.age_id] : undefined;
  }, [ageGroup, ages]);

  // Games query params for API (no page param for infinite scroll)
  const gamesQueryParams = useMemo(() => ({
    pageSize,
    topicIds: selectedTopicIds.length > 0 ? selectedTopicIds : undefined,
    ageIds: selectedAgeIds,
    keyword: search || undefined,
    isActive: true,
    sortBy: "order",
    sortOrder: "asc" as const
  }), [pageSize, selectedTopicIds, selectedAgeIds, search]);

  // Queries
  const { 
    data: gamesInfiniteData, 
    isLoading: gamesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchGames
  } = useGetGamesInfinite(gamesQueryParams);
  
  const { data: overallProgress, refetch: refetchOverallProgress } = useGameProgress({}, { staleTime: 0 });
  const { data: filteredProgress, refetch: refetchFilteredProgress } = useGameProgress(
    { topicIds: selectedTopicIds },
    { enabled: selectedTopicIds.length > 0, staleTime: 0 }
  );
  
  // Flatten all pages using lodash
  const games = useMemo(() => 
    flatMap(gamesInfiniteData?.pages || [], (page: any) => page.data || []),
    [gamesInfiniteData]
  );
  
  const totalCount = gamesInfiniteData?.pages[0]?.totalCount || 0;
  const numberOfAges = ages.length || 4;
  const rotationAngle = 360 / numberOfAges;

  // Get current theme
  const dataTheme = typeof document !== 'undefined' 
    ? document.body.getAttribute('data-theme') 
    : null;
  const currentTheme = dataTheme || userInfo?.theme || session?.user?.theme || "theme-red";

  // Theme color mappings
  const themeColors = useMemo(() => {
    const themes = {
      "theme-gold": {
        primary: "#ECC98D",
        secondary: "#f5e6d3",
        accent: "#d4a574",
        dark: "#8b7355",
        light: "#faf3e8",
        gradient: "from-[#ECC98D] via-[#f5e6d3] to-[#d4a574]",
        ages: ["#e8b04b", "#ecc98d", "#f5e6d3", "#d4a574"]
      },
      "theme-blue": {
        primary: "#A7C6F5",
        secondary: "#e6f0ff",
        accent: "#7ba7e8",
        dark: "#5686d4",
        light: "#f0f6ff",
        gradient: "from-[#A7C6F5] via-[#e6f0ff] to-[#7ba7e8]",
        ages: ["#5686d4", "#7ba7e8", "#a7c6f5", "#e6f0ff"]
      },
      "theme-pink": {
        primary: "#ea69ae",
        secondary: "#fce4f3",
        accent: "#d43f8d",
        dark: "#b8186d",
        light: "#fff0f8",
        gradient: "from-[#ea69ae] via-[#fce4f3] to-[#d43f8d]",
        ages: ["#b8186d", "#d43f8d", "#ea69ae", "#fce4f3"]
      },
      "theme-red": {
        primary: "#E25762",
        secondary: "#ffe6e8",
        accent: "#d63843",
        dark: "#b41e28",
        light: "#fff0f1",
        gradient: "from-[#E25762] via-[#ffe6e8] to-[#d63843]",
        ages: ["#b41e28", "#d63843", "#e25762", "#ffe6e8"]
      }
    };
    return themes[currentTheme as keyof typeof themes] || themes["theme-red"];
  }, [currentTheme]);

  // Planet positions cho carousel - chỉ 1 ảnh nhưng nhiều vị trí rotate
  const planetPositions = Array.from({ length: numberOfAges }, (_, i) => ({
    name: `Position ${i + 1}`,
    color: themeColors.ages[i % themeColors.ages.length],
    rotation: i * rotationAngle
  }));
  
  // Ảnh planet duy nhất
  const planetImageSrc = "/assets/image/pink_bg_3.png";

  // Default colors cho topics nếu không có từ API
  const defaultTopicColors = [
    { 
      bg: "#ffaa00", 
      shadow: "#f75c3e",
      gradient: "linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)",
    },
    { 
      bg: "#0098a8", 
      shadow: "#00738e",
      gradient: "linear-gradient(135deg, #0098a8 0%, #006d7a 100%)",
    },
    { 
      bg: "#f9432b", 
      shadow: "#c6283f",
      gradient: "linear-gradient(135deg, #f9432b 0%, #d63322 100%)",
    },
    { 
      bg: "#8fc900", 
      shadow: "#37a064",
      gradient: "linear-gradient(135deg, #8fc900 0%, #6fa800 100%)",
    },
    { 
      bg: "#9b20f2", 
      shadow: "#5d25b7",
      gradient: "linear-gradient(135deg, #9b20f2 0%, #7818c4 100%)",
    },
    { 
      bg: "#ff6b9d", 
      shadow: "#e5527e",
      gradient: "linear-gradient(135deg, #ff6b9d 0%, #ff4582 100%)",
    },
    { 
      bg: "#20c997", 
      shadow: "#17a577",
      gradient: "linear-gradient(135deg, #20c997 0%, #17a577 100%)",
    },
    { 
      bg: "#fd7e14", 
      shadow: "#dc6302",
      gradient: "linear-gradient(135deg, #fd7e14 0%, #dc6302 100%)",
    }
  ];

  // Filter label for display
  const filterLabel = useMemo(() => 
    selectedTopics
      .map(name => topics.find(t => t.topic_name === name))
      .filter((t): t is GameTopic => t !== undefined)
      .map(t => t.topic_name_vi || t.topic_name)
      .join(", "),
    [selectedTopics, topics]
  );

  // Load ages and topics on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [agesResponse, topicsResponse] = await Promise.all([
          getAllAges({ pageSize: 100 }),
          getAllTopics({ pageSize: 100 })
        ]);

        // Process ages with "All Ages" option
        if (agesResponse.data?.length) {
          const allAgesOption: GameAge = {
            age_id: -1,
            age_name: "Tất cả độ tuổi",
            age_name_en: "All Ages",
            min_age: 0,
            max_age: 100,
            order: -1
          };
          setAges([allAgesOption, ...sortBy(agesResponse.data, 'order')]);
        }

        // Process active topics
        if (topicsResponse.data?.length) {
          const activeTopics = sortBy(
            topicsResponse.data.filter(t => t.is_active),
            'order'
          );
          setTopics(activeTopics);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Không thể tải dữ liệu");
      }
    };
    loadData();
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handlers
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  
  const handleLike = async (gameId: number) => {
    try {
      await GameService.toggleLike(gameId);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleGameClick = async (game: AdminGame) => {
    if (!game.self_progress_info) {
      try {
        await Promise.all([
          GameService.markAsPlayed(game.game_id),
          refetchGames(),
          refetchOverallProgress(),
          ...(selectedTopicIds.length > 0 ? [refetchFilteredProgress()] : [])
        ]);
        toast.success("Đã cập nhật tiến độ!");
      } catch (error) {
        console.error("Error marking game as played:", error);
      }
    }
    setSelectedGame(game);
    setIsPlayerOpen(true);
  };

  const handlePlayerClose = () => {
    setIsPlayerOpen(false);
    setTimeout(() => setSelectedGame(null), 300);
  };

  const handlePlayTimeUpdate = async (gameId: number, playTime: number) => {
    try {
      await GameService.updatePlayTime(gameId, playTime);
    } catch (error) {
      console.error("Error updating play time:", error);
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setSelectedTopics(prev => prev.filter(t => t !== topic));
    scrollToTop();
  };

  const handleClearAllTopics = () => {
    setSelectedTopics([]);
    scrollToTop();
  };

  // Planet carousel handlers
  const rotatePlanet = (targetIndex: number, duration = 1) => {
    if (isAnimating || !planetRef.current || targetIndex === currentPlanetIndex) return;
    
    setIsAnimating(true);
    const targetRotation = planetPositions[targetIndex].rotation;
    let diff = targetRotation - (currentRotation % 360);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    gsap.to(planetRef.current, {
      rotation: currentRotation + diff,
      duration,
      ease: "power2.inOut",
      onComplete: () => {
        setCurrentPlanetIndex(targetIndex);
        setCurrentRotation(currentRotation + diff);
        setIsAnimating(false);
        if (ages[targetIndex]) {
          setAgeGroup(ages[targetIndex].age_name);
          scrollToTop();
        }
      }
    });
  };

  const handleNextPlanet = () => rotatePlanet((currentPlanetIndex + 1) % numberOfAges, 1);
  const handlePrevPlanet = () => rotatePlanet((currentPlanetIndex - 1 + numberOfAges) % numberOfAges, 1);
  const handleJumpToPosition = (index: number) => rotatePlanet(index, 1.2);

  return (
    <ContentLayout title={t("listOfGames")}>
      <GamePerformanceManager />
      <GamePlayerModal
        game={selectedGame}
        isOpen={isPlayerOpen}
        onClose={handlePlayerClose}
        onPlayTimeUpdate={handlePlayTimeUpdate}
      />

      <div className="mx-auto py-6 space-y-6">
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <div 
            className={`py-4 flex gap-2 justify-around items-center bg-gradient-to-r ${themeColors.gradient}`}
            style={{ boxShadow: `inset 0 -4px 0 ${themeColors.dark}` }}
          >
            {ages.length > 0 ? ages.map((age, index) => {
              const isCurrentAge = index === currentPlanetIndex;
              const color = themeColors.ages[index % themeColors.ages.length];
              return (
                <p 
                  key={age.age_id}
                  className={cn(
                    "font-bold text-sm md:text-base transition-all cursor-pointer",
                    isCurrentAge ? "scale-110" : "hover:scale-105"
                  )}
                  style={{ 
                    color,
                    textShadow: isCurrentAge ? `0 0 10px ${color}` : "none",
                    opacity: isCurrentAge ? 1 : 0.7
                  }}
                  onClick={() => handleJumpToPosition(index)}
                >
                  {isCurrentAge && "▶ "}{age.age_name}{isCurrentAge && " ◀"}
                </p>
              );
            }) : (
              <p className="font-bold text-sm md:text-base" style={{ color: themeColors.ages[0] }}>
                Đang tải...
              </p>
            )}
          </div>

          <div
            className="h-[400px] w-full relative overflow-hidden"
            style={{
              backgroundImage: "url('/assets/image/space_bg.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: themeColors.light
            }}
          >
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}20 0%, ${themeColors.secondary}40 50%, ${themeColors.accent}20 100%)`
              }}
            />

            <div className="absolute bottom-0 left-0 w-full h-[1500px] z-[1]">
              <div
                ref={planetRef}
                className="absolute bottom-0 left-0 w-full h-full"
                style={{
                  transformOrigin: "center center",
                  willChange: "transform",
                  transform: "translateY(1100px)"
                }}
              >
                {/* Responsive planet image with glow border */}
                <img
                  src={planetImageSrc}
                  srcSet="/assets/image/pink_bg.png 1200w, /assets/image/pink_bg_3.png 2000w, /assets/image/pink_bg_3.png 4000w"
                  sizes="100vw"
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center bottom",
                    imageRendering: "-webkit-optimize-contrast",
                    filter: `drop-shadow(0 0 24px ${themeColors.primary}) drop-shadow(0 0 48px ${themeColors.primary}66)`
                  }}
                />
              </div>
            </div>

            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
              <Button
                onClick={handlePrevPlanet}
                disabled={isAnimating}
                className="group transition-all hover:scale-110"
                style={{
                  backgroundColor: themeColors.primary,
                  boxShadow: `0 .25rem 0 0 ${themeColors.dark}, 0 0 15px ${themeColors.primary}60`,
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  padding: 0,
                  border: "3px solid rgba(255, 255, 255, 0.5)"
                }}
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:animate-pulse" />
              </Button>
              
              <Button
                onClick={handleNextPlanet}
                disabled={isAnimating}
                className="group transition-all hover:scale-110"
                style={{
                  backgroundColor: themeColors.primary,
                  boxShadow: `0 .25rem 0 0 ${themeColors.dark}, 0 0 15px ${themeColors.primary}60`,
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  padding: 0,
                  border: "3px solid rgba(255, 255, 255, 0.5)"
                }}
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:animate-pulse" />
              </Button>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
              {planetPositions.map((position, index) => (
                <button
                  key={index}
                  onClick={() => handleJumpToPosition(index)}
                  disabled={isAnimating}
                  className="transition-all hover:scale-125 disabled:cursor-not-allowed"
                  style={{
                    width: index === currentPlanetIndex ? "32px" : "12px",
                    height: "12px",
                    borderRadius: "6px",
                    backgroundColor: index === currentPlanetIndex ? position.color : "rgba(255, 255, 255, 0.5)",
                    boxShadow: index === currentPlanetIndex ? `0 0 10px ${position.color}` : "none",
                    border: "2px solid rgba(255, 255, 255, 0.8)",
                    cursor: isAnimating ? "not-allowed" : "pointer",
                    opacity: isAnimating ? 0.6 : 1
                  }}
                  aria-label={`Go to ${position.name} - ${index * rotationAngle}°`}
                />
              ))}
            </div>

            <div className="ml-4 md:mx-20 pt-5 relative z-10">
              <div className="flex justify-between items-center">
                <div className="flex flex-col md:flex-row gap-3 md:gap-5 items-start md:items-center">
                  <p
                    className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg"
                    style={{
                      textShadow: `0 .20rem 0 ${themeColors.primary}, 0 0 20px ${themeColors.primary}50`
                    }}
                  >
                    {ages[currentPlanetIndex]?.age_name_en || ages[currentPlanetIndex]?.age_name}
                  </p>
                  <Button
                    className="transition-all hover:scale-105 hover:brightness-110"
                    style={{
                      backgroundColor: themeColors.primary,
                      boxShadow: `0 .35rem 0 0 ${themeColors.dark}`,
                      borderRadius: "30px"
                    }}
                  >
                    Mô tả chủ đề này!
                  </Button>
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors">
                    <Search className={cn(
                      "w-5 h-5 transition-colors",
                      search ? "text-blue-500" : "text-gray-400"
                    )} />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm trò chơi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-xl transition-all",
                      "border-2 focus:outline-none",
                      search 
                        ? "border-blue-400 bg-blue-50/50" 
                        : "border-gray-200 bg-white hover:border-gray-300",
                      "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    )}
                  />
                </div>
              </div>

              <div className="w-full md:w-3/4 lg:w-1/2 block mt-2 pr-4">
                <div className="flex flex-wrap gap-2">
                  {topics.length > 0 ? (
                    topics.map((topic, index) => {
                      const colorScheme = defaultTopicColors[index % defaultTopicColors.length];
                      const isSelected = selectedTopics.includes(topic.topic_name);
                      const gradient = isSelected
                        ? colorScheme.gradient
                        : `linear-gradient(135deg, ${colorScheme.bg}80 0%, ${colorScheme.bg}60 100%)`;
                      const backgroundImage = topic.icon_url
                        ? `url('${topic.icon_url}'), ${gradient}`
                        : gradient;
                      
                      return (
                        <Button
                          key={topic.topic_id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTopics(prev => prev.filter(t => t !== topic.topic_name));
                            } else {
                              setSelectedTopics(prev => [...prev, topic.topic_name]);
                            }
                            scrollToTop();
                          }}
                          className="transition-all hover:scale-105 hover:brightness-110 hover:shadow-xl group"
                          style={{
                            backgroundImage,
                            backgroundRepeat: topic.icon_url ? "no-repeat, no-repeat" : "no-repeat",
                            backgroundPosition: topic.icon_url ? "20px center, 0 0" : "0 0",
                            backgroundSize: topic.icon_url ? "4em 2.01em, 100% 100%" : "100% 100%",
                            boxShadow: isSelected
                              ? `0 .35rem 0 0 ${colorScheme.shadow}, 0 0 20px ${colorScheme.bg}40`
                              : `0 .25rem 0 0 ${colorScheme.shadow}80`,
                            borderRadius: "30px",
                            width: index === 0 || index === 1 ? "200px" : "180px",
                            height: "50px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#fff",
                            textTransform: "uppercase",
                            paddingLeft: topic.icon_url ? "80px" : "20px",
                            margin: "10px 5px 0 0",
                            opacity: isSelected ? 1 : 0.8
                          }}
                        >
                          <span className="drop-shadow-md group-hover:drop-shadow-lg transition-all">
                            {topic.topic_name}
                          </span>
                        </Button>
                      );
                    })
                  ) : (
                    <>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={`skeleton-${index}`}
                          className="animate-pulse"
                          style={{
                            width: index === 0 || index === 1 ? "200px" : "180px",
                            height: "50px",
                            borderRadius: "30px",
                            background: "rgba(255, 255, 255, 0.2)",
                            margin: "10px 5px 0 0",
                            backdropFilter: "blur(4px)"
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedTopics.length > 0 && (
          <ActiveFilterBadges
            selectedTopics={selectedTopics}
            topics={topics.map(t => ({ 
              value: t.topic_name, 
              label: t.topic_name_vi || t.topic_name,
              emoji: "🎮" 
            }))}
            onRemoveTopic={handleRemoveTopic}
            onClearAll={handleClearAllTopics}
          />
        )}

        {overallProgress && (
          <GameProgress
            playedCount={overallProgress.total_played_games}
            totalCount={overallProgress.total_active_games}
            showAchievement
          />
        )}

        {selectedTopics.length > 0 && filteredProgress && (
          <GameProgress
            playedCount={filteredProgress.total_played_games}
            totalCount={filteredProgress.total_active_games}
            isFiltered
            filterLabel={filterLabel}
          />
        )}

        {gamesLoading ? (
          <div 
            className="flex flex-col items-center justify-center py-20 rounded-3xl border-2"
            style={{
              background: `linear-gradient(135deg, ${themeColors.light} 0%, ${themeColors.secondary} 100%)`,
              borderColor: themeColors.primary
            }}
          >
            <Loader2 className="w-16 h-16 animate-spin mb-4" style={{ color: themeColors.primary }} />
            <p className="text-lg font-semibold text-gray-700">Đang tải trò chơi...</p>
            <p className="text-sm text-gray-500">Vui lòng đợi một chút nhé! 🎮</p>
          </div>
        ) : !games.length ? (
          <div 
            className="text-center py-20 rounded-3xl border-2 border-dashed"
            style={{
              background: `linear-gradient(135deg, ${themeColors.light} 0%, ${themeColors.secondary} 100%)`,
              borderColor: `${themeColors.primary}60`
            }}
          >
            <div className="text-8xl mb-4 animate-bounce">🎮</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Không tìm thấy trò chơi nào</h3>
            <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé! ✨</p>
            <Button
              onClick={() => {
                setAgeGroup("");
                setSelectedTopics([]);
                setSearch("");
                scrollToTop();
              }}
              className="hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)`,
                boxShadow: `0 4px 12px ${themeColors.primary}40`
              }}
            >
              🔄 Xóa tất cả bộ lọc
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div 
                className="text-white px-4 py-2 rounded-xl font-bold shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)`,
                  boxShadow: `0 4px 12px ${themeColors.primary}40`
                }}
              >
                {games.length}/{totalCount} trò chơi
              </div>
              {hasNextPage && (
                <span className="text-sm font-medium" style={{ color: themeColors.dark }}>
                  Cuộn xuống để tải thêm ⬇️
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game: AdminGame) => (
                <GameCard
                  key={game.game_id}
                  game={game}
                  userAge={userAge}
                  onLike={handleLike}
                  onClick={handleGameClick}
                />
              ))}
            </div>

            <div ref={loadMoreRef} className="py-8">
              {isFetchingNextPage ? (
                <div 
                  className="flex flex-col items-center gap-3 rounded-2xl p-6"
                  style={{ background: `linear-gradient(135deg, ${themeColors.light} 0%, ${themeColors.secondary} 100%)` }}
                >
                  <Loader2 className="w-12 h-12 animate-spin" style={{ color: themeColors.primary }} />
                  <p className="text-sm font-medium" style={{ color: themeColors.dark }}>
                    Đang tải thêm trò chơi...
                  </p>
                </div>
              ) : hasNextPage ? (
                <div className="text-center">
                  <Button
                    onClick={() => fetchNextPage()}
                    className="hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)`,
                      boxShadow: `0 .35rem 0 0 ${themeColors.dark}`,
                      borderRadius: "30px"
                    }}
                  >
                    Tải thêm trò chơi 🎮
                  </Button>
                </div>
              ) : games.length > 0 ? (
                <div 
                  className="text-center py-6 rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${themeColors.light} 0%, ${themeColors.secondary} 100%)` }}
                >
                  <p className="text-sm font-medium" style={{ color: themeColors.dark }}>
                    🎉 Bạn đã xem hết tất cả trò chơi!
                  </p>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </ContentLayout>
  );
}
