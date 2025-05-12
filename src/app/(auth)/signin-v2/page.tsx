import React from "react";
import SignInV2Container from "@/components/auth/SignInV2Container";

async function SignInV2Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <SignInV2Container />
    </div>
  );
}

export default SignInV2Page;
