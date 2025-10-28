"use server";

import { serverFetch } from "@/lib/api";
import { 
  Game, 
  GameFormData, 
  ReorderGameItem
} from "@/types/admin-game";

// ============ Request/Response Types ============

interface GetGamesParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  topicIds?: number[];
  ageIds?: number[];
  difficultyLevel?: "easy" | "medium" | "hard";
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface GetGamesResponse {
  data: Game[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Create Game Response
interface CreateGameResponse {
  success: boolean;
  message?: string;
  data?: {
    game_id: number;
  };
}

// Game Progress Types
export interface GetGameProgressParams {
  topicIds?: number[];
  ageIds?: number[];
}

export interface GameProgressData {
  total_active_games: number;
  total_played_games: number;
  progress_percentage: number;
  last_played_game: {
    game_id: number;
    game_name: string;
    played_at: string;
  } | null;
  filter_applied: {
    topic_ids: number[];
    age_ids: number[];
  };
}

export interface GetGameProgressResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: GameProgressData;
}

// ============ API Functions ============

export async function getAllGames(params: GetGamesParams = {}): Promise<GetGamesResponse> {
  const { 
    page = 1, 
    pageSize = 10, 
    keyword,
    topicIds,
    ageIds,
    difficultyLevel,
    isActive,
    sortBy = "order",
    sortOrder = "asc"
  } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  if (keyword) {
    queryParams.append("keyword", keyword);
  }

  if (topicIds && topicIds.length > 0) {
    topicIds.forEach(id => queryParams.append("topicIds", id.toString()));
  }

  if (ageIds && ageIds.length > 0) {
    ageIds.forEach(id => queryParams.append("ageIds", id.toString()));
  }

  if (difficultyLevel) {
    queryParams.append("difficultyLevel", difficultyLevel);
  }

  if (isActive !== undefined) {
    queryParams.append("isActive", isActive.toString());
  }

  const response = await serverFetch(
    `/api/Game?${queryParams.toString()}`,
    {
      method: "GET",
    }
  );

  if (!response || !response.success) {
    return {
      data: [],
      totalCount: 0,
      currentPage: page,
      pageSize,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  return {
    data: response.data.items,
    totalCount: response.data.total || 0,
    currentPage: response.data.current_page || page,
    pageSize: response.data.items_per_page || pageSize,
    totalPages: response.data.total_pages || 0,
    hasNextPage: response.data.has_next_page || false,
    hasPreviousPage: response.data.has_previous_page || false,
  };
}

export async function createGame(data: GameFormData): Promise<CreateGameResponse> {
  console.log("📥 createGame action called with data:", data);
  
  const requestBody = {
    games: [
      {
        game_name: data.game_name,
        game_name_vi: data.game_name_vi,
        description: data.description || "",
        image_url: data.image_url || "",
        url_game: data.url_game,
        order: data.order,
        difficulty_level: data.difficulty_level,
        estimated_duration: data.estimated_duration,
        topic_ids: data.topic_ids,
        age_ids: data.age_ids,
      }
    ]
  };

  console.log("🚀 Create Game Request Body:", JSON.stringify(requestBody, null, 2));
  console.log(requestBody);

  const response = await serverFetch(
    `/api/Game`,
    {
      method: "POST",
      data: requestBody,
    }
  );

  console.log("📬 API Response:", response);

  if (!response || !response.success) {
    console.error("❌ API Error Response:", {
      statusCode: response?.statusCode,
      success: response?.success,
      message: response?.message,
      errors: response?.errors,
      errorsType: typeof response?.errors,
      errorsIsArray: Array.isArray(response?.errors),
      data: response?.data,
      fullResponse: response
    });
    
    // Create detailed error object
    const errors = Array.isArray(response?.errors) ? response.errors : [];
    const errorData = {
      statusCode: response?.statusCode,
      message: response?.message || "Failed to create game",
      errors: errors
    };
    
    console.log("🔍 Processed errorData:", errorData);
    
    // Combine all error info into message for display
    let errorMessage = errorData.message;
    if (response?.statusCode) {
      errorMessage = `[${response.statusCode}] ${errorMessage}`;
    }
    if (errorData.errors.length > 0) {
      console.log("✅ Adding errors to message:", errorData.errors);
      errorMessage = `${errorMessage}\n${errorData.errors.join('\n')}`;
    } else {
      console.warn("⚠️ No errors array found or empty");
    }
    
    console.log("📝 Final error message:", errorMessage);
    
    const error = new Error(errorMessage);
    (error as any).statusCode = errorData.statusCode;
    (error as any).errors = errorData.errors;
    throw error;
  }

  return {
    success: true,
    message: response.message,
    data: response.data,
  };
}

export async function updateGame(gameId: number, data: Partial<GameFormData>): Promise<{ success: boolean; message?: string }> {
  const gameData: any = {
    game_id: gameId,
  };
  
  if (data.game_name !== undefined) gameData.game_name = data.game_name;
  if (data.game_name_vi !== undefined) gameData.game_name_vi = data.game_name_vi;
  if (data.description !== undefined) gameData.description = data.description;
  if (data.image_url !== undefined) gameData.image_url = data.image_url;
  if (data.url_game !== undefined) gameData.url_game = data.url_game;
  if (data.difficulty_level !== undefined) gameData.difficulty_level = data.difficulty_level;
  if (data.estimated_duration !== undefined) gameData.estimated_duration = data.estimated_duration;
  if (data.is_active !== undefined) gameData.is_active = data.is_active;
  if (data.order !== undefined) gameData.order = data.order;
  if (data.topic_ids !== undefined) gameData.topic_ids = data.topic_ids;
  if (data.age_ids !== undefined) gameData.age_ids = data.age_ids;

  const response = await serverFetch(
    `/api/Game`,
    {
      method: "PATCH",
      data: {
        games: [gameData]
      },
    }
  );

  if (!response || !response.success) {
    console.error("❌ Update Game Error Response:", {
      statusCode: response?.statusCode,
      message: response?.message,
      errors: response?.errors,
    });

    // Create detailed error object
    const errors = Array.isArray(response?.errors) ? response.errors : [];
    const errorData = {
      statusCode: response?.statusCode,
      message: response?.message || "Failed to update game",
      errors: errors
    };
    
    // Combine all error info into message for display
    let errorMessage = errorData.message;
    if (response?.statusCode) {
      errorMessage = `[${response.statusCode}] ${errorMessage}`;
    }
    if (errorData.errors.length > 0) {
      errorMessage = `${errorMessage}\n${errorData.errors.join('\n')}`;
    }
    
    const error = new Error(errorMessage);
    (error as any).statusCode = errorData.statusCode;
    (error as any).errors = errorData.errors;
    throw error;
  }

  return { 
    success: true,
    message: response.message 
  };
}

export async function deleteGame(gameId: number): Promise<{ success: boolean; message?: string }> {
  const response = await serverFetch(
    `/api/Game`,
    {
      method: "DELETE",
      data: {
        games: [
          {
            game_id: gameId
          }
        ]
      },
    }
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to delete game");
  }

  return { 
    success: true,
    message: response.message 
  };
}

export async function deleteGames(gameIds: number[]): Promise<{ success: boolean; message?: string }> {
  const response = await serverFetch(
    `/api/Game`,
    {
      method: "DELETE",
      data: {
        games: gameIds.map(id => ({
          game_id: id
        }))
      },
    }
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to delete games");
  }

  return { 
    success: true,
    message: response.message 
  };
}

export async function reorderGames(items: ReorderGameItem[]): Promise<{ success: boolean; message?: string }> {
  const response = await serverFetch(
    `/api/Game`,
    {
      method: "PATCH",
      data: {
        games: items.map(item => ({
          game_id: item.game_id,
          order: item.order,
        }))
      },
    }
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to reorder games");
  }

  return { 
    success: true,
    message: response.message 
  };
}

// ============ Game Progress ============

export async function getGameProgress(params: GetGameProgressParams = {}): Promise<GetGameProgressResponse> {
  const { topicIds, ageIds } = params;
  
  const queryParams = new URLSearchParams();

  if (topicIds && topicIds.length > 0) {
    topicIds.forEach(id => queryParams.append("topicIds", id.toString()));
  }

  if (ageIds && ageIds.length > 0) {
    ageIds.forEach(id => queryParams.append("ageIds", id.toString()));
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/api/Game/progress?${queryString}` : `/api/Game/progress`;

  const response = await serverFetch(url, {
    method: "GET",
  });

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to fetch game progress");
  }

  return response as GetGameProgressResponse;
}