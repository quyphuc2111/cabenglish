import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import i18NextConfig from "@/locales/i18next.config";

const ROUTES = {
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  OVERVIEW: "/tong-quan",
  PROFILE: "/profile",
  COURSES: "/khoa-hoc",
  LOGIN: "/signin",
  LANDING_PAGE: "/",
  LOGIN_CALLBACK: "/login/callback"
};

const ROLES = {
  ADMIN: "Administrator",
  TEACHER: "Teacher"
};

const isAdminRoute = (path: string) => path.startsWith(ROUTES.ADMIN);


const handleLocale = async (request: NextRequest) => {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;
  
  let lang = searchParams.get("lang");
  const validLocales = i18NextConfig.i18n.locales;
  const defaultLocale = i18NextConfig.i18n.defaultLocale;
  
  const locale = lang && validLocales.includes(lang) ? lang : defaultLocale;

  const newUrl = new URL(pathname, request.url);
  searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value);
  });

  newUrl.searchParams.set("lang", locale);

  return newUrl;
};

const handleAuth = (req: NextRequest, token: any) => {
  const path = new URL(req.url).pathname;
  const roles = token?.role || [];
  const isAdmin = Array.isArray(roles) ? roles.includes(ROLES.ADMIN) : roles === ROLES.ADMIN;

  if (path === ROUTES.LANDING_PAGE) {
    const defaultLandingPage = ROUTES.LANDING_PAGE;
    return NextResponse.redirect(new URL(defaultLandingPage, req.url));
  }

  if (isAdmin) {
    return null;
  } else {
    if (isAdminRoute(path)) {
      return NextResponse.redirect(new URL(ROUTES.OVERVIEW, req.url));
    }
  }

  return null;
};

export default withAuth(
  async function middleware(req) {
    try {
      const token = req.nextauth.token;
      const path = new URL(req.url).pathname;

      if (path === ROUTES.LANDING_PAGE || path === ROUTES.LOGIN_CALLBACK) {
        return null;
      }

      if (!token) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
      }

      if (path.startsWith("/api/")) {
        return null;
      }

      const localeUrl = await handleLocale(req as unknown as NextRequest);

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
