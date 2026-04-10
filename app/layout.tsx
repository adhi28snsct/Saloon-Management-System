import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../components/AuthContext";
import { cn } from "@/lib/utils";

// Modern, crisp fonts
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
    <html lang="en" className={cn("scroll-smooth", geistSans.variable, geistMono.variable)}>
      <body
        className="font-sans antialiased bg-slate-50/50 text-slate-900 min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900"
      >
        <AuthProvider>
          {/* Main layout container */}
          <div className="flex flex-1 flex-col">
            <main className="flex-grow">
              {children}
            </main>

            {/* Subtle, Minimal Footer */}
            <footer className="border-t border-slate-200 bg-white py-8">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col items-center md:items-start">
                   <h2 className="font-bold text-sm tracking-tight text-slate-900">
                    SalonOS <span className="text-indigo-600">Core</span>
                  </h2>
                  <p className="text-slate-400 text-[11px] mt-1">
                    © 2026 SalonDash Management Systems.
                  </p>
                </div>
                
                <div className="flex gap-6 text-xs font-medium text-slate-500">
                  <span className="hover:text-indigo-600 cursor-pointer transition-colors">Support</span>
                  <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy</span>
                  <span className="hover:text-indigo-600 cursor-pointer transition-colors">Docs</span>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}