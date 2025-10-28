// Admin Game Management Types
// Using snake_case to match API directly

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface TopicsListData {
  items: GameTopic[];
  total: number;
}

// Game Topic (snake_case)
export interface GameTopic {
  topic_id: number;
  topic_name: string;
  topic_name_vi: string;
  description?: string;
  icon_url?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  game_count?: number;
}

// Game Age (snake_case)
export interface GameAge {
  age_id: number;
  age_name: string;
  age_name_en: string;
  description?: string;
  min_age: number;
  max_age: number;
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Admin Game (snake_case)
export interface AdminGame {
  game_id: number;
  game_name: string;
  game_name_vi: string;
  description?: string;
  description_vi?: string;
  image_url?: string;
  url_game: string;
  num_liked: number;
  difficulty_level: "easy" | "medium" | "hard";
  estimated_duration: number;
  is_active: boolean;
  topics: Array<{
    topic_id: number;
    topic_name: string;
    topic_name_vi: string;
  }>;
  ages: Array<{
    age_id: number;
    age_name: string;
    age_name_en: string;
    min_age: number;
    max_age: number;
  }>;
  created_at?: string;
  updated_at?: string;
  // User-specific fields
  is_self_liked?: boolean;
  self_progress_info?: any;
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

// Form Data (snake_case)
// Note: is_active is optional for create (backend sets default), required for update
export interface GameTopicFormData {
  topic_name: string;
  topic_name_vi: string;
  description?: string;
  icon_url?: string;
  order: number;
  is_active?: boolean;
}

// Game Age Form Data (snake_case)
export interface GameAgeFormData {
  age_name: string;
  age_name_en: string;
  description?: string;
  min_age: number;
  max_age: number;
  order: number;
}

// Admin Game Form Data (snake_case)
export interface AdminGameFormData {
  game_name: string;
  game_name_vi: string;
  description?: string;
  description_vi?: string;
  image_url?: string;
  url_game: string;
  difficulty_level: "easy" | "medium" | "hard";
  estimated_duration: number;
  is_active: boolean;
  topic_ids: number[];
  age_ids: number[];
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
  topic_id: number;
  order: number;
}

export interface ReorderAgeItem {
  age_id: number;
  order: number;
}

export interface ReorderGameItem {
  game_id: number;
  order: number;
}

// Game Form Data (snake_case)
export interface GameFormData {
  game_name: string;
  game_name_vi: string;
  description?: string;
  image_url?: string;
  url_game: string;
  difficulty_level: "easy" | "medium" | "hard";
  estimated_duration: number;
  is_active?: boolean; // Optional - only used for update
  order: number;
  topic_ids: number[];
  age_ids: number[];
}