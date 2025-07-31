import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import i18NextConfig from "@/locales/i18next.config";
import { getToken } from "next-auth/jwt";

// Các constants
const ROUTES = {
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  OVERVIEW: "/tong-quan",
  PROFILE: "/profile",
  COURSES: "/khoa-hoc",
  LOGIN: "/signin",
  LANDING_PAGE: "/",
  LOGIN_CALLBACK: "/login/callback"
} as const;

const ROLES = {
  ADMIN: "Administrator",
  TEACHER: "Teacher"
} as const;

type RoleType = (typeof ROLES)[keyof typeof ROLES];

// Default landing pages for each role
const DEFAULT_LANDING_PAGES: Record<RoleType, string> = {
  [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
  [ROLES.TEACHER]: ROUTES.OVERVIEW
};

// Helper functions
const isAdminRoute = (path: string) => path.startsWith(ROUTES.ADMIN);

// Xử lý ngôn ngữ
const handleLocale = async (request: NextRequest) => {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;
  
  // Lấy thông tin từ session
  const token = await getToken({ req: request as any });
  const sessionLanguage = token?.user?.language as string | undefined;
  
  // Thứ tự ưu tiên: 1. URL query, 2. Session language, 3. Default locale
  let lang = searchParams.get("lang");
  const validLocales = i18NextConfig.i18n.locales;
  const defaultLocale = i18NextConfig.i18n.defaultLocale;
  
  if (!lang && sessionLanguage && validLocales.includes(sessionLanguage)) {
    lang = sessionLanguage;
  }
  
  const locale = lang && validLocales.includes(lang) ? lang : defaultLocale;

  // Tạo URL mới và copy tất cả searchParams gốc
  const newUrl = new URL(pathname, request.url);
  searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value);
  });

  // Set/update param lang
  newUrl.searchParams.set("lang", locale);

  return newUrl;
};

// Xử lý phân quyền và chuyển hướng
const handleAuth = (req: NextRequest, token: any) => {
  const path = new URL(req.url).pathname;
  const roles = token?.role || [];
  const isAdmin = Array.isArray(roles) ? roles.includes(ROLES.ADMIN) : roles === ROLES.ADMIN;

  if (path === ROUTES.LANDING_PAGE) {
    const defaultLandingPage = ROUTES.LANDING_PAGE;
    return NextResponse.redirect(new URL(defaultLandingPage, req.url));
  }

  // Xử lý quyền truy cập dựa trên role
  if (isAdmin) {
    // Admin được phép truy cập tất cả các trang
    return null;
  } else {
    // Người dùng không phải admin không được phép truy cập các trang /admin/*
    if (isAdminRoute(path)) {
      return NextResponse.redirect(new URL(ROUTES.OVERVIEW, req.url));
    }
  }

  // Cho phép truy cập nếu không vi phạm quy tắc nào
  return null;
};

export default withAuth(
  async function middleware(req) {
    try {
      const token = req.nextauth.token;
      const path = new URL(req.url).pathname;

      // Cho phép truy cập trang chủ mà không cần đăng nhập
      if (path === ROUTES.LANDING_PAGE || path === ROUTES.LOGIN_CALLBACK) {
        return null;
      }

      // Kiểm tra nếu không có token (chưa đăng nhập), chuyển hướng về trang login
      if (!token) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
      }

      // Bỏ qua middleware cho các API routes
      if (path.startsWith("/api/")) {
        return null;
      }

      // Xử lý ngôn ngữ
      const localeUrl = await handleLocale(req as unknown as NextRequest);

      // Xử lý phân quyền
      const authRedirect = handleAuth(req as unknown as NextRequest, token);
      if (authRedirect) return authRedirect;

      return NextResponse.rewrite(localeUrl);
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Cho phép truy cập trang chủ mà không cần token
        if (req.nextUrl.pathname === "/") {
          return true;
        }
        return !!token;
      }
    },
    pages: {
      signIn: "/signin-v2"
    }
  }
);

// Cập nhật matcher để bao gồm cả route auth
export const config = {
  matcher: [
    "/",
    "/tong-quan/:path*",
    "/khoa-hoc/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/auth/:path*",
    "/((?!api|_next|login/callback|static|.*\\..*).*)",
    "/lop-hoc",
    "/lop-hoc/:path*"
  ]
};
