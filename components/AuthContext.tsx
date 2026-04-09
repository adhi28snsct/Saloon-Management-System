"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";

type UserData = {
  uid: string;
  name?: string;
  email?: string;
  slug?: string;
  role?: string;
  businessId?: string;
  createdAt?: string;

  // 🔥 ADD THESE (IMPORTANT)
  description?: string;
  phone?: string;
  address?: string;
  coverImage?: string;
};
type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setUserData(snap.data() as UserData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ================= GLOBAL ROUTE GUARD ================= */

  useEffect(() => {
    if (loading) return;

    const isPublic =
      pathname.startsWith("/login") ||
      pathname.startsWith("/book") ||
      pathname.startsWith("/saloon");

    if (!user && !isPublic) {
      router.replace("/login");
    }

    if (user && pathname.startsWith("/login")) {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking session...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}