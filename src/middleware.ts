import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Nếu là trang admin nhưng không phải Administrator
    if (path.startsWith("/admin") && token?.role !== "Administrator") {
      return NextResponse.redirect(new URL("/tong-quan", req.url));
    }

    // Nếu là Administrator nhưng không ở trang admin
    if (token?.role === "Administrator" && !path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Nếu là Teacher nhưng cố truy cập trang admin
    if (token?.role === "Teacher" && !path.startsWith("/tong-quan")) {
      return NextResponse.redirect(new URL("/tong-quan", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/tong-quan/:path*", "/khoa-hoc/:path*", "/profile/:path*", "/admin/:path*"],
}; 