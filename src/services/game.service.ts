import { GamesQueryParams, GamesResponse } from "@/types/game";

// Mock data cho games
const mockGames = [
  {
    gameId: 1,
    gameName: "Animal Match",
    gameNameVi: "Ghép đôi động vật",
    description: "Tìm và ghép đôi các con vật giống nhau",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&q=80",
    urlGame: "https://games.smartkids.com/animal-match",
    numLiked: 120,
    topics: ["Animals", "Memory"],
    ageGroups: ["3-4 tuổi", "4-5 tuổi"],
    difficultyLevel: "easy" as const,
    estimatedDuration: 5,
    isLikedByUser: false,
    isPlayedByUser: true
  },
  {
    gameId: 2,
    gameName: "Number Adventure",
    gameNameVi: "Phiêu lưu với số",
    description: "Học đếm và nhận biết số từ 1 đến 10",
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    urlGame: "https://games.smartkids.com/number-adventure",
    numLiked: 95,
    topics: ["Numbers", "Math"],
    ageGroups: ["3-4 tuổi", "4-5 tuổi", "5-6 tuổi"],
    difficultyLevel: "easy" as const,
    estimatedDuration: 10,
    isLikedByUser: true,
    isPlayedByUser: false
  },
  {
    gameId: 3,
    gameName: "Color Splash",
    gameNameVi: "Thế giới màu sắc",
    description: "Khám phá và học tên các màu sắc",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    urlGame: "https://games.smartkids.com/color-splash",
    numLiked: 150,
    topics: ["Colors", "Art"],
    ageGroups: ["3-4 tuổi"],
    difficultyLevel: "easy" as const,
    estimatedDuration: 7,
    isLikedByUser: false,
    isPlayedByUser: true
  },
  {
    gameId: 4,
    gameName: "Alphabet Quest",
    gameNameVi: "Hành trình chữ cái",
    description: "Học bảng chữ cái tiếng Anh qua trò chơi",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    urlGame: "https://games.smartkids.com/alphabet-quest",
    numLiked: 200,
    topics: ["Alphabet", "Reading"],
    ageGroups: ["4-5 tuổi", "5-6 tuổi"],
    difficultyLevel: "medium" as const,
    estimatedDuration: 15,
    isLikedByUser: true,
    isPlayedByUser: true
  },
  {
    gameId: 5,
    gameName: "Shape Builder",
    gameNameVi: "Xây dựng hình khối",
    description: "Nhận biết và xếp các hình khối cơ bản",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    urlGame: "https://games.smartkids.com/shape-builder",
    numLiked: 88,
    topics: ["Shapes", "Logic"],
    ageGroups: ["3-4 tuổi", "4-5 tuổi"],
    difficultyLevel: "easy" as const,
    estimatedDuration: 8,
    isLikedByUser: false,
    isPlayedByUser: false
  },
  {
    gameId: 6,
    gameName: "Music Maker",
    gameNameVi: "Sáng tác âm nhạc",
    description: "Tạo ra những giai điệu đơn giản",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    urlGame: "https://games.smartkids.com/music-maker",
    numLiked: 175,
    topics: ["Music", "Creative"],
    ageGroups: ["4-5 tuổi", "5-6 tuổi"],
    difficultyLevel: "medium" as const,
    estimatedDuration: 12,
    isLikedByUser: true,
    isPlayedByUser: false
  },
  {
    gameId: 7,
    gameName: "Farm Friends",
    gameNameVi: "Bạn bè nông trại",
    description: "Khám phá cuộc sống trên nông trại",
    imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80",
    urlGame: "https://games.smartkids.com/farm-friends",
    numLiked: 142,
    topics: ["Animals", "Nature"],
    ageGroups: ["3-4 tuổi", "4-5 tuổi"],
    difficultyLevel: "easy" as const,
    estimatedDuration: 10,
    isLikedByUser: false,
    isPlayedByUser: true
  },
  {
    gameId: 8,
    gameName: "Word Wizard",
    gameNameVi: "Phù thủy từ vựng",
    description: "Học từ vựng tiếng Anh qua hình ảnh",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    urlGame: "https://games.smartkids.com/word-wizard",
    numLiked: 210,
    topics: ["Alphabet", "Vocabulary"],
    ageGroups: ["5-6 tuổi"],
    difficultyLevel: "medium" as const,
    estimatedDuration: 20,
    isLikedByUser: true,
    isPlayedByUser: true
  },
  {
    gameId: 9,
    gameName: "Puzzle Party",
    gameNameVi: "Tiệc ghép hình",
    description: "Giải các câu đố hình ảnh thú vị",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    urlGame: "https://games.smartkids.com/puzzle-party",
    numLiked: 165,
    topics: ["Logic", "Problem Solving"],
    ageGroups: ["4-5 tuổi", "5-6 tuổi"],
    difficultyLevel: "medium" as const,
    estimatedDuration: 15,
    isLikedByUser: false,
    isPlayedByUser: false
  },
  {
    gameId: 10,
    gameName: "Space Explorer",
    gameNameVi: "Khám phá vũ trụ",
    description: "Hành trình khám phá không gian",
    imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&q=80",
    urlGame: "https://games.smartkids.com/space-explorer",
    numLiked: 190,
    topics: ["Science", "Space"],
    ageGroups: ["5-6 tuổi"],
    difficultyLevel: "hard" as const,
    estimatedDuration: 25,
    isLikedByUser: true,
    isPlayedByUser: false
  },
  {
    gameId: 11,
    gameName: "Ocean Adventure",
    gameNameVi: "Phiêu lưu đại dương",
    description: "Khám phá thế giới dưới đáy biển",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    urlGame: "https://games.smartkids.com/ocean-adventure",
    numLiked: 135,
    topics: ["Animals", "Nature"],
    ageGroups: ["3-4 tuổi", "4-5 tuổi"],
    difficultyLevel: "easy" as const,
    estimatedDuration: 10,
    isLikedByUser: false,
    isPlayedByUser: true
  },
  {
    gameId: 12,
    gameName: "Memory Master",
    gameNameVi: "Bậc thầy trí nhớ",
    description: "Rèn luyện trí nhớ qua các trò chơi",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    urlGame: "https://games.smartkids.com/memory-master",
    numLiked: 180,
    topics: ["Memory", "Concentration"],
    ageGroups: ["4-5 tuổi", "5-6 tuổi"],
    difficultyLevel: "medium" as const,
    estimatedDuration: 12,
    isLikedByUser: true,
    isPlayedByUser: true
  }
];

