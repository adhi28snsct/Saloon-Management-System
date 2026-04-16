"use client";

import React, { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createOrGetUser } from "@/lib/user";
import { createBusiness } from "@/lib/business";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

import { Scissors } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  /* ================= BLOCK LOGIN PAGE ================= */

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return null;
  }

  /* ================= GOOGLE LOGIN ================= */

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const { isNewUser } = await createOrGetUser(user);

      if (isNewUser) {
        await createBusiness(user);
        toast.success("Welcome! Your salon has been created 🎉");
      } else {
        toast.success("Welcome back 👋");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center text-center space-y-8"
      >
        {/* Logo */}
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full">
          <Scissors className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            SaloonOS
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage your salon appointments, customers, and business.
          </p>
        </div>

        {/* Google Button */}
        <Button
          size="lg"
          className="w-full h-12 text-base font-medium flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Button>

        {/* Terms */}
        <p className="text-xs text-slate-400 text-center w-full">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}