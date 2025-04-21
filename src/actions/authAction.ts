"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { cookies } from "next/headers";

export async function logoutAction(): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    const authCookie = session?.user?.authCookie;

    if (!authCookie) {
      console.error("Logout Action: Auth cookie not found in session.");
      // Decide if this is an error or just means the user is already effectively logged out server-side
      // For now, let's proceed to client-side logout anyway, but report potential issue.
      return { success: false, message: "Auth cookie not found." };
    }

    const apiUrl = process.env.BKT_ACCOUNT_API_URL;
    if (!apiUrl) {
      throw new Error(
        "BKT_ACCOUNT_API_URL is not defined in environment variables."
      );
    }

    console.log("Calling backend logout API...");
    await axios.post(
      `${apiUrl}/api/Auth/logout`,
      {},
      {
        headers: {
          Cookie: authCookie
        },
        withCredentials: true // Important if your backend relies on cookies being sent
      }
    );
    console.log("Backend logout API call successful.");

    // Xóa các cookies từ trình duyệt
    const cookieStore = await cookies();

    // Xóa NextAuth.js session cookies
    cookieStore.delete("next-auth.session-token");
    cookieStore.delete("next-auth.csrf-token");
    cookieStore.delete("next-auth.callback-url");

    // Xóa cookie session của ứng dụng
    cookieStore.delete("bkt_account");
    cookieStore.delete("MoodleSession");
    cookieStore.delete("MOODLEID1_");

    console.log("Cookies cleared from browser.");

    return { success: true };
  } catch (error) {
    console.error("Logout Action failed:", error);
    // Check if it's an Axios error to potentially get more details
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "API logout failed."
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred during logout."
    };
  }
}
