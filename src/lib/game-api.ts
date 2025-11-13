/**
 * Client-side Game API functions
 * Uses clientFetch for authenticated requests from the browser
 */

import { clientFetch } from "@/lib/api";
import type { GameAge, GameTopic } from "@/types/admin-game";

// ============ Types ============

// Ages
interface GetAgesParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

interface GetAgesResponse {
  data: GameAge[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Topics
interface GetTopicsParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

interface GetTopicsResponse {
  data: GameTopic[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Game Progress
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

// Game interactions

export interface ToggleLikeResponse {
  success: boolean;
  message: string;
  data: {
    game_id: number;
    is_liked: boolean;
    total_likes: number;
  };
}

export interface UpdatePlayTimeResponse {
  success: boolean;
  message: string;
  data: {
    game_id: number;
    total_play_time: number;
    play_count: number;
  };
}

export interface MarkAsPlayedResponse {
  success: boolean;
  message: string;
  data: {
    game_id: number;
    played_at: string;
  };
}

// ============ API Functions ============

// ============ Ages API ============

/**
 * Get all ages (client-side)
 * GET /api/Age
 */
export async function getAges(params: GetAgesParams = {}): Promise<GetAgesResponse> {
  const { page = 1, pageSize = 10, keyword } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (keyword) {
    queryParams.append("keyword", keyword);
  }

  try {
    const response = await clientFetch(`/api/Age?${queryParams.toString()}`, {
      method: "GET",
    });

    if (!response || !response.success) {
      return {
        data: [],
        totalCount: 0,
        currentPage: page,
        pageSize,
      };
    }

    return {
      data: response.data.items,
      totalCount: response.data.total || 0,
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    console.error("Error fetching ages:", error);
    return {
      data: [],
      totalCount: 0,
      currentPage: page,
      pageSize,
    };
  }
}

// ============ Topics API ============

/**
 * Get all topics (client-side)
 * GET /api/Topic
 */
export async function getTopics(params: GetTopicsParams = {}): Promise<GetTopicsResponse> {
  const { page = 1, pageSize = 10, keyword } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (keyword) {
    queryParams.append("keyword", keyword);
  }

  try {
    const response = await clientFetch(`/api/Topic?${queryParams.toString()}`, {
      method: "GET",
    });

    if (!response || !response.success) {
      return {
        data: [],
        totalCount: 0,
        currentPage: page,
        pageSize,
      };
    }

    return {
      data: response.data.items,
      totalCount: response.data.total || 0,
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    console.error("Error fetching topics:", error);
    return {
      data: [],
      totalCount: 0,
      currentPage: page,
      pageSize,
    };
  }
}

// ============ Game Progress API ============

/**
 * Get game progress (client-side)
 * GET /api/Game/progress
 */
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

  try {
    const response = await clientFetch(url, {
      method: "GET",
    });

    if (!response || !response.success) {
      throw new Error(response?.message || "Failed to fetch game progress");
    }

    return response as GetGameProgressResponse;
  } catch (error) {
    console.error("Error fetching game progress:", error);
    throw error;
  }
}

// ============ Game Interactions API ============

/**
 * Toggle like/unlike a game
 * POST /api/Game/like/{gameId}
 */
export async function toggleLikeGame(gameId: number): Promise<ToggleLikeResponse> {
  try {
    const response = await clientFetch(`/api/Game/like/${gameId}`, {
      method: "POST",
    });

    if (!response || !response.success) {
      throw new Error(response?.message || "Failed to toggle like");
    }

    return response;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
}

/**
 * Update play time for a game
 * PUT /api/Game/played/${gameId}
 */
export async function updatePlayTime(
  gameId: number,
  playTimeSeconds: number
): Promise<UpdatePlayTimeResponse> {
  try {
    const response = await clientFetch(`/api/Game/played/${gameId}`, {
      method: "PUT",
      data: {
        play_time_seconds: playTimeSeconds,
      },
    });

    if (!response || !response.success) {
      throw new Error(response?.message || "Failed to update play time");
    }

    return response;
  } catch (error) {
    console.error("Error updating play time:", error);
    throw error;
  }
}

/**
 * Mark a game as played
 * PUT /api/Game/played/{gameId}
 * @param gameId - ID của game
 * @param playTimeSeconds - Thời gian chơi (giây) sẽ được cộng vào total_play_time
 */
export async function markGameAsPlayed(
  gameId: number,
  playTimeSeconds: number
): Promise<MarkAsPlayedResponse> {
  try {
    const response = await clientFetch(`/api/Game/played/${gameId}`, {
      method: "PUT",
      data: {
        play_time: playTimeSeconds,
      },
    });

    if (!response || !response.success) {
      throw new Error(response?.message || "Failed to mark game as played");
    }

    return response;
  } catch (error) {
    console.error("Error marking game as played:", error);
    throw error;
  }
}

