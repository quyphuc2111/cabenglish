// Admin Game Management Types

export interface GameTopic {
  topicId: number;
  topicName: string;
  topicNameVi: string;
  description?: string;
  iconUrl?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameAge {
  ageId: number;
  ageName: string;
  ageNameEn: string;
  description?: string;
  minAge: number;
  maxAge: number;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminGame {
  gameId: number;
  gameName: string;
  gameNameVi: string;
  description?: string;
  descriptionVi?: string;
  imageUrl?: string;
  urlGame: string;
  numLiked: number;
  difficultyLevel: "easy" | "medium" | "hard";
  estimatedDuration: number;
  isActive: boolean;
  topics: GameTopic[];
  ages: GameAge[];
  createdAt?: string;
  updatedAt?: string;
}

// Query Parameters
export interface AdminGameTopicsQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  isActive?: boolean;
}

export interface AdminGameAgesQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface AdminGamesQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  topicIds?: number[];
  ageIds?: number[];
  isActive?: boolean;
  difficultyLevel?: string;
}

// Form Data
export interface GameTopicFormData {
  topicName: string;
  topicNameVi: string;
  description?: string;
  iconUrl?: string;
  order: number;
  isActive: boolean;
}

export interface GameAgeFormData {
  ageName: string;
  ageNameEn: string;
  description?: string;
  minAge: number;
  maxAge: number;
  order: number;
}

export interface AdminGameFormData {
  gameName: string;
  gameNameVi: string;
  description?: string;
  descriptionVi?: string;
  imageUrl?: string;
  urlGame: string;
  difficultyLevel: "easy" | "medium" | "hard";
  estimatedDuration: number;
  isActive: boolean;
  topicIds: number[];
  ageIds: number[];
}

// API Responses
export interface AdminGameTopicsResponse {
  success: boolean;
  data: {
    topics: GameTopic[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface AdminGameAgesResponse {
  success: boolean;
  data: {
    ages: GameAge[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface AdminGamesResponse {
  success: boolean;
  data: {
    games: AdminGame[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  errors: string[];
}

export interface ReorderItem {
  id: number;
  order: number;
}

