"use server";

import { serverFetch } from "@/lib/api";
import { 
  GameAge, 
  GameAgeFormData, 
  ReorderAgeItem
} from "@/types/admin-game";

// ============ Request/Response Types ============

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

// Create Topic Response
interface CreateAgeResponse {
  success: boolean;
  message?: string;
  data?: {
    age_id: number;
  };
}

// ============ API Functions ============

export async function getAllAges(params: GetAgesParams = {}): Promise<GetAgesResponse> {
  const { page = 1, pageSize = 10, keyword } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (keyword) {
    queryParams.append("keyword", keyword);
  }

  const response = await serverFetch(
    `/api/Age?${queryParams.toString()}`,
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

export async function createAge(data: GameAgeFormData): Promise<CreateAgeResponse> {
  console.log("📥 createAge action called with data:", data);

  const requestBody = {
    ages: [
      {
        age_name: data.age_name,
        age_name_en: data.age_name_en,
        description: data.description || "",
        min_age: data.min_age,
        max_age: data.max_age,
        order: data.order,
      }
    ]
  };

  console.log("🚀 Create Age Request Body:", JSON.stringify(requestBody, null, 2));

  const response = await serverFetch(
    `/api/Age`,
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
      message: response?.message || "Failed to create age",
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

export async function updateAge(ageId: number, data: Partial<GameAgeFormData>): Promise<{ success: boolean; message?: string }> {
  const ageData: any = {
    age_id: ageId,
  };
  
  if (data.age_name !== undefined) ageData.age_name = data.age_name;
  if (data.age_name_en !== undefined) ageData.age_name_en = data.age_name_en;
  if (data.description !== undefined) ageData.description = data.description;
  if (data.min_age !== undefined) ageData.min_age = data.min_age;
  if (data.max_age !== undefined) ageData.max_age = data.max_age;
  if (data.order !== undefined) ageData.order = data.order;

  const response = await serverFetch(
    `/api/Age`,
    {
      method: "PATCH",
      data: {
        ages: [ageData]
      },
    }
  );

  if (!response || !response.success) {
    console.error("❌ Update Age Error Response:", {
      statusCode: response?.statusCode,
      message: response?.message,
      errors: response?.errors,
    });

    // Create detailed error object
    const errors = Array.isArray(response?.errors) ? response.errors : [];
    const errorData = {
      statusCode: response?.statusCode,
      message: response?.message || "Failed to update age",
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

export async function deleteAge(ageId: number): Promise<{ success: boolean; message?: string }> {
  const response = await serverFetch(
    `/api/Age`,
    {
      method: "DELETE",
      data: {
        ages: [
          {
            age_id: ageId
          }
        ]
      },
    }
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to delete age");
  }

  return { 
    success: true,
    message: response.message 
  };
}

export async function deleteAges(ageIds: number[]): Promise<{ success: boolean; message?: string }> {
  const response = await serverFetch(
    `/api/Age`,
    {
      method: "DELETE",
      data: {
        ages: ageIds.map(id => ({
          age_id: id
        }))
      },
    }
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to delete ages");
  }

  return { 
    success: true,
    message: response.message 
  };
}

    export async function reorderAges(items: ReorderAgeItem[]): Promise<{ success: boolean; message?: string }> {
  const response = await serverFetch(
    `/api/Age`,
    {
      method: "PATCH",
      data: {
        ages: items.map(item => ({
          age_id: item.age_id,
          order: item.order,
        }))
      },
    }
  );

  if (!response || !response.success) {
    throw new Error(response?.message || "Failed to reorder ages");
  }

  return { 
    success: true,
    message: response.message 
  };
}

