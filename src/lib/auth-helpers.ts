import { signIn } from "next-auth/react";

export async function signInWithGoogleToken(data: {
  accessToken: string;
  accountId: string;
  username: string;
  email: string;
  roles: string[];
}) {
  try {
    const result = await signIn("google-token", {
      accessToken: data.accessToken,
      accountId: data.accountId,
      email: data.email,
      username: data.username,
      roles: JSON.stringify(data.roles),
      redirect: false
    });

    return {
      success: result?.ok || false,
      error: result?.error
    };
  } catch (error) {
    console.error("Error signing in with Google token:", error);
    return {
      success: false,
      error: "Failed to create session"
    };
  }
}
