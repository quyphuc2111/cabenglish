"use server";
import { serverFetch } from "@/lib/api";
import { SectionContentAdminType, SectionContentType } from "@/types/section";

interface SectionContentResponse {
  success: boolean;
  data: SectionContentType[];
  error?: string;
}

export async function updateSectionContentLocked({
  userId,
  scID
}: {
  userId: string;
  scID: string | number;
}) {
  if (!userId) {
    return {
      success: false,
      error: "UserId không được để trống"
    };
  }

  if (!scID) {
    return {
      success: false,
      error: "SectionContentId không được để trống"
    };
  }

  try {
    const response = await serverFetch(
      `/api/Locked/updateSectionContentLocked`,
      {
        method: "PUT",
        data: {
          userId,
          scID
        }
      }
    );

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true
    };
  } catch (error) {
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
export async function getSectionContentBySectionId({
  sectionId
}: {
  sectionId: number;
}): Promise<SectionContentResponse> {
  try {
    const data = await serverFetch(
      `/api/SectionContent/by-section/${sectionId}`
    );
    return {
      success: true,
      data: data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu section content:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lấy dữ liệu section content",
      data: []
    };
  }
}

export async function createSectionContentAdminData({
  sectionContentData,
  sectionId
}: {
  sectionContentData: SectionContentAdminType[];
  sectionId: number;
}): Promise<SectionContentResponse> {
  try {
    const response = await serverFetch(
      `/api/SectionContent/to-section/${sectionId}`,
      {
        method: "POST",
        data: sectionContentData
      }
    );

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi tạo dữ liệu section content:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tạo dữ liệu section content",
      data: []
    };
  }
}

export async function updateSectionContentAdminData({
  sectionId,
  sectionContentData
}: {
  sectionId: number;
  sectionContentData: SectionContentAdminType;
}): Promise<SectionContentResponse> {
  try {
    const response = await serverFetch(
      `/api/SectionContent/in-section/${sectionId}`,
      {
        method: "PUT",
        data: sectionContentData
      }
    );

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu section content:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật dữ liệu section content",
      data: []
    };
  }
}

export async function deleteSectionContentAdminData({
  sectionId,
  sectionContentIds
}: {
  sectionId: number;
  sectionContentIds: number[];
}) {
  if (!sectionId || !sectionContentIds?.length) {
    throw new Error("sectionId và sectionContentIds là bắt buộc");
  }

  const response = await serverFetch(
    `/api/SectionContent/from-section/${sectionId}`,
    {
      method: "DELETE",
      data: sectionContentIds
    }
  );

  if (!response) {
    throw new Error("Không nhận được phản hồi từ server");
  }

  return response;
}
