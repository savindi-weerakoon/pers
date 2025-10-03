"use client";

import React from "react";
import { useAuth } from "./AuthProvider";

export default function SignOutButton({ className }) {
  const { signOut } = useAuth();
  return (
    <button onClick={signOut} className={className || "px-4 py-2 bg-gray-200 rounded"}>
      Sign out
    </button>
  );
}


