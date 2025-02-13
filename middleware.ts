import { NextRequest, NextResponse } from 'next/server';
import i18NextConfig from '@/locales/i18next.config';

export function middleware(request: NextRequest) {
  // Lấy phần pathname và searchParams từ URL
  const { pathname, searchParams } = request.nextUrl;

  // Lấy lang từ query parameter
  const lang = searchParams.get('lang');
  // Danh sách các ngôn ngữ hợp lệ
  const validLocales = i18NextConfig.i18n.locales; 
  // Ngôn ngữ mặc định
  const defaultLocale = i18NextConfig.i18n.defaultLocale; 

  // Nếu lang có trong query và hợp lệ
  if (lang && validLocales.includes(lang)) {
    const newUrl = new URL(pathname, request.url);
	// Đặt lang trong URL
    newUrl.searchParams.set('lang', lang); 
	 // Chuyển hướng theo URL đã cập nhật
    return NextResponse.rewrite(newUrl);
  }

  // Nếu lang không hợp lệ hoặc không có, tiếp tục với ngôn ngữ mặc định
  const newUrl = new URL(pathname, request.url);
  // Đặt ngôn ngữ mặc định nếu không có lang hợp lệ
  newUrl.searchParams.set('lang', defaultLocale); 
  // Chuyển hướng đến URL với lang mặc định
  return NextResponse.rewrite(newUrl); 
}

// Áp dụng middleware cho các route không phải API, không phải tệp tĩnh hoặc các yêu cầu tới _next
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
