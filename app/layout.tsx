"use client";

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../components/AuthContext";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"; // ✅ ADD THIS

// Fonts
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("scroll-smooth", geistSans.variable, geistMono.variable)}
    >
      <body className="font-sans antialiased bg-slate-50/50 text-slate-900 min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
        
        <AuthProvider>
          <div className="flex flex-1 flex-col">
            
            <main className="flex-grow">
              {children}
            </main>

          </div>

          {/* ✅ GLOBAL TOASTER (IMPORTANT) */}
          <Toaster />

        </AuthProvider>

      </body>
    </html>
  );
}