import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Xử lý slug để bỏ khoảng cách và decode URL
export const formatSlug = (slug: string) => {
  return decodeURIComponent(slug).replace(/\s+/g, '-').toLowerCase();
};

// Hàm chuyển đổi tiến trình thành phần trăm
export const formatProgress = (progress: number | string | null | undefined): string => {
  // Chuyển đổi input thành số
  const numberProgress = Number(progress);
  
  // Kiểm tra các trường hợp không hợp lệ
  if (
    typeof numberProgress !== 'number' || 
    isNaN(numberProgress) ||
    !isFinite(numberProgress)
  ) {
    return '0';
  }

  // Giới hạn giá trị trong khoảng 0-1
  const normalizedProgress = Math.max(0, Math.min(1, numberProgress));
  
  // Chuyển đổi thành phần trăm
  const percent = normalizedProgress * 100;
  
  // Làm tròn số và chuyển thành chuỗi
  return Number.isInteger(percent) ? 
    percent.toString() : 
    Number(percent.toFixed(2)).toString(); // Loại bỏ số 0 thừa ở cuối
};

export const formatSelect = (arrayData: any[], keyLabel: string, keyValue: string) => {
  if(!arrayData || arrayData.length === 0) return ;
  
  return arrayData.map((item) => ({
    label: item[keyLabel],
    value: item[keyValue]
  }));
};

/**
 * Kiểm tra và xác thực URL hình ảnh
 * @param imageUrl - URL hình ảnh cần kiểm tra
 * @param fallbackImage - URL hình ảnh mặc định khi URL không hợp lệ
 * @returns URL hình ảnh hợp lệ hoặc URL mặc định
 */
export const validateImageUrl = (
  imageUrl: string | null | undefined,
  fallbackImage: string = "/assets/image/no_image.png"
): string => {
  if (!imageUrl) {
    return fallbackImage;
  }

  // Kiểm tra nếu là URL tương đối (bắt đầu bằng /)
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);
    const validProtocols = ['http:', 'https:'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    
    const hasValidProtocol = validProtocols.includes(url.protocol);
    const hasValidExtension = validExtensions.some(ext => 
      url.pathname.toLowerCase().endsWith(ext)
    );

    return hasValidProtocol && hasValidExtension ? imageUrl : fallbackImage;
  } catch {
    return fallbackImage;
  }
};
