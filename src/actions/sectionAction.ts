"use server";

import { serverFetch } from "@/lib/api";
import { SectionAdminType, SectionType } from "@/types/section";

interface SectionResponse {
  data: SectionType[];
  error?: string;
  success?: boolean;
}


export async function getSectionDataByLessonId({
  userId,
  lessonId
}: {
  userId: string;
  lessonId: string;
}): Promise<SectionResponse> {
  if (!userId) {
    return {
      data: [],
      error: "UserId không được để trống"
    };
  }

  if (!lessonId) {
    return {
      data: [],
      error: "LessonId không được để trống"
    };
  }

  try {
    const data = await serverFetch(
      `/api/Section/user/${userId}/lesson/${lessonId}`
    );

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data: data as SectionType[],
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu bài học:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function getSectionContentDataBSectionId({
  userId,
  sectionId
}: {
  userId: string;
  sectionId: string;
}): Promise<SectionResponse> {
  if (!userId) {
    return {
      data: [],
      error: "UserId không được để trống"
    };
  }

  if (!sectionId) {
    return {
      data: [],
      error: "SectionId không được để trống"
    };
  }

  try {
    const data = await serverFetch(
      `/api/SectionContent/by-user-and-section?userId=${userId}&sectionId=${sectionId}`
    );

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data: data as SectionType[],
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu bài học:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function updateLockedSectionContent({userId, sectionContentId, isLocked}: {userId: string, sectionContentId: string | number, isLocked: boolean}) {
  if (!userId) {
    return {
      success: false,
      error: "UserId không được để trống"
    };
  }

  if (!sectionContentId) {
    return {
      success: false,
      error: "SectionContentId không được để trống"
    };
  }

  if (isLocked === undefined) {
    return {
      success: false,
      error: "isLocked không được để trống"
    };
  }

  try {
    const response = await serverFetch(`/api/Locked/cascadeUpdate`, {
      method: "PUT",
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      data: {
        userId,
        scId: sectionContentId,
        isLocked
      }
    });

    // Kiểm tra response từ API nếu cần
    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
    };
  } catch (error) {
  
    // Log chi tiết lỗi để debug
    console.error("Lỗi cập nhật trạng thái khóa section content", {
      error,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Có lỗi xảy ra khi cập nhật trạng thái kháo section content"
    };
  }
}

export async function updateSectionContentLocked({userId, scID}: {userId: string, scID: string}) {
  if (!userId) {
    throw new Error("UserId không được để trống");
  }

  if (!scID) {
    throw new Error("scID không được để trống");
  }

  try {
    const response = await serverFetch(`/api/Locked/updateSectionContentLocked`, {
      method: "PUT",
      data: { userId, scID }
    });

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái khóa section content", {
      error,
      timestamp: new Date().toISOString()
    });
  }
}

export async function updateSectionLocked({userId, sectionId}: {userId: string, sectionId: string}) {
  if (!userId) {
    throw new Error("UserId không được để trống");
  }

  if (!sectionId) {
    throw new Error("sectionId không được để trống");
  }

  try {
    const response = await serverFetch(`/api/Locked/updateSectionLocked`, {
      method: "PUT",
      data: { userId, sectionId }
    });

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái khóa section", {
      error,
      timestamp: new Date().toISOString()
    });
  }
}

//Admin
export async function createSectionAdminData({
  sectionData,
  lessonId
}: {
  sectionData: SectionType[];
  lessonId: number;
}): Promise<SectionResponse> {
  try {
    const response = await serverFetch(`/api/Section/createAndLinkToLesson`, {
      method: "POST",
      data: {
        lessonId,
        sections: sectionData
      }
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi tạo dữ liệu section:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo dữ liệu section",
      data: []
    };
  }
}

export async function getSingleSectionAdminData({sectionId}: {sectionId: number}): Promise<{data: SectionAdminType | null, error: string | undefined}> {
  try {
    const data = await serverFetch(`/api/Section/${sectionId}`);
    
    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu bài học:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function updateSectionAdminData({sectionId, lessonId, sectionData}: {sectionId: number, lessonId: number, sectionData: SectionAdminType}): Promise<SectionResponse> {
  try {
    const response = await serverFetch(`/api/Section/${sectionId}/${lessonId}`, {
      method: "PUT",
      data: sectionData
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu section:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật dữ liệu section",
      data: []
    };
  }
}

export async function getSectionAdminDataByLessonId({lessonId}: {lessonId: number}): Promise<SectionResponse> {
  try {
    const data = await serverFetch(`/api/Section/lesson/${lessonId}`);
    return {
      success: true,
      data: data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu section:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu section",
      data: []
    };
  }
}

export async function deleteSectionAdminData({sectionIds, lessonId}: {sectionIds: number[], lessonId: number}) {
  if (!sectionIds?.length || !lessonId) {
    throw new Error("sectionIds và lessonId là bắt buộc");
  }

  const response = await serverFetch(`/api/Section/removeFromLesson`, {
    method: "DELETE",
    data: { sectionIds, lessonId }
  });

  if (!response) {
    throw new Error("Không nhận được phản hồi từ server");
  }

  return response;
}
