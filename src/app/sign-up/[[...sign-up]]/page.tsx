"use client"
import { SignUp } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <SignUp />
      </div>
    </>
  );
}