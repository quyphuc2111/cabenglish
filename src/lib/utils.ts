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

export const getSwValueById = (arrayData: any[], keyId: string, keyValue: string, id: number) => {
  if(!arrayData || arrayData.length === 0) return '';
  if(!id) return '';
  
  return arrayData.find((item) => item[keyId] === id)?.[keyValue] || '';
}

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

/**
 * Loại bỏ dấu tiếng Việt và chuyển về chữ thường
 * @param str - Chuỗi tiếng Việt có dấu
 * @returns Chuỗi tiếng Việt không dấu và chữ thường
 */
export const removeDiacritics = (str: string): string => {
  if (!str) return '';
  
  const vietnameseMap: Record<string, string> = {
    // Chữ thường
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
    // Chữ hoa
    'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
    'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D'
  };

  return str
    .split('')
    .map(char => vietnameseMap[char] || char)
    .join('')
    .toLowerCase();
};

/**
 * So sánh chuỗi có hỗ trợ tiếng Việt không dấu
 * @param searchText - Chuỗi tìm kiếm
 * @param targetText - Chuỗi đích cần so sánh
 * @returns true nếu tìm thấy match
 */
export const fuzzySearch = (searchText: string, targetText: string): boolean => {
  if (!searchText || !targetText) return false;
  
  const normalizedSearch = removeDiacritics(searchText.trim());
  const normalizedTarget = removeDiacritics(targetText.trim());
  
  return normalizedTarget.includes(normalizedSearch);
};
