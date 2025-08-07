import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios, { AxiosError } from "axios";
import { fetchUserByEmail, createUser } from "@/hooks/client/userApi";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    role?: string[];
    userId?: string;
    mode?: string;
    email?: string;
    is_firstlogin?: boolean;
    theme: string;
    authCookie?: string;
    language?: string;
    moodleCookie?: string;
  }
}

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string;
    email?: string;
    username?: string;
    accessToken?: string;
    role?: string[];
    userId?: string;
    mode?: string;
    is_firstlogin?: boolean;
    theme: "theme-blue" | "theme-gold" | "theme-pink" | "theme-red";
    authCookie?: string;
    language?: string;
    moodleCookie?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      role?: string[];
      userId?: string;
      mode?: string;
      name?: string;
      email?: string;
      is_firstlogin?: boolean;
      theme?: string;
      authCookie?: string;
      language?: string;
      moodleCookie?: string;
    };
  }
}

interface Credentials {
  email: string;
  password: string;
}

const ACC_DOMAIN = process.env.BKT_ACCOUNT_API_URL;

// Simple lock to prevent concurrent refresh attempts
const refreshLocks = new Map<string, Promise<any>>();

// Helper function to parse JWT expiry with safety buffer
function getJWTExpiryTime(token: string, fallbackSeconds?: number): number {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload.exp) {
        // JWT exp is in seconds, convert to milliseconds
        // Subtract 10 seconds as buffer for clock drift
        return payload.exp * 1000 - 10000;
      }
    }
  } catch (error) {
    console.error("Error parsing JWT expiry:", error);
  }
  // Fallback
  const fallback = fallbackSeconds || 45;
  return Date.now() + fallback * 1000;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(
        credentials: Credentials | undefined
      ): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          if (!ACC_DOMAIN) {
            throw new Error("API_URL is not defined");
          }

          const loginResponse = await axios.post(
            `${ACC_DOMAIN}/api/Account/login`,
            {
              email: credentials.email,
              password: credentials.password,
              app_id: process.env.BKT_APP_ID || 1
            },
            {
              withCredentials: true
            }
          );

          const data = loginResponse.data;

          if (data?.success && data?.accessToken) {
            const userId = data.accountId;
            if (!userId) {
              throw new Error("User ID is not available");
            }

            let userResponse;
            try {
              userResponse = await fetchUserByEmail(
                credentials.email,
                data.accessToken
              );
            } catch (error) {
              if (axios.isAxiosError(error) && error.response?.status === 404) {
                try {
                  userResponse = await createUser(
                    {
                      email: credentials.email,
                      user_id: userId.toString(),
                      language: "vi",
                      theme: "theme-red",
                      mode: "default"
                    },
                    data.accessToken
                  );
                } catch (createError) {
                  console.error("User creation failed:", createError);
                  return null;
                }
              } else {
                console.error("Fetch user error:", error);
                return null;
              }
            }

            const authCookie = loginResponse.headers["set-cookie"];

            const moodleCookie =
              "MoodleSession=3qfpb47l8gre739bhq3t0q61d0; path=/; secure; HttpOnly; SameSite=None";

            // Extract bkt_account cookie specifically
            let bktAccountCookie = undefined;
            if (authCookie && Array.isArray(authCookie)) {
              const bktCookie = authCookie.find((cookie) =>
                cookie.includes("bkt_account=")
              );
              if (bktCookie) {
                // Extract just the bkt_account cookie part
                const match = bktCookie.match(/bkt_account=([^;]+)/);
                bktAccountCookie = match
                  ? `bkt_account=${match[1]}`
                  : bktCookie;
              }
            }

            const user: User = {
              email: data.email,
              userId: userId.toString(),
              username: data.username,
              role:
                data.roles && data.roles.length > 0 ? data.roles : undefined,
              accessToken: data.accessToken,
              is_firstlogin: userResponse.is_firstlogin,
              mode: userResponse.mode || "default",
              language: userResponse.language || "vi",
              theme:
                (userResponse.theme as
                  | "theme-blue"
                  | "theme-gold"
                  | "theme-pink"
                  | "theme-red") || "theme-blue",
              authCookie: bktAccountCookie,
              moodleCookie: moodleCookie
            };

            return user;
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          if (axios.isAxiosError(error)) {
            throw new Error(
              (error as AxiosError<{ message: string }>).response?.data
                ?.message || "Authentication failed"
            );
          }
          throw new Error("Authentication failed");
        }
      }
    }),
    CredentialsProvider({
      id: "google-token",
      name: "Google Token",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        accountId: { label: "Account ID", type: "text" },
        email: { label: "Email", type: "text" },
        username: { label: "Username", type: "text" },
        roles: { label: "Roles", type: "text" },
        authCookie: { label: "Auth Cookie", type: "text" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        try {
          const { accessToken, accountId, email, username, roles, authCookie } =
            credentials;

          if (!accessToken || !accountId || !email) {
            throw new Error("Missing required credentials");
          }

          let userResponse;
          try {
            userResponse = await fetchUserByEmail(email, accessToken);
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              try {
                userResponse = await createUser(
                  {
                    email: email,
                    user_id: accountId.toString(),
                    language: "vi",
                    theme: "theme-blue",
                    mode: "default"
                  },
                  accessToken
                );
              } catch (createError) {
                console.error("User creation failed:", createError);
                return null;
              }
            } else {
              console.error("Fetch user error:", error);
              return null;
            }
          }

          const parsedRoles =
            typeof roles === "string" ? JSON.parse(roles) : roles;
          const role =
            Array.isArray(parsedRoles) && parsedRoles.length > 0
              ? parsedRoles
              : undefined;

          // Extract bkt_account cookie specifically
          let bktAccountCookie = authCookie;
          if (authCookie && authCookie.includes("bkt_account=")) {
            const match = authCookie.match(/bkt_account=([^;]+)/);
            if (match) {
              bktAccountCookie = `bkt_account=${match[1]}`;
            }
          }

          const user: User = {
            email: email,
            userId: accountId.toString(),
            username: username,
            role: role,
            accessToken: accessToken,
            is_firstlogin: userResponse.is_firstlogin,
            mode: userResponse.mode || "default",
            language: userResponse.language || "vi",
            theme:
              (userResponse.theme as
                | "theme-blue"
                | "theme-gold"
                | "theme-pink"
                | "theme-red") || "theme-blue",
            authCookie: bktAccountCookie,
            moodleCookie:
              "MoodleSession=3qfpb47l8gre739bhq3t0q61d0; path=/; secure; HttpOnly; SameSite=None"
          };

          return user;
        } catch (error) {
          console.error("Google token auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session
    }: {
      token: JWT;
      user: User | null;
      trigger?: "signIn" | "signUp" | "update";
      session?: any;
    }): Promise<JWT> {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.userId = user.userId;
        token.mode = user.mode;
        token.theme = user.theme;
        token.email = user.email;
        token.language = user.language;
        token.is_firstlogin = user.is_firstlogin;
        token.authCookie = user.authCookie;
        token.moodleCookie = user.moodleCookie;

        // Parse JWT to get exact expiry time from backend
        token.accessTokenExpires = user.accessToken
          ? getJWTExpiryTime(user.accessToken)
          : Date.now() + 45 * 1000;

        return token;
      }

      if (trigger === "update" && session) {
        if (session.user?.theme) {
          token.theme = session.user.theme;
        }
        if (session.user?.language) {
          token.language = session.user.language;
        }
        if (session.user?.mode) {
          token.mode = session.user.mode;
        }
        if (session.user?.is_firstlogin !== undefined) {
          token.is_firstlogin = session.user.is_firstlogin;
        }
        return token;
      }

      // console.log("🔄 [JWT Callback] Checking token expiry...");
      // console.log("Current time:", new Date(Date.now()).toLocaleString());
      // console.log(
      //   "Token expires at:",
      //   token.accessTokenExpires !== undefined
      //     ? new Date(token.accessTokenExpires).toLocaleString()
      //     : "undefined"
      // );

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // log xem có phải refresh token không
      // console.log("🔄 [JWT Callback] Refreshing access token...");
      // console.log("Current token:", token);
      // console.log("Current time:", Date.now().toLocaleString());
      // console.log(
      //   "Token expires at:",
      //   token.accessTokenExpires !== undefined
      //     ? new Date(token.accessTokenExpires).toLocaleString()
      //     : "undefined"
      // );

      if (token.authCookie) {
        // Validate refresh token format before attempting refresh
        const { isRefreshTokenValid } = await import("@/hooks/client/userApi");
        if (!isRefreshTokenValid(token.authCookie)) {
          console.warn("Invalid refresh token format detected");
          return {
            ...token,
            authCookie: undefined,
            accessTokenExpires: 0
          };
        }

        // Check if there's already a refresh in progress for this user
        const userId = token.userId || "unknown";
        if (refreshLocks.has(userId)) {
          console.log("Refresh already in progress for user:", userId);
          try {
            const result = await refreshLocks.get(userId);
            return result;
          } catch (error) {
            console.error("Waiting for refresh failed:", error);
            refreshLocks.delete(userId);
            // Return original token if concurrent refresh fails
            return token;
          }
        }

        // Start new refresh
        const refreshPromise = (async () => {
          try {
            const { refreshAccessToken } = await import(
              "@/hooks/client/userApi"
            );
            const refreshed = await refreshAccessToken(token.authCookie!);

            // Try to parse JWT expiry, fallback to API response if fails
            let newExpirationTime;
            try {
              newExpirationTime = getJWTExpiryTime(refreshed.accessToken);
            } catch {
              // If JWT parsing fails completely, use API response
              newExpirationTime =
                Date.now() + refreshed.expiresIn * 1000 - 10000; // 10s buffer
            }

            const updatedToken = {
              ...token,
              accessToken: refreshed.accessToken,
              accessTokenExpires: newExpirationTime
            };

            console.log(
              "🔄 [JWT Callback] Access token refreshed successfully",
              updatedToken
            );

            return updatedToken;
          } catch (refreshError) {
            // If refresh fails, check if it's 401 (refresh token expired)
            if (
              axios.isAxiosError(refreshError) &&
              refreshError.response?.status === 401
            ) {
              console.warn(
                "Refresh token expired - user needs to re-authenticate"
              );
              // Clear the expired refresh token
              return {
                ...token,
                authCookie: undefined,
                accessTokenExpires: 0 // Force immediate expiration
              };
            }
            // For other errors, return original token and let it try again later
            throw refreshError;
          } finally {
            refreshLocks.delete(userId);
          }
        })();

        refreshLocks.set(userId, refreshPromise);

        try {
          return await refreshPromise;
        } catch (error) {
          console.error("Refresh token failed in jwt callback:", error);
          refreshLocks.delete(userId);
          // Return original token with a shorter expiry to retry sooner
          return {
            ...token,
            accessTokenExpires: Date.now() + 5 * 60 * 1000 // Retry in 5 minutes
          };
        }
      }

      return token;
    },
    async session({
      session,
      token
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (token) {
        session.accessToken = token.accessToken;
        if (!session.user) {
          session.user = {};
        }
        session.user.role = token.role;
        session.user.userId = token.userId;
        session.user.mode = token.mode;
        session.user.email = token.email;
        session.user.theme = token.theme;
        session.user.language = token.language;
        session.user.is_firstlogin = token.is_firstlogin;
        // session.user.authCookie = token.authCookie;
        // session.user.moodleCookie = token.moodleCookie;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin"
  },
  session: {
    strategy: "jwt",
    // 1 tuần
    maxAge: 7 * 24 * 60 * 60 // 1 tuần
  },
  secret: process.env.NEXTAUTH_SECRET
};
