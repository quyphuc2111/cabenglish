import { useMutation } from '@tanstack/react-query';
import { showToast } from '@/utils/toast-config';
import { apiClient } from '@/lib/axios-interceptor';
import { useState } from 'react';

export type ImportMode = 'create' | 'overwrite' | 'merge';

interface ImportResult {
  success: boolean;
  message: string;
  data?: {
    mode: string;
    total_rows: number;
    success_count: number;
    created_count: number;
    updated_count: number;
    error_count: number;
    errors: string[] | null;
  };
}

interface ImportGamesParams {
  file: File;
  mode: ImportMode;
  onUploadProgress?: (progress: number) => void;
}

// API function
async function importGamesAPI(params: ImportGamesParams): Promise<ImportResult> {
  const { file, mode, onUploadProgress } = params;

  // Tạo FormData
  const form_data = new FormData();
  form_data.append('file', file);

  // Call API với mode param
  const response = await apiClient.post(`/api/Game/import?mode=${mode}`, form_data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 300000, // 5 minutes
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress?.(percentCompleted);
      }
    },
  });

  return {
    success: response.data.success,
    message: response.data.message,
    data: response.data.data,
  };
}

export function useImportGames() {
  const [upload_progress, set_upload_progress] = useState(0);
  const [processing_progress, set_processing_progress] = useState(0);
  const [progress_interval, set_progress_interval] = useState<NodeJS.Timeout | null>(null);

  const mutation = useMutation({
    mutationFn: importGamesAPI,
    onMutate: () => {
      // Reset progress khi bắt đầu import
      set_upload_progress(0);
      set_processing_progress(0);
      
      // Clear any existing interval
      if (progress_interval) {
        clearInterval(progress_interval);
      }
    },
    onSuccess: (result) => {
      // Clear interval and set to 100%
      if (progress_interval) {
        clearInterval(progress_interval);
        set_progress_interval(null);
      }
      set_upload_progress(100);
      set_processing_progress(100);
      
      // Show toast based on result
      if (result.data?.error_count === 0) {
        showToast.success(result.message);
      } else if (result.data?.success_count === 0) {
        showToast.error('Import thất bại. Vui lòng kiểm tra lỗi.');
      } else {
        showToast.success(`Import hoàn thành với ${result.data?.error_count} lỗi`);
      }
    },
    onError: (error: any) => {
      console.error('Import games error:', error);
      const error_message = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi import';
      showToast.error(error_message);
      
      // Clear interval and reset progress
      if (progress_interval) {
        clearInterval(progress_interval);
        set_progress_interval(null);
      }
      set_upload_progress(0);
      set_processing_progress(0);
    },
  });

  const import_games_with_progress = async (params: Omit<ImportGamesParams, 'onUploadProgress'>) => {
    // Callback khi upload progress thay đổi
    const handle_upload_progress = (percent: number) => {
      set_upload_progress(percent);
      
      // Khi upload xong (100%), bắt đầu simulate processing progress
      if (percent === 100) {
        let processing = 0;
        const interval = setInterval(() => {
          processing += 5; // Tăng 5% mỗi 200ms
          if (processing >= 95) {
            processing = 95; // Dừng ở 95%, chờ response thực tế
          }
          set_processing_progress(processing);
        }, 200);
        
        set_progress_interval(interval);
      }
    };

    return mutation.mutateAsync({
      ...params,
      onUploadProgress: handle_upload_progress,
    });
  };

  // Tính total progress: 40% upload + 60% processing
  const total_progress = Math.round((upload_progress * 0.4) + (processing_progress * 0.6));

  return {
    is_importing: mutation.isPending,
    upload_progress,
    processing_progress,
    total_progress,
    import_result: mutation.data || null,
    import_games: import_games_with_progress,
    reset_import_result: () => {
      mutation.reset();
      if (progress_interval) {
        clearInterval(progress_interval);
        set_progress_interval(null);
      }
      set_upload_progress(0);
      set_processing_progress(0);
    },
  };
}

