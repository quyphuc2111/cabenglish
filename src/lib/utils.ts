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
