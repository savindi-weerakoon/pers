"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { getFirebaseAuth } from "../lib/firebaseClient";

const AuthContext = createContext({ user: null, loading: true, signOut: async () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const auth = getFirebaseAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []); // Remove auth dependency to prevent re-initialization

  const value = useMemo(
    () => ({
      user,
      loading,
      signOut: async () => {
        // Clear assessment scores from localStorage on sign out
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('assessment:scores');
          }
        } catch (error) {
          console.error('Failed to clear scores from localStorage:', error);
        }
        
        await firebaseSignOut(auth);
      },
    }),
    [user, loading] // Remove auth dependency
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


