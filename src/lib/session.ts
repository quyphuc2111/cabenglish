import type { SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  roles?: string[]; // or string, depending on API
  accountId?: string;
  username?: string;
  email?: string;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long",
  cookieName: "smartkids_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  }
};

export async function getSessionData(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions
    );

    if (!session || Object.keys(session).length === 0) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error retrieving session data:", error);
    return null;
  }
}
