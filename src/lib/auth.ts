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
              authCookie: authCookie ? authCookie[0] : undefined,
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
            authCookie: authCookie, // Add this line to include the auth cookie
            moodleCookie:
              "MoodleSession=3qfpb47l8gre739bhq3t0q61d0; path=/; secure; HttpOnly; SameSite=None" // Add moodle cookie like in the other provider
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
        token.accessTokenExpires = Date.now() + 1 * 60 * 1000; // 1 phút
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

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      if (token.authCookie) {
        console.log("Refreshing access token...");
        console.log("Current token:", token);
        try {
          const { refreshAccessToken } = await import("@/hooks/client/userApi");
          const refreshed = await refreshAccessToken(token.authCookie);
          console.log("Refreshed token:", refreshed);
          token.accessToken = refreshed.accessToken;
          token.accessTokenExpires = Date.now() + refreshed.expiresIn * 1000;
          return token;
        } catch (error) {
          console.error("Refresh token failed in jwt callback:", error);
          return token;
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
