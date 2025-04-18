import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get("redirectUri");

  if (!redirectUri) {
    return NextResponse.json(
      { success: false, message: "Missing redirectUri parameter" },
      { status: 400 }
    );
  }

  const AppID = parseInt(process.env.BKT_APP_ID || "1", 10);
  const Domain = `${process.env.BKT_ACCOUNT_API_URL}`;

  try {
    // Call the external Google auth API
    const googleLoginUrl = `${Domain}/api/Auth/google?appId=${AppID}&redirectUri=${encodeURIComponent(
      redirectUri
    )}`;
    const response = await fetch(googleLoginUrl, {
      method: "GET"
    });

    const data = await response.json();

    if (data.authUrl) {
      // Create response object
      const nextResponse = NextResponse.json({
        success: true,
        authUrl: data.authUrl
      });

      // Extract Set-Cookie header from the original response if it exists
      const setCookieHeader = response.headers.get("Set-Cookie");
      if (setCookieHeader) {
        // Pass through the Set-Cookie header to the client
        nextResponse.headers.set("Set-Cookie", setCookieHeader);
      }

      return nextResponse;
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to initialize Google login"
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Google auth initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Could not connect to authentication server"
      },
      { status: 500 }
    );
  }
}
