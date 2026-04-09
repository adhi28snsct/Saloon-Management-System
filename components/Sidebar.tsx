"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  PhoneCall,
  Scissors,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: CalendarDays },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Follow-ups", href: "/follow-ups", icon: PhoneCall },
  { name: "Services", href: "/services", icon: PhoneCall },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // ❌ Hide on public routes
  if (pathname === "/login" || pathname.startsWith("/book/")) {
    return null;
  }

  // 🔐 Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // redirect after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-screen flex-col border-r bg-muted/40 w-64 pt-4 px-3 dark:bg-zinc-950">
      
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2 text-primary font-semibold text-lg">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <Scissors className="h-5 w-5" />
        </div>
        <span>SalonDash</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname === "/" && item.href === "/dashboard");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-2 pb-4 px-2">
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

        {/* Footer */}
        <div className="text-xs text-muted-foreground text-center mt-2">
          Powered by SalonDash
        </div>
      </div>
    </div>
  );
}