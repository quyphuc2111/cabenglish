"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/session";
import { sessionOptions } from "@/lib/session";

interface SessionResponse {
  success: boolean;
  data?: SessionData | null;
  error?: string;
}

export async function getSessionData(): Promise<SessionResponse> {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions
    );

    if (!session || Object.keys(session).length === 0) {
      return {
        success: true,
        data: null
      };
    }

    return {
      success: true,
      data: session
    };
  } catch (error) {
    console.error("Error retrieving session data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null
    };
  }
}
