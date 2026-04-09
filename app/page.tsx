"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* BACKGROUND */}
      <img
        src="/salon-pic.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Salon"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10 flex items-center h-full px-16">

        <div className="max-w-2xl text-white">

          {/* badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <Sparkles className="w-4 h-4" />
            Smart Salon System
          </div>

          {/* heading */}
          <h1 className="text-6xl font-extrabold leading-tight">
            Grow your salon with a{" "}
            <span className="text-indigo-400">
              modern dashboard
            </span>
          </h1>

          {/* subtext */}
          <p className="mt-6 text-lg text-white/80">
            Manage appointments, track clients, and increase revenue —
            all in one place.
          </p>

          {/* buttons */}
          <div className="flex gap-4 mt-10">
            <Link href="/login">
              <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-lg">
                Get Started
              </button>
            </Link>

            <Link href="/book/demo">
              <button className="border border-white/30 px-6 py-3 rounded-xl font-semibold backdrop-blur-md hover:bg-white/10">
                View Demo
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}