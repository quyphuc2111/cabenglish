import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    userId?: string;
  }
}

declare module "next-auth" {
  interface User {
    accessToken?: string;
    role?: string;
    userId?: string;
    mode?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          if (!API_URL) {
            throw new Error("API_URL is not defined");
          }

          const response = await axios.post(
            `${API_URL}/api/Auth/login`,
            {
              username: credentials?.username,
              password: credentials?.password,
              rememberMe: true
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              withCredentials: true,
              httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
              })
            }
          );

          if (response.data) {
            return {
              id: response.data.user?.id,
              name: response.data.user?.name,
              email: response.data.user?.email,
              userId: 'user2',
              mode: 'freeMode',
              role: response.data.role,
              accessToken: response.data.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Authentication failed");
          }
          throw new Error("Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.userId = user.userId;
        token.mode = user.mode;

        // Set user vào store sau khi login thành công
        // useUserStore.getState().setUser({
        //   user_id: user.userId || '',
        //   email: user.email ?? '',
        //   language: 'vi',
        //   theme: 'light',
        //   mode: 'normal',
        //   progress: {
        //     units: [],
        //     lessons: [],
        //     sections: [],
        //     classrooms: []
        //   },
        //   locked: {
        //     sections: [],
        //     section_contents: [],
        //     lessons: []
        //   }
        // });
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = (token as any).accessToken;
        if (!session.user) {
          session.user = {};
        }
        session.user.role = (token as any).role;
        session.user.userId = (token as any).userId;
        session.user.mode = (token as any).mode;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.NEXTAUTH_SESSION_MAX_AGE) || 7 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 