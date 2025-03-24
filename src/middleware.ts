import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import i18NextConfig from '@/locales/i18next.config';

// Các constants
const ROUTES = {
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  OVERVIEW: '/tong-quan',
  PROFILE: '/profile',
  COURSES: '/khoa-hoc',
  LOGIN: '/signin'
} as const;

const ROLES = {
  ADMIN: 'Administrator',
  TEACHER: 'Teacher'
} as const;

// Helper functions
const isAdminRoute = (path: string) => path.startsWith(ROUTES.ADMIN);
const isTeacherRoute = (path: string) => path.startsWith(ROUTES.OVERVIEW);

// Xử lý ngôn ngữ
const handleLocale = (request: Request) => {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;
  
  const lang = searchParams.get('lang');
  const validLocales = i18NextConfig.i18n.locales;
  const defaultLocale = i18NextConfig.i18n.defaultLocale;

  // Sử dụng ngôn ngữ hợp lệ từ query hoặc mặc định
  const locale = lang && validLocales.includes(lang) ? lang : defaultLocale;
  
  const newUrl = new URL(pathname, request.url);
  newUrl.searchParams.set('lang', locale);
  
  return newUrl;
};

// Xử lý phân quyền và chuyển hướng
const handleAuth = (req: Request, token: any) => {
  const path = new URL(req.url).pathname;
  const isAdmin = token?.role === ROLES.ADMIN;
  const isTeacher = token?.role === ROLES.TEACHER;

  // Nếu là admin và đang ở route admin, cho phép truy cập
  if (isAdmin && isAdminRoute(path)) {
    return null;
  }

  // Nếu không phải admin cố truy cập route admin
  if (!isAdmin && isAdminRoute(path)) {
    return NextResponse.redirect(new URL(ROUTES.OVERVIEW, req.url));
  }

  // Cho phép giáo viên truy cập tất cả các route khác
  return null;
};

export default withAuth(
  function middleware(req) {
    try {
      const token = req.nextauth.token;
      
      // Kiểm tra nếu không có token (chưa đăng nhập), chuyển hướng về trang login
      if (!token) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
      }

      const path = new URL(req.url).pathname;

      // Bỏ qua middleware cho các API routes
      if (path.startsWith('/api/')) {
        return null;
      }

      // Xử lý ngôn ngữ
      const localeUrl = handleLocale(req);
      
      // Xử lý phân quyền
      const authRedirect = handleAuth(req, token);
      if (authRedirect) return authRedirect;

      return NextResponse.rewrite(localeUrl);
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/signin',
    },
  }
);

// Cập nhật matcher để bao gồm cả route auth
export const config = {
  matcher: [
    '/tong-quan/:path*',
    '/khoa-hoc/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/((?!api|_next|static|.*\\..*).*)'
  ]
}; 

