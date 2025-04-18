import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import i18NextConfig from "@/locales/i18next.config";

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
const handleLocale = (request: Request) => {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  const lang = searchParams.get("lang");
  const validLocales = i18NextConfig.i18n.locales;
  const defaultLocale = i18NextConfig.i18n.defaultLocale;
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
const handleAuth = (req: Request, token: any) => {
  const path = new URL(req.url).pathname;
  const isAdmin = token?.role === ROLES.ADMIN;
  const isTeacher = token?.role === ROLES.TEACHER;
  const role = token?.role as RoleType;

  // Nếu người dùng truy cập trang gốc '/', chuyển hướng đến trang mặc định theo role
  // if (path === ROUTES.LANDING_PAGE) {
  //   const defaultLandingPage =  ROUTES.LANDING_PAGE;
  //   return NextResponse.redirect(new URL(defaultLandingPage, req.url));
  // }

  // Xử lý quyền truy cập dựa trên role
  if (isAdmin) {
    // Admin chỉ được phép truy cập các trang /admin/*
    if (!isAdminRoute(path)) {
      return NextResponse.redirect(new URL(ROUTES.ADMIN_DASHBOARD, req.url));
    }
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
  function middleware(req) {
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
      const localeUrl = handleLocale(req);

      // Xử lý phân quyền
      const authRedirect = handleAuth(req, token);
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
        if (
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname === "/login/callback"
        ) {
          return true;
        }
        return !!token;
      }
    },
    pages: {
      signIn: "/signin"
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
    "/((?!api|_next|static|.*\\..*).*)",
    "/lop-hoc",
    "/lop-hoc/:path*"
  ]
};
