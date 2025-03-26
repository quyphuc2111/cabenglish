import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosError } from "axios";
import { cookies } from 'next/headers';

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
  }
}

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string;
    email?: string;
    accessToken?: string;
    role?: string;
    userId?: string;
    mode?: string;
    isFirstLogin?: boolean;
    theme: 'theme-blue' | 'theme-gold' | 'theme-pink' | 'theme-red';
    authCookie?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      role?: string;
      userId?: string;
      mode?: string;
      name?: string;
      email?: string;
      isFirstLogin?: string;
      theme?:string;
      authCookie?: string;
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
  is_firstlogin: boolean
}

interface Credentials {
  username: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Credentials | undefined): Promise<User | null> {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }
        
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL; 
          if (!API_URL) {
            throw new Error("API_URL is not defined");
          }

          const loginResponse = await axios.post<LoginResponse>(
            `${API_URL}/api/Auth/login`,
            {
              username: credentials?.username,
              password: credentials?.password,
              rememberMe: true
            }
          );

          // Lấy cookie từ response headers
          const authCookie = loginResponse.headers['set-cookie'];
          
          // Lưu ý: Trong Next.js, việc thiết lập cookie từ authorize callback có giới hạn
          // vì đây là server-side function nhưng không phải là Route Handler
          // Thay vào đó, bạn có thể:
          // 1. Lưu thông tin cookie vào session và thiết lập trong Route Handler
          // 2. Hoặc thiết lập cookie ở phía client sau khi đăng nhập thành công
          
          // Để lưu cookie từ API, bạn có thể tạo một API Route riêng
          // và gọi nó sau khi đăng nhập thành công

          if(loginResponse.data) {
            const userId = "user2" // lấy từ api login
            if (!userId) {
              throw new Error("User ID is not available");
            }
            const userResponse = await axios.get<UserResponse>(
              `${API_URL}/api/Users/${userId}`, {
                headers: {
                  Authorization: `Bearer ${loginResponse.data.token}`
                }
              }
            );

            if(userResponse) {
              return {
                email: userResponse.data.email,
                userId: userId,
                mode: userResponse.data.mode,
                role: loginResponse.data.role,
                accessToken: loginResponse.data.token,
                isFirstLogin: userResponse.data.is_firstlogin,
                theme: userResponse.data.theme as 'theme-blue' | 'theme-gold' | 'theme-pink' | 'theme-red',
                authCookie: authCookie ? authCookie[0] : undefined
              }
            }
          }

          // if (response.data) {
          //   return {
          //     id: response.data.user?.id,
          //     name: response.data.user?.name,
          //     email: response.data.user?.email,
          //     userId: "user2",
          //     mode: "freeMode",
          //     role: response.data.role,
          //     accessToken: response.data.token,
          //     isFirstLogin: false,
          //     theme: 'theme-blue'
          //   };
          // }
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
        token.isFirstLogin = user.isFirstLogin;
        token.authCookie = user.authCookie;
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
        session.user.isFirstLogin = token.isFirstLogin;
        session.user.authCookie = token.authCookie;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin"
  },
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.NEXTAUTH_SESSION_MAX_AGE) || 7 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
};
