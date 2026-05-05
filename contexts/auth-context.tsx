import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "../firebaseConfig";

type AppRole = "user" | "admin";

type RegisterInput = {
  displayName: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthLoading: boolean;
  role: AppRole;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>("user");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setRole("user");
        setIsAuthLoading(false);
        return;
      }

      try {
        const userSnapshot = await getDoc(doc(db, "users", nextUser.uid));
        const nextRole = userSnapshot.data()?.role === "admin" ? "admin" : "user";
        setRole(nextRole);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setRole("user");
      } finally {
        setIsAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      isAuthLoading,
      async login(email, password) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      async register({ displayName, email, password }) {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, {
          displayName: displayName.trim(),
        });
        await setDoc(
          doc(db, "users", credential.user.uid),
          {
            uid: credential.user.uid,
            displayName: displayName.trim(),
            email: credential.user.email,
            role: "user",
            notificationsEnabled: true,
            createdAt: serverTimestamp(),
            security: {
              adminVerifiedMatchesOnly: true,
              lastPolicyVersion: 1,
            },
          },
          { merge: true }
        );
      },
      async logout() {
        await signOut(auth);
      },
    }),
    [isAuthLoading, role, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
