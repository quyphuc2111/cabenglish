import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosError } from "axios";
import { fetchUserByEmail, createUser } from "@/hooks/client/userApi";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    userId?: string;
    mode?: string;
    email?: string;
    isFirstLogin?: boolean;
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
    role?: string;
    userId?: string;
    mode?: string;
    isFirstLogin?: boolean;
    theme: "theme-blue" | "theme-gold" | "theme-pink" | "theme-red";
    authCookie?: string;
    language?: string;
    moodleCookie?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      role?: string;
      userId?: string;
      mode?: string;
      name?: string;
      email?: string;
      isFirstLogin?: boolean;
      theme?: string;
      authCookie?: string;
      language?: string;
      moodleCookie?: string;
    };
  }
}

interface LoginResponse {
  // user: {
  //   id: string;
  //   name: string;
  //   email: string;
  // };
  role: string;
  token: string;
  username: string;
  message?: string;
}

interface UserResponse {
  user_id: string;
  email: string;
  language: string;
  theme: string;
  mode: string;
  is_firstlogin: boolean;
}

interface Credentials {
  email: string;
  password: string;
}

const ACC_DOMAIN = process.env.BKT_ACCOUNT_API_URL;
const SMK_DOMAIN = process.env.NEXT_PUBLIC_API_URL;

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

          console.log("api url", ACC_DOMAIN);

          const loginResponse = await axios.post(
            `${ACC_DOMAIN}/api/Account/login`,
            {
              email: credentials.email,
              password: credentials.password,
              app_id: 1
            },
            {
              withCredentials: true
            }
          );

          const data = loginResponse.data;
          console.log("Login response:", data);

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
              // If fetchUserByEmail succeeds, treat as user found or created
            } catch (error) {
              if (axios.isAxiosError(error) && error.response?.status === 404) {
                // User not found, attempt to create
                try {
                  userResponse = await createUser(
                    {
                      email: credentials.email,
                      user_id: userId.toString(),
                      language: "vi",
                      theme: "theme-blue",
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
                data.roles && data.roles.length > 0 ? data.roles[0] : undefined,
              accessToken: data.accessToken,
              isFirstLogin: userResponse.is_firstlogin || false,
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
    })
  ],
  callbacks: {
    async jwt({
      token,
      user
    }: {
      token: JWT;
      user: User | null;
    }): Promise<JWT> {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.userId = user.userId;
        token.mode = user.mode;
        token.theme = user.theme;
        token.email = user.email;
        token.language = user.language;
        token.isFirstLogin = user.isFirstLogin;
        token.authCookie = user.authCookie;
        token.moodleCookie = user.moodleCookie;
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
        session.user.isFirstLogin = token.isFirstLogin;
        session.user.authCookie = token.authCookie;
        session.user.moodleCookie = token.moodleCookie;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
};
