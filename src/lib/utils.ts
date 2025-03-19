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
export const formatProgress = (progress: number) => {
  const percent = progress * 100;
  return Number.isInteger(percent) ? percent.toString() : percent.toFixed(2);
};

export const formatSelect = (arrayData: any[], keyLabel: string, keyValue: string) => {
  if(!arrayData || arrayData.length === 0) return ;
  
  return arrayData.map((item) => ({
    label: item[keyLabel],
    value: item[keyValue]
  }));
};
