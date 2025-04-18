import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const appID = parseInt(process.env.BKT_APP_ID || "1", 10);
    const domain = process.env.BKT_ACCOUNT_API_URL;

    if (!code || !state) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin xác thực cần thiết" },
        { status: 400 }
      );
    }

    // Get cookies from the incoming request
    const cookieHeader = request.headers.get("cookie") || "";
    console.log("Cookie header:", cookieHeader);

    // Call the Google callback API endpoint
    const response = await fetch(
      `${domain}/api/Auth/google/callback?code=${code}&state=${state}&appId=${appID}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: cookieHeader // Forward the cookies from the incoming request
        }
      }
    );

    const data = await response.json();

    if (data.success) {
      // Get session

      const jsonResponse = NextResponse.json({
        success: true,
        message: data.message || "Đăng nhập thành công!",
        accessToken: data.accessToken,
        accountId: data.accountId,
        username: data.username,
        email: data.email,
        roles: data.roles
      });

      // Pass through any cookies from the backend
      const responseCookieHeader = response.headers.get("set-cookie");
      if (responseCookieHeader) {
        response.headers.getSetCookie().forEach((cookie) => {
          jsonResponse.headers.append("Set-Cookie", cookie);
        });
      }

      // xóa cookie google_auth_state
      jsonResponse.headers.append(
        "Set-Cookie",
        `google_auth_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax;`
      );

      return jsonResponse;
    } else {
      return NextResponse.json(
        { success: false, message: data.message || "Đăng nhập thất bại" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Google callback error:", error);
    return NextResponse.json(
      { success: false, message: "Không thể xử lý đăng nhập Google" },
      { status: 500 }
    );
  }
}
