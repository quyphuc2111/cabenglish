import {
  GameTopic,
  GameAge,
  AdminGame,
  AdminGameTopicsQuery,
  AdminGameAgesQuery,
  AdminGamesQuery,
  GameTopicFormData,
  GameAgeFormData,
  AdminGameFormData,
  AdminGameTopicsResponse,
  AdminGameAgesResponse,
  AdminGamesResponse,
  ImportResult,
  ReorderItem
} from "@/types/admin-game";

// Mock data for development
const generateMockTopics = (): GameTopic[] => {
  const topicData = [
    { name: "Animals", nameVi: "Động vật", icon: "🐾", description: "Games about animals" },
    { name: "Numbers", nameVi: "Số học", icon: "🔢", description: "Math and number games" },
    { name: "Colors", nameVi: "Màu sắc", icon: "🎨", description: "Color learning games" },
    { name: "Shapes", nameVi: "Hình khối", icon: "🔷", description: "Learn about shapes" },
    { name: "Alphabet", nameVi: "Bảng chữ cái", icon: "🔤", description: "Learning letters" },
    { name: "Music", nameVi: "Âm nhạc", icon: "🎵", description: "Music and sounds" },
    { name: "Nature", nameVi: "Thiên nhiên", icon: "🌳", description: "Explore nature" },
    { name: "Food", nameVi: "Thức ăn", icon: "🍎", description: "Learn about food" },
    { name: "Vehicles", nameVi: "Phương tiện", icon: "🚗", description: "Cars and transportation" },
    { name: "Weather", nameVi: "Thời tiết", icon: "☀️", description: "Weather and seasons" },
    { name: "Sports", nameVi: "Thể thao", icon: "⚽", description: "Sports and activities" },
    { name: "Space", nameVi: "Vũ trụ", icon: "🚀", description: "Space and planets" },
    { name: "Ocean", nameVi: "Đại dương", icon: "🌊", description: "Ocean and sea life" },
    { name: "Emotions", nameVi: "Cảm xúc", icon: "😊", description: "Understanding feelings" },
    { name: "Family", nameVi: "Gia đình", icon: "👨‍👩‍👧", description: "Family members" },
    { name: "Body Parts", nameVi: "Bộ phận cơ thể", icon: "👁️", description: "Learn body parts" },
    { name: "Toys", nameVi: "Đồ chơi", icon: "🧸", description: "Fun with toys" },
    { name: "Clothes", nameVi: "Quần áo", icon: "👕", description: "Clothing items" },
    { name: "Time", nameVi: "Thời gian", icon: "⏰", description: "Learning time" },
    { name: "Seasons", nameVi: "Mùa", icon: "🍂", description: "Four seasons" },
    { name: "Holidays", nameVi: "Ngày lễ", icon: "🎉", description: "Special occasions" },
    { name: "School", nameVi: "Trường học", icon: "🏫", description: "School activities" },
    { name: "Garden", nameVi: "Vườn", icon: "🌻", description: "Plants and garden" },
    { name: "Farm", nameVi: "Nông trại", icon: "🚜", description: "Farm animals and life" },
    { name: "Zoo", nameVi: "Sở thú", icon: "🦁", description: "Zoo animals" },
    { name: "Dinosaurs", nameVi: "Khủng long", icon: "🦕", description: "Prehistoric creatures" },
    { name: "Insects", nameVi: "Côn trùng", icon: "🦋", description: "Bugs and insects" },
    { name: "Birds", nameVi: "Chim", icon: "🐦", description: "Different birds" },
    { name: "Pets", nameVi: "Vật nuôi", icon: "🐶", description: "Pet animals" },
    { name: "Wild Animals", nameVi: "Động vật hoang dã", icon: "🦊", description: "Animals in the wild" },
    { name: "Houses", nameVi: "Ngôi nhà", icon: "🏠", description: "Types of houses" },
    { name: "Furniture", nameVi: "Đồ đạc", icon: "🛋️", description: "Home furniture" },
    { name: "Kitchen", nameVi: "Nhà bếp", icon: "🍳", description: "Kitchen items" },
    { name: "Fruits", nameVi: "Hoa quả", icon: "🍇", description: "Different fruits" },
    { name: "Vegetables", nameVi: "Rau củ", icon: "🥕", description: "Healthy vegetables" },
    { name: "Drinks", nameVi: "Đồ uống", icon: "🥤", description: "Various drinks" },
    { name: "Desserts", nameVi: "Món tráng miệng", icon: "🍰", description: "Sweet treats" },
    { name: "Cooking", nameVi: "Nấu ăn", icon: "👨‍🍳", description: "Cooking activities" },
    { name: "Art", nameVi: "Nghệ thuật", icon: "🎨", description: "Creative art" },
    { name: "Dance", nameVi: "Múa", icon: "💃", description: "Dancing activities" },
    { name: "Books", nameVi: "Sách", icon: "📚", description: "Reading books" },
    { name: "Stories", nameVi: "Truyện", icon: "📖", description: "Story telling" },
    { name: "Adventure", nameVi: "Phiêu lưu", icon: "🗺️", description: "Adventure games" },
    { name: "Puzzle", nameVi: "Câu đố", icon: "🧩", description: "Puzzle solving" },
    { name: "Memory", nameVi: "Trí nhớ", icon: "🧠", description: "Memory games" },
    { name: "Logic", nameVi: "Logic", icon: "🤔", description: "Logic thinking" },
    { name: "Creative", nameVi: "Sáng tạo", icon: "✨", description: "Creative activities" },
    { name: "Science", nameVi: "Khoa học", icon: "🔬", description: "Science experiments" },
    { name: "Magic", nameVi: "Ma thuật", icon: "🪄", description: "Magic tricks" },
    { name: "Fantasy", nameVi: "Kỳ ảo", icon: "🦄", description: "Fantasy world" }
  ];

  return topicData.map((topic, index) => ({
    topicId: index + 1,
    topicName: topic.name,
    topicNameVi: topic.nameVi,
    description: topic.description,
    iconUrl: topic.icon,
    order: index + 1,
    isActive: index < 45, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

const mockTopics: GameTopic[] = generateMockTopics();

const mockAges: GameAge[] = [
  {
    ageId: 1,
    ageName: "3-4 tuổi",
    ageNameEn: "3-4 years old",
    description: "For preschool children",
    minAge: 3,
    maxAge: 4,
    order: 1
  },
  {
    ageId: 2,
    ageName: "4-5 tuổi",
    ageNameEn: "4-5 years old",
    description: "For kindergarten children",
    minAge: 4,
    maxAge: 5,
    order: 2
  },
  {
    ageId: 3,
    ageName: "5-6 tuổi",
    ageNameEn: "5-6 years old",
    description: "For early primary school",
    minAge: 5,
    maxAge: 6,
    order: 3
  }
];

export const AdminGameService = {
  // ==================== TOPICS ====================
  
  async getTopics(query: AdminGameTopicsQuery = {}): Promise<AdminGameTopicsResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = [...mockTopics];
      
      if (query.keyword) {
        filtered = filtered.filter(t => 
          t.topicName.toLowerCase().includes(query.keyword!.toLowerCase()) ||
          t.topicNameVi.toLowerCase().includes(query.keyword!.toLowerCase())
        );
      }
      
      if (query.isActive !== undefined) {
        filtered = filtered.filter(t => t.isActive === query.isActive);
      }
      
      const page = query.page || 1;
      const pageSize = query.pageSize || 20;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      return {
        success: true,
        data: {
          topics: filtered.slice(start, end),
          totalCount: filtered.length,
          currentPage: page,
          pageSize
        }
      };
    } catch (error) {
      console.error("Error fetching topics:", error);
      throw error;
    }
  },

  async createTopic(data: GameTopicFormData): Promise<{ success: boolean; data: { topicId: number } }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newId = Math.max(...mockTopics.map(t => t.topicId)) + 1;
      mockTopics.push({
        ...data,
        topicId: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, data: { topicId: newId } };
    } catch (error) {
      console.error("Error creating topic:", error);
      throw error;
    }
  },

  async updateTopic(topicId: number, data: Partial<GameTopicFormData>): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockTopics.findIndex(t => t.topicId === topicId);
      if (index !== -1) {
        mockTopics[index] = {
          ...mockTopics[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error updating topic:", error);
      throw error;
    }
  },

  async deleteTopic(topicId: number): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockTopics.findIndex(t => t.topicId === topicId);
      if (index !== -1) {
        mockTopics.splice(index, 1);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting topic:", error);
      throw error;
    }
  },

  // ==================== AGES ====================
  
  async getAges(query: AdminGameAgesQuery = {}): Promise<AdminGameAgesResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = [...mockAges];
      
      if (query.keyword) {
        filtered = filtered.filter(a => 
          a.ageName.toLowerCase().includes(query.keyword!.toLowerCase()) ||
          a.ageNameEn.toLowerCase().includes(query.keyword!.toLowerCase())
        );
      }
      
      const page = query.page || 1;
      const pageSize = query.pageSize || 20;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      return {
        success: true,
        data: {
          ages: filtered.slice(start, end),
          totalCount: filtered.length,
          currentPage: page,
          pageSize
        }
      };
    } catch (error) {
      console.error("Error fetching ages:", error);
      throw error;
    }
  },

  async createAge(data: GameAgeFormData): Promise<{ success: boolean; data: { ageId: number } }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newId = Math.max(...mockAges.map(a => a.ageId)) + 1;
      mockAges.push({
        ...data,
        ageId: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, data: { ageId: newId } };
    } catch (error) {
      console.error("Error creating age:", error);
      throw error;
    }
  },

  async updateAge(ageId: number, data: Partial<GameAgeFormData>): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockAges.findIndex(a => a.ageId === ageId);
      if (index !== -1) {
        mockAges[index] = {
          ...mockAges[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error updating age:", error);
      throw error;
    }
  },

  async deleteAge(ageId: number): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockAges.findIndex(a => a.ageId === ageId);
      if (index !== -1) {
        mockAges.splice(index, 1);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting age:", error);
      throw error;
    }
  },

  // ==================== GAMES ====================
  
  async getGames(query: AdminGamesQuery = {}): Promise<AdminGamesResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate 50 mock games
      const mockGames: AdminGame[] = [
        {
          gameId: 1,
          gameName: "Animal Match",
          gameNameVi: "Ghép đôi động vật",
          description: "Match animal pairs to learn about different animals",
          descriptionVi: "Ghép đôi các con vật để học về động vật",
          imageUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400",
          urlGame: "https://example.com/animal-match",
          numLiked: 120,
          difficultyLevel: "easy",
          estimatedDuration: 5,
          isActive: true,
          topics: [mockTopics[0]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 2,
          gameName: "Number Adventure",
          gameNameVi: "Phiêu lưu số học",
          description: "Explore numbers through fun adventures",
          descriptionVi: "Khám phá số học qua những cuộc phiêu lưu thú vị",
          imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
          urlGame: "https://example.com/number-adventure",
          numLiked: 95,
          difficultyLevel: "medium",
          estimatedDuration: 10,
          isActive: true,
          topics: [mockTopics[1]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 3,
          gameName: "Color Mixer",
          gameNameVi: "Trộn màu sắc",
          description: "Learn colors by mixing them",
          descriptionVi: "Học màu sắc bằng cách trộn màu",
          imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400",
          urlGame: "https://example.com/color-mixer",
          numLiked: 150,
          difficultyLevel: "easy",
          estimatedDuration: 8,
          isActive: true,
          topics: [mockTopics[2]],
          ages: [mockAges[0]]
        },
        {
          gameId: 4,
          gameName: "Shape Builder",
          gameNameVi: "Xây dựng hình khối",
          description: "Build structures with different shapes",
          descriptionVi: "Xây dựng cấu trúc với các hình khối khác nhau",
          imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400",
          urlGame: "https://example.com/shape-builder",
          numLiked: 88,
          difficultyLevel: "medium",
          estimatedDuration: 12,
          isActive: true,
          topics: [mockTopics[3]],
          ages: [mockAges[1]]
        },
        {
          gameId: 5,
          gameName: "Alphabet Song",
          gameNameVi: "Bài hát bảng chữ cái",
          description: "Sing along with the alphabet",
          descriptionVi: "Hát cùng bảng chữ cái",
          imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
          urlGame: "https://example.com/alphabet-song",
          numLiked: 210,
          difficultyLevel: "easy",
          estimatedDuration: 6,
          isActive: true,
          topics: [mockTopics[4], mockTopics[5]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 6,
          gameName: "Music Maker",
          gameNameVi: "Sáng tác âm nhạc",
          description: "Create your own music",
          descriptionVi: "Tạo ra âm nhạc của riêng bạn",
          imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
          urlGame: "https://example.com/music-maker",
          numLiked: 175,
          difficultyLevel: "medium",
          estimatedDuration: 15,
          isActive: true,
          topics: [mockTopics[5]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 7,
          gameName: "Nature Explorer",
          gameNameVi: "Khám phá thiên nhiên",
          description: "Explore the wonders of nature",
          descriptionVi: "Khám phá kỳ quan thiên nhiên",
          imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
          urlGame: "https://example.com/nature-explorer",
          numLiked: 92,
          difficultyLevel: "easy",
          estimatedDuration: 10,
          isActive: true,
          topics: [mockTopics[6]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 8,
          gameName: "Food Puzzle",
          gameNameVi: "Câu đố thức ăn",
          description: "Solve puzzles about different foods",
          descriptionVi: "Giải câu đố về các loại thức ăn",
          imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400",
          urlGame: "https://example.com/food-puzzle",
          numLiked: 110,
          difficultyLevel: "medium",
          estimatedDuration: 12,
          isActive: false,
          topics: [mockTopics[7], mockTopics[43]],
          ages: [mockAges[1]]
        },
        {
          gameId: 9,
          gameName: "Car Race",
          gameNameVi: "Đua xe ô tô",
          description: "Race cars and learn about vehicles",
          descriptionVi: "Đua xe và học về phương tiện",
          imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
          urlGame: "https://example.com/car-race",
          numLiked: 230,
          difficultyLevel: "hard",
          estimatedDuration: 20,
          isActive: true,
          topics: [mockTopics[8]],
          ages: [mockAges[2]]
        },
        {
          gameId: 10,
          gameName: "Weather Watch",
          gameNameVi: "Quan sát thời tiết",
          description: "Learn about weather and seasons",
          descriptionVi: "Học về thời tiết và các mùa",
          imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400",
          urlGame: "https://example.com/weather-watch",
          numLiked: 78,
          difficultyLevel: "easy",
          estimatedDuration: 8,
          isActive: true,
          topics: [mockTopics[9], mockTopics[19]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 11,
          gameName: "Soccer Fun",
          gameNameVi: "Bóng đá vui nhộn",
          description: "Play soccer and learn teamwork",
          descriptionVi: "Chơi bóng đá và học làm việc nhóm",
          imageUrl: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400",
          urlGame: "https://example.com/soccer-fun",
          numLiked: 145,
          difficultyLevel: "medium",
          estimatedDuration: 15,
          isActive: true,
          topics: [mockTopics[10]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 12,
          gameName: "Space Journey",
          gameNameVi: "Hành trình vũ trụ",
          description: "Travel through space and visit planets",
          descriptionVi: "Du hành vũ trụ và thăm các hành tinh",
          imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400",
          urlGame: "https://example.com/space-journey",
          numLiked: 198,
          difficultyLevel: "hard",
          estimatedDuration: 25,
          isActive: true,
          topics: [mockTopics[11]],
          ages: [mockAges[2]]
        },
        {
          gameId: 13,
          gameName: "Ocean Dive",
          gameNameVi: "Lặn biển",
          description: "Dive into the ocean and discover sea life",
          descriptionVi: "Lặn xuống đại dương và khám phá sinh vật biển",
          imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
          urlGame: "https://example.com/ocean-dive",
          numLiked: 167,
          difficultyLevel: "medium",
          estimatedDuration: 18,
          isActive: true,
          topics: [mockTopics[12], mockTopics[0]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 14,
          gameName: "Happy Face",
          gameNameVi: "Khuôn mặt vui vẻ",
          description: "Learn about emotions and feelings",
          descriptionVi: "Học về cảm xúc và tâm trạng",
          imageUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400",
          urlGame: "https://example.com/happy-face",
          numLiked: 134,
          difficultyLevel: "easy",
          estimatedDuration: 7,
          isActive: true,
          topics: [mockTopics[13]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 15,
          gameName: "Family Tree",
          gameNameVi: "Cây gia đình",
          description: "Build your family tree",
          descriptionVi: "Xây dựng cây gia đình của bạn",
          imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400",
          urlGame: "https://example.com/family-tree",
          numLiked: 89,
          difficultyLevel: "easy",
          estimatedDuration: 10,
          isActive: false,
          topics: [mockTopics[14]],
          ages: [mockAges[0]]
        },
        {
          gameId: 16,
          gameName: "Body Parts Quiz",
          gameNameVi: "Trò chơi bộ phận cơ thể",
          description: "Learn about body parts through quiz",
          descriptionVi: "Học về bộ phận cơ thể qua câu đố",
          imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400",
          urlGame: "https://example.com/body-parts",
          numLiked: 102,
          difficultyLevel: "easy",
          estimatedDuration: 8,
          isActive: true,
          topics: [mockTopics[15]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 17,
          gameName: "Toy Store",
          gameNameVi: "Cửa hàng đồ chơi",
          description: "Run your own toy store",
          descriptionVi: "Quản lý cửa hàng đồ chơi của bạn",
          imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400",
          urlGame: "https://example.com/toy-store",
          numLiked: 156,
          difficultyLevel: "medium",
          estimatedDuration: 15,
          isActive: true,
          topics: [mockTopics[16]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 18,
          gameName: "Dress Up",
          gameNameVi: "Thay đồ",
          description: "Dress up characters with different clothes",
          descriptionVi: "Thay đồ cho nhân vật với nhiều trang phục",
          imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
          urlGame: "https://example.com/dress-up",
          numLiked: 188,
          difficultyLevel: "easy",
          estimatedDuration: 12,
          isActive: true,
          topics: [mockTopics[17]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 19,
          gameName: "Clock Master",
          gameNameVi: "Thạo đồng hồ",
          description: "Learn to tell time",
          descriptionVi: "Học cách xem giờ",
          imageUrl: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400",
          urlGame: "https://example.com/clock-master",
          numLiked: 76,
          difficultyLevel: "hard",
          estimatedDuration: 20,
          isActive: true,
          topics: [mockTopics[18]],
          ages: [mockAges[2]]
        },
        {
          gameId: 20,
          gameName: "Season Match",
          gameNameVi: "Ghép mùa",
          description: "Match items to their seasons",
          descriptionVi: "Ghép đồ vật với mùa tương ứng",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
          urlGame: "https://example.com/season-match",
          numLiked: 93,
          difficultyLevel: "easy",
          estimatedDuration: 10,
          isActive: true,
          topics: [mockTopics[19], mockTopics[9]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 21,
          gameName: "Party Planner",
          gameNameVi: "Tổ chức tiệc",
          description: "Plan amazing parties",
          descriptionVi: "Tổ chức những bữa tiệc tuyệt vời",
          imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
          urlGame: "https://example.com/party-planner",
          numLiked: 142,
          difficultyLevel: "medium",
          estimatedDuration: 15,
          isActive: false,
          topics: [mockTopics[20]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 22,
          gameName: "School Day",
          gameNameVi: "Ngày đến trường",
          description: "Experience a day at school",
          descriptionVi: "Trải nghiệm một ngày ở trường",
          imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
          urlGame: "https://example.com/school-day",
          numLiked: 118,
          difficultyLevel: "easy",
          estimatedDuration: 12,
          isActive: true,
          topics: [mockTopics[21]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 23,
          gameName: "Garden Grow",
          gameNameVi: "Trồng vườn",
          description: "Grow your own garden",
          descriptionVi: "Trồng khu vườn của riêng bạn",
          imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
          urlGame: "https://example.com/garden-grow",
          numLiked: 127,
          difficultyLevel: "medium",
          estimatedDuration: 18,
          isActive: true,
          topics: [mockTopics[22], mockTopics[6]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 24,
          gameName: "Farm Life",
          gameNameVi: "Cuộc sống nông trại",
          description: "Experience life on a farm",
          descriptionVi: "Trải nghiệm cuộc sống ở nông trại",
          imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400",
          urlGame: "https://example.com/farm-life",
          numLiked: 201,
          difficultyLevel: "medium",
          estimatedDuration: 20,
          isActive: true,
          topics: [mockTopics[23], mockTopics[0]],
          ages: [mockAges[0], mockAges[1], mockAges[2]]
        },
        {
          gameId: 25,
          gameName: "Zoo Adventure",
          gameNameVi: "Phiêu lưu sở thú",
          description: "Visit the zoo and meet animals",
          descriptionVi: "Thăm sở thú và gặp các con vật",
          imageUrl: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400",
          urlGame: "https://example.com/zoo-adventure",
          numLiked: 183,
          difficultyLevel: "easy",
          estimatedDuration: 10,
          isActive: true,
          topics: [mockTopics[24], mockTopics[0]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 26,
          gameName: "Dinosaur World",
          gameNameVi: "Thế giới khủng long",
          description: "Explore the world of dinosaurs",
          descriptionVi: "Khám phá thế giới khủng long",
          imageUrl: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400",
          urlGame: "https://example.com/dinosaur-world",
          numLiked: 256,
          difficultyLevel: "hard",
          estimatedDuration: 25,
          isActive: true,
          topics: [mockTopics[25]],
          ages: [mockAges[2]]
        },
        {
          gameId: 27,
          gameName: "Bug Catcher",
          gameNameVi: "Bắt côn trùng",
          description: "Catch and learn about insects",
          descriptionVi: "Bắt và tìm hiểu về côn trùng",
          imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400",
          urlGame: "https://example.com/bug-catcher",
          numLiked: 91,
          difficultyLevel: "easy",
          estimatedDuration: 8,
          isActive: true,
          topics: [mockTopics[26], mockTopics[6]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 28,
          gameName: "Bird Watch",
          gameNameVi: "Quan sát chim",
          description: "Observe different types of birds",
          descriptionVi: "Quan sát các loại chim khác nhau",
          imageUrl: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400",
          urlGame: "https://example.com/bird-watch",
          numLiked: 104,
          difficultyLevel: "medium",
          estimatedDuration: 12,
          isActive: false,
          topics: [mockTopics[27], mockTopics[0]],
          ages: [mockAges[1]]
        },
        {
          gameId: 29,
          gameName: "Pet Care",
          gameNameVi: "Chăm sóc thú cưng",
          description: "Take care of your virtual pet",
          descriptionVi: "Chăm sóc thú cưng ảo của bạn",
          imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400",
          urlGame: "https://example.com/pet-care",
          numLiked: 215,
          difficultyLevel: "medium",
          estimatedDuration: 20,
          isActive: true,
          topics: [mockTopics[28], mockTopics[0]],
          ages: [mockAges[0], mockAges[1], mockAges[2]]
        },
        {
          gameId: 30,
          gameName: "Wild Safari",
          gameNameVi: "Safari hoang dã",
          description: "Go on a safari adventure",
          descriptionVi: "Đi phiêu lưu safari",
          imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400",
          urlGame: "https://example.com/wild-safari",
          numLiked: 178,
          difficultyLevel: "hard",
          estimatedDuration: 22,
          isActive: true,
          topics: [mockTopics[29], mockTopics[0]],
          ages: [mockAges[2]]
        },
        {
          gameId: 31,
          gameName: "House Builder",
          gameNameVi: "Xây nhà",
          description: "Design and build houses",
          descriptionVi: "Thiết kế và xây dựng ngôi nhà",
          imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
          urlGame: "https://example.com/house-builder",
          numLiked: 139,
          difficultyLevel: "medium",
          estimatedDuration: 18,
          isActive: true,
          topics: [mockTopics[30]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 32,
          gameName: "Furniture Shop",
          gameNameVi: "Cửa hàng đồ nội thất",
          description: "Arrange furniture in rooms",
          descriptionVi: "Sắp xếp đồ nội thất trong phòng",
          imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
          urlGame: "https://example.com/furniture-shop",
          numLiked: 86,
          difficultyLevel: "easy",
          estimatedDuration: 10,
          isActive: true,
          topics: [mockTopics[31]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 33,
          gameName: "Chef Master",
          gameNameVi: "Đầu bếp bậc thầy",
          description: "Cook delicious meals",
          descriptionVi: "Nấu những món ăn ngon",
          imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400",
          urlGame: "https://example.com/chef-master",
          numLiked: 192,
          difficultyLevel: "hard",
          estimatedDuration: 25,
          isActive: true,
          topics: [mockTopics[32], mockTopics[37]],
          ages: [mockAges[2]]
        },
        {
          gameId: 34,
          gameName: "Fruit Basket",
          gameNameVi: "Giỏ hoa quả",
          description: "Collect and sort fruits",
          descriptionVi: "Thu thập và phân loại hoa quả",
          imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400",
          urlGame: "https://example.com/fruit-basket",
          numLiked: 148,
          difficultyLevel: "easy",
          estimatedDuration: 8,
          isActive: true,
          topics: [mockTopics[33], mockTopics[7]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 35,
          gameName: "Veggie Garden",
          gameNameVi: "Vườn rau củ",
          description: "Grow and harvest vegetables",
          descriptionVi: "Trồng và thu hoạch rau củ",
          imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
          urlGame: "https://example.com/veggie-garden",
          numLiked: 112,
          difficultyLevel: "medium",
          estimatedDuration: 15,
          isActive: false,
          topics: [mockTopics[34], mockTopics[22]],
          ages: [mockAges[1]]
        },
        {
          gameId: 36,
          gameName: "Juice Bar",
          gameNameVi: "Quầy nước ép",
          description: "Make fresh juices",
          descriptionVi: "Pha chế nước ép tươi",
          imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
          urlGame: "https://example.com/juice-bar",
          numLiked: 167,
          difficultyLevel: "easy",
          estimatedDuration: 10,
          isActive: true,
          topics: [mockTopics[35], mockTopics[33]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 37,
          gameName: "Bakery Time",
          gameNameVi: "Giờ làm bánh",
          description: "Bake cakes and cookies",
          descriptionVi: "Nướng bánh ngọt và bánh quy",
          imageUrl: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400",
          urlGame: "https://example.com/bakery-time",
          numLiked: 203,
          difficultyLevel: "medium",
          estimatedDuration: 18,
          isActive: true,
          topics: [mockTopics[36], mockTopics[37]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 38,
          gameName: "Kitchen Helper",
          gameNameVi: "Trợ lý nhà bếp",
          description: "Help in the kitchen",
          descriptionVi: "Giúp việc trong bếp",
          imageUrl: "https://images.unsplash.com/photo-1556910636-196567c5c34f?w=400",
          urlGame: "https://example.com/kitchen-helper",
          numLiked: 95,
          difficultyLevel: "easy",
          estimatedDuration: 12,
          isActive: true,
          topics: [mockTopics[37]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 39,
          gameName: "Paint Studio",
          gameNameVi: "Xưởng vẽ",
          description: "Create beautiful paintings",
          descriptionVi: "Tạo những bức tranh đẹp",
          imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
          urlGame: "https://example.com/paint-studio",
          numLiked: 181,
          difficultyLevel: "medium",
          estimatedDuration: 20,
          isActive: true,
          topics: [mockTopics[38], mockTopics[46]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 40,
          gameName: "Dance Party",
          gameNameVi: "Tiệc khiêu vũ",
          description: "Dance to the music",
          descriptionVi: "Nhảy theo nhạc",
          imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400",
          urlGame: "https://example.com/dance-party",
          numLiked: 224,
          difficultyLevel: "hard",
          estimatedDuration: 15,
          isActive: true,
          topics: [mockTopics[39], mockTopics[5]],
          ages: [mockAges[2]]
        },
        {
          gameId: 41,
          gameName: "Story Time",
          gameNameVi: "Giờ kể chuyện",
          description: "Listen to amazing stories",
          descriptionVi: "Nghe những câu chuyện tuyệt vời",
          imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
          urlGame: "https://example.com/story-time",
          numLiked: 156,
          difficultyLevel: "easy",
          estimatedDuration: 10,
          isActive: false,
          topics: [mockTopics[40], mockTopics[41]],
          ages: [mockAges[0], mockAges[1]]
        },
        {
          gameId: 42,
          gameName: "Adventure Quest",
          gameNameVi: "Nhiệm vụ phiêu lưu",
          description: "Go on exciting quests",
          descriptionVi: "Tham gia những nhiệm vụ thú vị",
          imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400",
          urlGame: "https://example.com/adventure-quest",
          numLiked: 267,
          difficultyLevel: "hard",
          estimatedDuration: 30,
          isActive: true,
          topics: [mockTopics[42]],
          ages: [mockAges[2]]
        },
        {
          gameId: 43,
          gameName: "Jigsaw Fun",
          gameNameVi: "Ghép hình vui",
          description: "Complete jigsaw puzzles",
          descriptionVi: "Hoàn thành tranh ghép",
          imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400",
          urlGame: "https://example.com/jigsaw-fun",
          numLiked: 133,
          difficultyLevel: "medium",
          estimatedDuration: 15,
          isActive: true,
          topics: [mockTopics[43]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 44,
          gameName: "Memory Match",
          gameNameVi: "Trò chơi trí nhớ",
          description: "Test your memory skills",
          descriptionVi: "Kiểm tra kỹ năng ghi nhớ",
          imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400",
          urlGame: "https://example.com/memory-match",
          numLiked: 189,
          difficultyLevel: "medium",
          estimatedDuration: 12,
          isActive: true,
          topics: [mockTopics[44]],
          ages: [mockAges[0], mockAges[1], mockAges[2]]
        },
        {
          gameId: 45,
          gameName: "Logic Maze",
          gameNameVi: "Mê cung logic",
          description: "Solve logical puzzles",
          descriptionVi: "Giải những câu đố logic",
          imageUrl: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=400",
          urlGame: "https://example.com/logic-maze",
          numLiked: 147,
          difficultyLevel: "hard",
          estimatedDuration: 25,
          isActive: true,
          topics: [mockTopics[45]],
          ages: [mockAges[2]]
        },
        {
          gameId: 46,
          gameName: "Creative World",
          gameNameVi: "Thế giới sáng tạo",
          description: "Build your creative world",
          descriptionVi: "Xây dựng thế giới sáng tạo của bạn",
          imageUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400",
          urlGame: "https://example.com/creative-world",
          numLiked: 201,
          difficultyLevel: "medium",
          estimatedDuration: 20,
          isActive: true,
          topics: [mockTopics[46]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 47,
          gameName: "Science Lab",
          gameNameVi: "Phòng thí nghiệm",
          description: "Perform fun science experiments",
          descriptionVi: "Thực hiện thí nghiệm khoa học thú vị",
          imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
          urlGame: "https://example.com/science-lab",
          numLiked: 174,
          difficultyLevel: "hard",
          estimatedDuration: 22,
          isActive: false,
          topics: [mockTopics[47]],
          ages: [mockAges[2]]
        },
        {
          gameId: 48,
          gameName: "Magic Show",
          gameNameVi: "Biểu diễn ma thuật",
          description: "Learn magic tricks",
          descriptionVi: "Học những trò ảo thuật",
          imageUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400",
          urlGame: "https://example.com/magic-show",
          numLiked: 163,
          difficultyLevel: "medium",
          estimatedDuration: 15,
          isActive: true,
          topics: [mockTopics[48]],
          ages: [mockAges[1], mockAges[2]]
        },
        {
          gameId: 49,
          gameName: "Fantasy Land",
          gameNameVi: "Xứ sở kỳ ảo",
          description: "Explore a fantasy world",
          descriptionVi: "Khám phá thế giới kỳ ảo",
          imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
          urlGame: "https://example.com/fantasy-land",
          numLiked: 238,
          difficultyLevel: "hard",
          estimatedDuration: 28,
          isActive: true,
          topics: [mockTopics[49]],
          ages: [mockAges[2]]
        },
        {
          gameId: 50,
          gameName: "Number Ninja",
          gameNameVi: "Ninja số học",
          description: "Master math with ninja skills",
          descriptionVi: "Làm chủ toán học với kỹ năng ninja",
          imageUrl: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400",
          urlGame: "https://example.com/number-ninja",
          numLiked: 195,
          difficultyLevel: "hard",
          estimatedDuration: 20,
          isActive: true,
          topics: [mockTopics[1], mockTopics[45]],
          ages: [mockAges[2]]
        }
      ];
      
      let filtered = [...mockGames];
      
      if (query.keyword) {
        filtered = filtered.filter(g => 
          g.gameName.toLowerCase().includes(query.keyword!.toLowerCase()) ||
          g.gameNameVi.toLowerCase().includes(query.keyword!.toLowerCase())
        );
      }
      
      if (query.isActive !== undefined) {
        filtered = filtered.filter(g => g.isActive === query.isActive);
      }
      
      const page = query.page || 1;
      const pageSize = query.pageSize || 20;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      return {
        success: true,
        data: {
          games: filtered.slice(start, end),
          totalCount: filtered.length,
          currentPage: page,
          pageSize
        }
      };
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  },

  async createGame(data: AdminGameFormData): Promise<{ success: boolean; data: { gameId: number } }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: { gameId: 1 } };
    } catch (error) {
      console.error("Error creating game:", error);
      throw error;
    }
  },

  async updateGame(gameId: number, data: Partial<AdminGameFormData>): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      console.error("Error updating game:", error);
      throw error;
    }
  },

  async deleteGame(gameId: number): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      console.error("Error deleting game:", error);
      throw error;
    }
  },

  // ==================== IMPORT/EXPORT ====================
  
  async importGames(file: File, mode: "create" | "overwrite" | "merge"): Promise<ImportResult> {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        importedCount: 10,
        errors: []
      };
    } catch (error) {
      console.error("Error importing games:", error);
      throw error;
    }
  },

  async exportGames(query: AdminGamesQuery = {}): Promise<Blob> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Excel file
      const blob = new Blob(["Mock Excel Data"], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      
      return blob;
    } catch (error) {
      console.error("Error exporting games:", error);
      throw error;
    }
  },

  async downloadTemplate(): Promise<Blob> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const blob = new Blob(["Mock Template"], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      
      return blob;
    } catch (error) {
      console.error("Error downloading template:", error);
      throw error;
    }
  },

  // ==================== REORDER ====================
  
  async reorderTopics(items: ReorderItem[]): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      items.forEach(item => {
        const topic = mockTopics.find(t => t.topicId === item.id);
        if (topic) {
          topic.order = item.order;
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error reordering topics:", error);
      throw error;
    }
  },

  async reorderAges(items: ReorderItem[]): Promise<{ success: boolean }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      items.forEach(item => {
        const age = mockAges.find(a => a.ageId === item.id);
        if (age) {
          age.order = item.order;
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error reordering ages:", error);
      throw error;
    }
  }
};

