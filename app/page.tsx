"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-[calc(100vh-100px)] flex items-center justify-center bg-transparent">
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-gray-400" />
          Smart Salon System
        </div>

        {/* heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
          Grow your salon with a{" "}
          <span className="text-gray-400">
            modern dashboard.
          </span>
        </h1>

        {/* subtext */}
        <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
          Manage appointments, track clients, and increase revenue —
          all in one place with a beautiful, effortless interface.
        </p>

        {/* buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link href="/login">
            <button className="bg-black text-white hover:bg-gray-800 rounded-md px-6 py-3 shadow-sm transition-all duration-200 active:scale-95 font-medium w-full sm:w-auto">
              Get Started
            </button>
          </Link>

          <Link href="/book/demo">
            <button className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-md px-6 py-3 shadow-sm transition-all duration-200 active:scale-95 font-medium w-full sm:w-auto">
              View Demo
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}