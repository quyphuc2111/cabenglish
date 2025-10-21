export interface Game {
  gameId: number;
  gameName: string;
  gameNameVi: string;
  description: string;
  imageUrl: string;
  urlGame: string;
  numLiked: number;
  topics: string[];
  ageGroups: string[];
  difficultyLevel: "easy" | "medium" | "hard";
  estimatedDuration: number;
  isLikedByUser: boolean;
  isPlayedByUser: boolean;
}

export interface GamesResponse {
  success: boolean;
  data: {
    games: Game[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface GamesQueryParams {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  ageGroup?: string;
  topic?: string | string[];
  search?: string;
}

