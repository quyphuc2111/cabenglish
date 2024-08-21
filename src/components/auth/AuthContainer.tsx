"use client";
import { useState } from "react";
import AuthForm from "./AuthForm";

const AuthContainer = () => {
 
  const [isSignIn, setIsSignIn] = useState(false);

  const handleSubmitButton = () => {
    setIsSignIn(!isSignIn)

  }

  return (
    <div className="relative w-full max-w-3xl bg-white shadow-lg overflow-hidden rounded-3xl">
      <div className="flex w-full min-h-[480px]">
        <AuthForm type="Sign In" animated={isSignIn} />
        <AuthForm type="Sign Up" animated={isSignIn} />
      </div>
      <div
        className={`absolute top-0 left-1/2 transform ${
          isSignIn
            ? "-translate-x-full rounded-r-[150px]"
            : "translate-x-0 rounded-l-[150px]"
        } w-1/2 h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-700 ease-in-out`}
      >
        <div className="absolute w-full h-full flex items-center justify-center flex-col p-10">
          <h1 className="text-3xl font-bold text-white">
            {isSignIn ? "Welcome Back!" : "Hello, Friend!"}
          </h1>

          {!isSignIn && (
              <p
                className={`text-white mt-4 text-center transition-all duration-700 ease-in-out transform translate-x-0 opacity-100`}
              >
                Register with your personal details to use all of the site
                features.
              </p>
            )}

          {isSignIn && (
            <p className="text-white mt-4 text-center transition-all duration-700 ease-in-out transform translate-x-0 opacity-100">
              Enter your personal details to use all of the site features.
            </p>
          )}

          <button
            onClick={handleSubmitButton}
            className="bg-transparent border border-white text-white mt-4 p-2 px-6 rounded uppercase tracking-wide"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
