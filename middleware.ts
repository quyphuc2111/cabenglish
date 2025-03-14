import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import i18NextConfig from '@/locales/i18next.config';

// Các constants
const ROUTES = {
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  OVERVIEW: '/tong-quan',
  PROFILE: '/profile',
  COURSES: '/khoa-hoc'
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

  // Các rules chuyển hướng
  const redirectRules = [
    // Admin trying to access non-admin routes
    {
      condition: isAdmin && !isAdminRoute(path),
      redirect: ROUTES.ADMIN_DASHBOARD
    },
    // Non-admin trying to access admin routes
    {
      condition: !isAdmin && isAdminRoute(path),
      redirect: ROUTES.OVERVIEW
    },
    // Teacher trying to access non-teacher routes
    {
      condition: isTeacher && !isTeacherRoute(path),
      redirect: ROUTES.OVERVIEW
    }
  ];

  // Tìm rule phù hợp và chuyển hướng
  const redirectRule = redirectRules.find(rule => rule.condition);
  if (redirectRule) {
    return NextResponse.redirect(new URL(redirectRule.redirect, req.url));
  }

  return null;
};

export default withAuth(
  function middleware(req) {
    try {
      const token = req.nextauth.token;

      // Xử lý ngôn ngữ
      const localeUrl = handleLocale(req);
      
      // Xử lý phân quyền
      const authRedirect = handleAuth(req, token);
      if (authRedirect) return authRedirect;

      // Nếu không có chuyển hướng, rewrite với URL đã xử lý ngôn ngữ
      return NextResponse.rewrite(localeUrl);
    } catch (error) {
      console.error('Middleware error:', error);
      // Trong trường hợp lỗi, chuyển hướng về trang chủ
      return NextResponse.redirect(new URL(ROUTES.OVERVIEW, req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Cấu hình matcher cho middleware
export const config = {
  matcher: [
    // Auth routes
    '/tong-quan/:path*',
    '/khoa-hoc/:path*',
    '/profile/:path*',
    '/admin/:path*',
    // Exclude files and API routes
    '/((?!api|static|.*\\..*|_next).*)'
  ]
}; 