"use client";

import React from "react";
import { Bell, UserCircle, LogOut, ExternalLink, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function TopNav() {
  const pathname = usePathname();
  const { userData } = useAuth();

  if (pathname === "/login" || pathname.startsWith("/book/")) {
    return null;
  }

  // Generate a clean page title based on the route
  const getPageTitle = () => {
    const segment = pathname.split("/").pop();
    if (!segment || segment === "dashboard") return "Admin Console";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      
      {/* --- Left: Dynamic Title --- */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold tracking-tight text-slate-900">
          {getPageTitle()}
        </h1>
        <div className="hidden md:flex items-center bg-slate-100 px-2 py-1 rounded-md">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Live</span>
           <div className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* --- Right: Actions --- */}
      <div className="flex items-center gap-3">
        
        {/* Search Bar Shortcut (Visual only for now) */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 mr-2 group focus-within:ring-2 ring-indigo-50 transition-all">
          <Search className="h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search appointments..." 
            className="bg-transparent text-sm outline-none w-40 text-slate-600 placeholder:text-slate-400"
          />
          <kbd className="text-[10px] font-sans bg-white border border-slate-200 px-1.5 rounded text-slate-400">⌘K</kbd>
        </div>

        {/* Notifications */}
        <button className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-300 hover:text-slate-900 shadow-sm">
          <Bell className="h-4 w-4" strokeWidth={2} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200 mx-2" />

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-bold text-slate-900 leading-none">
              {userData?.name || "Owner"}
            </span>
            <div className="flex items-center gap-1 mt-1 cursor-pointer group">
               <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                salon/{userData?.slug || "..."}
              </span>
              <ExternalLink className="h-2.5 w-2.5 text-slate-300 group-hover:text-indigo-400" />
            </div>
          </div>

          {/* Avatar Dropdown Trigger */}
          <div className="relative group">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
              {userData?.name ? (
                <span className="text-sm font-bold text-slate-700">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserCircle className="h-6 w-6 text-slate-400" strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
            title="Log out"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}