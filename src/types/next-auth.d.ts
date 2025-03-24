import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
} 