"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* 1. SIDEBAR - Pinned to the left */}
      <div className="flex-none w-60 border-r border-slate-200">
        <Sidebar />
      </div>

      {/* 2. RIGHT CONTENT AREA */}
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-slate-50/30">
        
        {/* TOP NAVIGATION - Fixed at top of content */}
        <div className="flex-none border-b border-slate-200 bg-white/80 backdrop-blur-md z-10">
          <TopNav />
        </div>

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <main className="min-h-[calc(100vh-64px)] p-6 lg:p-10">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>

      <footer className="border-t border-slate-200 bg-white py-8">
  <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
    
    {/* Left */}
    <div className="flex flex-col items-center md:items-start">
      <h2 className="font-bold text-sm tracking-tight text-slate-900">
        SaloonOS <span className="text-indigo-600">Core</span>
      </h2>

      <p className="text-slate-400 text-[11px] mt-1">
        © 2026 SaloonOS. All rights reserved.
      </p>
    </div>

    {/* Right - Support Info */}
    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-xs font-medium text-slate-500">
      
      {/* Email */}
      <a
        href="mailto:adhithyaarul28@gmail.com"
        className="hover:text-indigo-600 transition-colors"
      >
        📧 adhithyaarul28@gmail.com
      </a>

      {/* Phone */}
      <a
        href="tel:8072268570"
        className="hover:text-indigo-600 transition-colors"
      >
        📞 8072268570
      </a>

    </div>
  </div>
</footer>
        </div>
      </div>
    </div>
  );
}