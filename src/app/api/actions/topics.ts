"use server";

import { serverFetch } from "@/lib/api";
import { 
  GameTopic, 
  GameTopicFormData, 
  ReorderItem,
} from "@/types/admin-game";

// ============ Request/Response Types ============

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

// Create Topic Response
interface CreateTopicResponse {
  success: boolean;
  message?: string;
  data?: {
    topic_id: number;
  };
}

// ============ API Functions ============

export async function getAllTopics(params: GetTopicsParams = {}): Promise<GetTopicsResponse> {
  const { page = 1, pageSize = 10, keyword } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (keyword) {
    queryParams.append("keyword", keyword);
  }

  const response = await serverFetch(
    `/api/Topic?${queryParams.toString()}`,
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
    };
  }

  return {
    data: response.data.items,
    totalCount: response.data.total || 0,
    currentPage: page,
    pageSize,
  };
}

export async function createTopic(data: GameTopicFormData): Promise<CreateTopicResponse> {
  console.log("📥 createTopic action called with data:", data);

  const requestBody = {
    topics: [
      {
        topic_name: data.topic_name,
        topic_name_vi: data.topic_name_vi,
        description: data.description || "",
        icon_url: data.icon_url || "",
        order: data.order,
      }
    ]
  };

  console.log("🚀 Create Topic Request Body:", JSON.stringify(requestBody, null, 2));

  const response = await serverFetch(
    `/api/Topic`,
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
      message: response?.message || "Failed to create topic",
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

export async function updateTopic(topicId: number, data: Partial<GameTopicFormData>): Promise<{ success: boolean; message?: string }> {
  const topicData: any = {
    topic_id: topicId,
  };
  
  if (data.topic_name !== undefined) topicData.topic_name = data.topic_name;
  if (data.topic_name_vi !== undefined) topicData.topic_name_vi = data.topic_name_vi;
  if (data.description !== undefined) topicData.description = data.description;
  if (data.icon_url !== undefined) topicData.icon_url = data.icon_url;
  if (data.order !== undefined) topicData.order = data.order;
  if (data.is_active !== undefined) topicData.is_active = data.is_active;

  const response = await serverFetch(
    `/api/Topic`,
    {
      method: "PATCH",
      data: {
        topics: [topicData]
      },
    }
  );

  if (!response || !response.success) {
    console.error("❌ Update Topic Error Response:", {
      statusCode: response?.statusCode,
      message: response?.message,
      errors: response?.errors,
    });

    // Create detailed error object
    const errors = Array.isArray(response?.errors) ? response.errors : [];
    const errorData = {
      statusCode: response?.statusCode,
      message: response?.message || "Failed to update topic",
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

export async function deleteTopic(topicId: number): Promise<{ success: boolean; message?: string }> {
  const response = await serverFetch(
    `/api/Topic`,
    {
      method: "DELETE",
      data: {
        topics: [
          {
            topic_id: topicId
          }
        ]
      },
    }
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to delete topic");
  }

  return { 
    success: true,
    message: response.message 
  };
}

export async function deleteTopics(topicIds: number[]): Promise<{ success: boolean; message?: string }> {
  const response = await serverFetch(
    `/api/Topic`,
    {
      method: "DELETE",
      data: {
        topics: topicIds.map(id => ({
          topic_id: id
        }))
      },
    }
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to delete topics");
  }

  return { 
    success: true,
    message: response.message 
  };
}

export async function reorderTopics(items: ReorderItem[]): Promise<{ success: boolean; message?: string }> {
  const response = await serverFetch(
    `/api/Topic`,
    {
      method: "PATCH",
      data: {
        topics: items.map(item => ({
          topic_id: item.topic_id,
          order: item.order,
        }))
      },
    }
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to reorder topics");
  }

  return { 
    success: true,
    message: response.message 
  };
}

