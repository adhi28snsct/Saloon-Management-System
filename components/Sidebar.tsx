"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-4 py-7 transition-all duration-300 ease-in-out">
      {/* --- BRANDING --- */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white ring-4 ring-slate-50">
          <Scissors className="h-5 w-5" strokeWidth={2} />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">
          SalonDash
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
                pathname === item.href || (pathname === "/" && item.href === "/dashboard");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`h-5 w-5 transition-colors ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                      strokeWidth={1.75}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* --- FOOTER / USER SECTION --- */}
      <div className="mt-auto flex flex-col gap-4 border-t border-slate-100 pt-6">
        {/* User Card */}
        <div className="group flex items-center gap-3 rounded-2xl border border-slate-50 bg-slate-50/50 p-3 transition-colors hover:border-slate-100">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
            <UserCircle className="h-6 w-6 text-slate-400" strokeWidth={1.5} />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></div>
          </div>
          <div className="min-w-0 flex-1 flex flex-col">
            <span className="truncate text-sm font-bold text-slate-900 capitalize">
              {userData?.role || "Team Member"}
            </span>
            {loading ? (
              <div className="h-3 w-20 animate-pulse rounded bg-slate-200 mt-1"></div>
            ) : (
              <span className="truncate text-[11px] text-slate-500">
                {userData?.email}
              </span>
            )}
          </div>
        </div>

        {/* Action Links */}
        <div className="space-y-1">
          <Link
            href="/settings"
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Settings className="h-5 w-5 text-slate-400 group-hover:rotate-45 transition-transform duration-500" strokeWidth={1.75} />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}