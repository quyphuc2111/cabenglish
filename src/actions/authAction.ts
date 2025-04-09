"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/session";
import { sessionOptions } from "@/lib/session";

interface LoginResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  roles?: string[];
  accountId?: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

interface LoginResult {
  success: boolean;
  message?: string;
  data?: SessionData;
}

export async function loginAction({
  email,
  password,
  app_id
}: {
  email: string;
  password: string;
  app_id: number;
}): Promise<LoginResult> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  try {
    const apiUrl = process.env.BKT_ACCOUNT_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not defined");
    }

    // console.log("API URL:", apiUrl);

    const response = await fetch(`${apiUrl}/api/Account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, app_id }),
      credentials: "include"
    });

    let data: LoginResponse = { success: false };
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = { success: false };
      }
    }

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Login failed"
      };
    }

    // Save relevant data to session
    session.accessToken = data.accessToken;
    session.refreshToken = data.refreshToken;
    session.roles = data.roles;
    session.accountId = data.accountId;
    session.username = data.username;
    session.email = data.email;

    await session.save();

    return {
      success: true,
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        roles: data.roles,
        accountId: data.accountId,
        username: data.username,
        email: data.email
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
