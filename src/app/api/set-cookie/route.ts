import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  console.log("Set-cookie API route called");

  try {
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET
    });

    console.log("Token retrieved:", !!token);

    if (token?.moodleCookie) {
      console.log("Moodle cookie found in token");

      // Extract the cookie name and value from the authCookie string
      const cookieString = token.moodleCookie;
      const cookieMatch = cookieString.match(/^([^=]+)=([^;]+)/);

      if (cookieMatch && cookieMatch.length >= 3) {
        const cookieName = cookieMatch[1].trim();
        const cookieValue = cookieMatch[2].trim();

        console.log(`Extracted cookie name: ${cookieName}`);
        console.log(
          `Extracted cookie value: ${cookieValue.substring(0, 10)}...`
        );

        // Create a response with the cookie properly set
        const response = NextResponse.json({
          success: true,
          message: `Cookie ${cookieName} set successfully`
        });

        // Extract domain from API URL to match cookie domain
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
        let domain;
        try {
          const url = new URL(API_URL);
          domain = url.hostname;
          console.log("Using API domain for cookie:", domain);
        } catch (error) {
          console.error("Failed to parse API URL domain:", error);
          // Fall back to not setting domain
        }

        // Prepare cookie options for cross-domain access
        const cookieOptions: any = {
          name: cookieName,
          value: cookieValue,
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/"
        };

        // Add domain if available
        if (domain) {
          cookieOptions.domain = domain;
          console.log(`Setting cookie domain to: ${domain}`);
        }

        // Add expiration if available - use maxAge instead of expires
        if (token.cookieExpiresAt) {
          const now = Date.now();
          const expiresAt = token.cookieExpiresAt;
          const maxAgeMs = expiresAt - now;

          if (maxAgeMs > 0) {
            // Convert to seconds for maxAge
            cookieOptions.maxAge = Math.floor(maxAgeMs / 1000);
            console.log(
              `Setting cookie maxAge: ${cookieOptions.maxAge} seconds`
            );
          }
        } else {
          // Set a default expiration of 24 hours if none is provided
          cookieOptions.maxAge = 24 * 60 * 60;
          console.log("Setting default cookie maxAge: 24 hours");
        }

        try {
          // Set the cookie in the response
          response.cookies.set(cookieOptions);
          console.log(
            "Cookie set in response with options:",
            JSON.stringify(cookieOptions, null, 2)
          );

          // Set Access-Control-Allow-Credentials header to ensure cookies are included in CORS
          response.headers.set("Access-Control-Allow-Credentials", "true");

          // Try also setting the cookie directly in the Set-Cookie header as a fallback
          const cookieHeader = `${cookieName}=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=None${
            domain ? `; Domain=${domain}` : ""
          }; Max-Age=${cookieOptions.maxAge || 86400}`;
          response.headers.append("Set-Cookie", cookieHeader);

          return response;
        } catch (cookieError) {
          console.error("Error setting cookie:", cookieError);
          // Return a fallback response if cookie setting fails
          return NextResponse.json(
            {
              success: false,
              message: "Error setting cookie",
              error:
                cookieError instanceof Error
                  ? cookieError.message
                  : String(cookieError)
            },
            { status: 500 }
          );
        }
      } else {
        console.error(
          "Failed to parse cookie string:",
          cookieString.substring(0, 50) + "..."
        );
        return NextResponse.json(
          {
            success: false,
            message: "Failed to parse cookie from session"
          },
          { status: 400 }
        );
      }
    } else {
      console.error("No authCookie found in token");
      return NextResponse.json(
        {
          success: false,
          message: "No cookie found in session"
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in set-cookie route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error setting cookie",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
