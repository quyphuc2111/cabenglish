import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import axios from "axios";

const API_URL = process.env.BKT_ACCOUNT_API_URL;

export async function GET(request: NextRequest) {
  try {
    // Lấy session để có authCookie
    const session = await getServerSession(authOptions);

    if (!session?.user?.authCookie) {
      return NextResponse.json(
        { message: "No auth cookie found in session" },
        { status: 401 }
      );
    }

    // Gọi API backend với cookie bkt_account
    const response = await axios.get(
      `${API_URL}/api/Auth/check-refresh-token`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: session.user.authCookie
        },
        withCredentials: true,
        validateStatus: (status) => status < 500 // Không throw error cho status 4xx
      }
    );

    // Trả về response từ backend
    if (response.status === 200) {
      return NextResponse.json(response.data, { status: 200 });
    } else {
      return NextResponse.json(
        response.data || { message: "Token validation failed" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Check refresh token error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to check refresh token";

      return NextResponse.json(
        { message: errorMessage },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
