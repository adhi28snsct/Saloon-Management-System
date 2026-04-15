"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  PhoneCall,
  Scissors,
  LogOut,
  Settings,
  UserCircle,
  ChevronRight
} from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: CalendarDays },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Follow-ups", href: "/follow-ups", icon: PhoneCall },
  { name: "Services", href: "/services", icon: Scissors },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (pathname === "/login" || pathname.startsWith("/book/")) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 bg-white px-4 py-7">

      {/* 🔥 BRANDING SECTION - ICON SIZE BOOSTED */}
      <div
        className="mb-12 flex items-center gap-4 px-1 cursor-pointer hover:opacity-80 transition"
        onClick={() => router.push("/dashboard")}
      >
        {/* Container has no H/W limits to allow the image to grow */}
        <div className="flex shrink-0 items-center justify-center">
          <Image
            src="/icon.png" 
            alt="SalonOS Logo"
            width={70}  // Forced large width
            height={70} // Forced large height
            className="object-contain scale-150 origin-left" // scale-150 makes it huge
            priority
          />
        </div>

        {/* Brand Name - Shifted slightly left to balance the larger icon */}
        <span className="text-2xl font-black tracking-tighter text-slate-900 -ml-2">
          SalonOS
        </span>
      </div>

      {/* --- MAIN NAVIGATION --- */}
      <div className="flex flex-1 flex-col gap-8">
        <div>
          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Management
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname === "/" && item.href === "/dashboard");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-3 transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xl scale-[1.02]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                      strokeWidth={2.5}
                    />
                    <span className="text-sm font-bold">{item.name}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* --- FOOTER SECTION --- */}
      <div className="mt-auto flex flex-col gap-4 border-t border-slate-100 pt-6">

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
             <UserCircle className="h-8 w-8 text-slate-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 capitalize truncate">
              {userData?.role || "Owner"}
            </span>
            {loading ? (
              <div className="h-3 w-20 animate-pulse bg-slate-200 mt-1 rounded"></div>
            ) : (
              <span className="text-[11px] text-slate-500 truncate">
                {userData?.email}
              </span>
            )}
          </div>
        </div>

        <nav className="flex flex-col gap-1">
            <Link
              href="/settings"
              className={`flex items-center gap-3 px-3 py-2 text-sm transition rounded-lg ${
                pathname === "/settings" 
                ? "bg-slate-100 text-slate-900 font-bold" 
                : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Settings className="h-5 w-5" strokeWidth={2} />
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-bold"
            >
              <LogOut className="h-5 w-5" strokeWidth={2} />
              Logout
            </button>
        </nav>
      </div>
    </aside>
  );
}