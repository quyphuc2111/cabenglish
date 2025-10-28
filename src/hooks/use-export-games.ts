import { useState } from 'react';
import { Game } from '@/types/admin-game';
import { showToast } from '@/utils/toast-config';
import { apiClient } from '@/lib/axios-interceptor';

export type ExportOption = 'all' | 'selected' | 'filtered';

interface ExportGamesParams {
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

interface UseExportGamesParams {
  selected_games?: Game[];
  filter_params?: ExportGamesParams;
  has_filters?: boolean;
}

interface ExportResult {
  success: boolean;
  count: number;
}

export function useExportGames() {
  const [is_exporting, set_is_exporting] = useState(false);

  // Extract filename từ Content-Disposition header
  const extract_filename_from_header = (content_disposition: string | null): string => {
    if (!content_disposition) {
      return `games_export_${new Date().getTime()}.xlsx`;
    }

    // Parse filename từ: attachment; filename=Games_Export_20251027_091748.xlsx
    const filename_match = content_disposition.match(/filename\*?=['"]?(?:UTF-\d+'')?([^;\r\n"']*)['"]?/i);
    if (filename_match && filename_match[1]) {
      return decodeURIComponent(filename_match[1]);
    }

    return `games_export_${new Date().getTime()}.xlsx`;
  };

  // Download blob file với filename từ response header
  const download_blob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Call API export trực tiếp từ client để lấy headers
  // Note: Không dùng server action vì:
  // 1. Cần access response headers để lấy filename từ Content-Disposition
  // 2. Server actions không thể return Blob (serialize qua JSON)
  const call_export_api = async (params: ExportGamesParams = {}): Promise<{ blob: Blob; filename: string }> => {
    const { 
      keyword,
      topicIds,
      ageIds,
      difficultyLevel,
      isActive,
      sortBy = "order",
      sortOrder = "asc"
    } = params;
    
    // Build URLSearchParams theo format: topicIds=1&topicIds=2
    const query_params = new URLSearchParams();
    query_params.append('sortBy', sortBy);
    query_params.append('sortOrder', sortOrder);

    if (keyword) {
      query_params.append('keyword', keyword);
    }

    if (topicIds && topicIds.length > 0) {
      topicIds.forEach(id => query_params.append('topicIds', id.toString()));
    }

    if (ageIds && ageIds.length > 0) {
      ageIds.forEach(id => query_params.append('ageIds', id.toString()));
    }

    if (difficultyLevel) {
      query_params.append('difficultyLevel', difficultyLevel);
    }

    if (isActive !== undefined) {
      query_params.append('isActive', isActive.toString());
    }

    // Sử dụng apiClient với axios interceptor (tự động handle auth & refresh token)
    const response = await apiClient.get(`/api/Game/export?${query_params.toString()}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    const blob = response.data;
    const content_disposition = response.headers['content-disposition'];
    const filename = extract_filename_from_header(content_disposition);

    return { blob, filename };
  };

  // Export tất cả games
  const export_all_games = async (): Promise<ExportResult> => {
    try {
      // Gọi API export không có filter - lấy tất cả
      const { blob, filename } = await call_export_api({
        sortBy: 'order',
        sortOrder: 'asc'
      });

      download_blob(blob, filename);
      
      return {
        success: true,
        count: 0 // API không trả về count
      };
    } catch (error) {
      console.error('Export all games error:', error);
      throw error;
    }
  };

  // Export games đã chọn
  const export_selected_games = async (selected_games: Game[]): Promise<ExportResult> => {
    try {
      if (selected_games.length === 0) {
        throw new Error('Vui lòng chọn ít nhất 1 game để xuất');
      }

      // API không hỗ trợ export theo danh sách IDs
      throw new Error('Tính năng xuất games đã chọn chưa được hỗ trợ bởi API');
    } catch (error) {
      console.error('Export selected games error:', error);
      throw error;
    }
  };

  // Export games theo bộ lọc
  const export_filtered_games = async (filter_params: ExportGamesParams): Promise<ExportResult> => {
    try {
      // Không truyền page và pageSize để lấy tất cả theo filter
      const { page, pageSize, ...rest_params } = filter_params;
      
      const { blob, filename } = await call_export_api({
        ...rest_params,
        sortBy: filter_params.sortBy || 'order',
        sortOrder: filter_params.sortOrder || 'asc'
      });

      download_blob(blob, filename);

      return {
        success: true,
        count: 0 // API không trả về count
      };
    } catch (error) {
      console.error('Export filtered games error:', error);
      throw error;
    }
  };

  // Main export function
  const export_games = async (
    option: ExportOption,
    params: UseExportGamesParams
  ): Promise<ExportResult> => {
    try {
      set_is_exporting(true);

      let result: ExportResult;

      switch (option) {
        case 'all':
          result = await export_all_games();
          showToast.success('Xuất dữ liệu tất cả games thành công!');
          break;

        case 'selected':
          if (!params.selected_games || params.selected_games.length === 0) {
            showToast.error('Vui lòng chọn ít nhất 1 game để xuất');
            return { success: false, count: 0 };
          }
          result = await export_selected_games(params.selected_games);
          showToast.success(`Xuất ${params.selected_games.length} games đã chọn thành công!`);
          break;

        case 'filtered':
          if (!params.has_filters) {
            showToast.error('Chưa có bộ lọc nào được áp dụng');
            return { success: false, count: 0 };
          }
          if (!params.filter_params) {
            showToast.error('Thiếu thông tin bộ lọc');
            return { success: false, count: 0 };
          }
          result = await export_filtered_games(params.filter_params);
          showToast.success('Xuất dữ liệu đã lọc thành công!');
          break;

        default:
          throw new Error('Invalid export option');
      }

      return result;
    } catch (error: any) {
      console.error('Export games error:', error);
      showToast.error(error.message || 'Có lỗi xảy ra khi xuất dữ liệu');
      return { success: false, count: 0 };
    } finally {
      set_is_exporting(false);
    }
  };

  // Kiểm tra option có available không
  const is_option_available = (
    option: ExportOption,
    params: UseExportGamesParams
  ): boolean => {
    switch (option) {
      case 'all':
        return true;
      case 'selected':
        // API không hỗ trợ export theo danh sách IDs
        return false;
      case 'filtered':
        return params.has_filters || false;
      default:
        return false;
    }
  };

  // Get option info
  const get_option_info = (
    option: ExportOption,
    params: UseExportGamesParams
  ): string => {
    switch (option) {
      case 'all':
        return 'Xuất toàn bộ danh sách games';
      case 'selected':
        return 'Tính năng chưa được hỗ trợ bởi API';
      case 'filtered':
        return params.has_filters 
          ? 'Xuất dữ liệu theo bộ lọc hiện tại'
          : 'Chưa có bộ lọc nào';
      default:
        return '';
    }
  };

  return {
    is_exporting,
    export_games,
    export_all_games,
    export_selected_games,
    export_filtered_games,
    is_option_available,
    get_option_info
  };
}