export const GameService = {
  async getGames(params: GamesQueryParams = {}): Promise<GamesResponse> {
    try {
      const {
        page = 1,
        pageSize = 20,
        isActive = true,
        ageGroup,
        topic,
        search
      } = params;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredGames = [...mockGames];

      // Filter by active status (for now, all games are active)
      if (!isActive) {
        filteredGames = [];
      }

      // Filter by age group
      if (ageGroup) {
        filteredGames = filteredGames.filter(game =>
          game.ageGroups.includes(ageGroup)
        );
      }

      // Filter by topics (support multiple topics)
      if (topic) {
        const topicsArray = Array.isArray(topic) ? topic : [topic];
        if (topicsArray.length > 0) {
          filteredGames = filteredGames.filter(game =>
            topicsArray.some(t => 
              game.topics.some(gameTopic => 
                gameTopic.toLowerCase().includes(t.toLowerCase())
              )
            )
          );
        }
      }

      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        filteredGames = filteredGames.filter(
          game =>
            game.gameName.toLowerCase().includes(searchLower) ||
            game.gameNameVi.toLowerCase().includes(searchLower) ||
            game.description.toLowerCase().includes(searchLower)
        );
      }

      const totalCount = filteredGames.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedGames = filteredGames.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          games: paginatedGames,
          totalCount,
          currentPage: page,
          pageSize
        }
      };
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  },

  async getTopicCounts(): Promise<Record<string, number>> {
    try {
      // Count games per topic
      const counts: Record<string, number> = {};
      
      mockGames.forEach(game => {
        game.topics.forEach(topic => {
          counts[topic] = (counts[topic] || 0) + 1;
        });
      });

      return counts;
    } catch (error) {
      console.error("Error fetching topic counts:", error);
      return {};
    }
  },

  async toggleLike(gameId: number): Promise<{ success: boolean }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // In a real implementation, this would make an API call
      // For now, just return success
      return { success: true };
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  },

  async getProgress(params?: { topics?: string[] }): Promise<{
    success: boolean;
    data: {
      playedCount: number;
      totalCount: number;
      percentage: number;
    };
  }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let games = [...mockGames];

      // Filter by topics if provided
      if (params?.topics && params.topics.length > 0) {
        games = games.filter(game =>
          params.topics!.some(t =>
            game.topics.some(gameTopic =>
              gameTopic.toLowerCase().includes(t.toLowerCase())
            )
          )
        );
      }

      const totalCount = games.length;
      const playedCount = games.filter(game => game.isPlayedByUser).length;
      const percentage = totalCount > 0 ? Math.round((playedCount / totalCount) * 100) : 0;

      return {
        success: true,
        data: {
          playedCount,
          totalCount,
          percentage
        }
      };
    } catch (error) {
      console.error("Error fetching progress:", error);
      throw error;
    }
  },

  async markAsPlayed(gameId: number): Promise<{ success: boolean }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // In real implementation, this would update the game's isPlayedByUser status
      const game = mockGames.find(g => g.gameId === gameId);
      if (game) {
        game.isPlayedByUser = true;
      }

      return { success: true };
    } catch (error) {
      console.error("Error marking game as played:", error);
      throw error;
    }
  },

  async updatePlayTime(gameId: number, playTime: number): Promise<{ success: boolean }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // In real implementation, this would update the game's play time
      console.log(`Game ${gameId} played for ${playTime} seconds`);

      return { success: true };
    } catch (error) {
      console.error("Error updating play time:", error);
      throw error;
    }
  }
};

