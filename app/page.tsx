"use client";

import Link from "next/link";
import { Sparkles, CheckCircle2, ChevronRight, Play } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#fcfaf7] text-gray-900 selection:bg-stone-100">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full px-6 md:px-12 h-20 flex items-center justify-between border-b border-stone-200 bg-white/80 backdrop-blur-sm z-50">
        <h1 className="text-2xl font-bold tracking-tighter text-black">SalonOS</h1>

        <div className="flex items-center gap-6">
          <Link href="/saloon/demo" className="text-sm font-medium text-gray-500 hover:text-black transition flex items-center gap-1.5">
            Demo <ChevronRight className="w-4 h-4" />
          </Link>

          <Link href="/login">
            <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-200">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* 🔥 HERO WITH BACKGROUND LOGO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-36 overflow-hidden border-b border-stone-100">
        <div className="absolute inset-0 opacity-100">
          <Image
            src="/logo.png"
            alt="Background Logo"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-[#fcfaf7]/70" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl bg-white/10 p-10 rounded-3xl backdrop-blur-sm border border-white/5 shadow-2xl shadow-[#fcfaf7]/20">
          <div className="mb-6 flex shrink-0 items-center justify-center">
            <Image
              src="/icon.png"
              alt="SalonOS Icon"
              width={70}
              height={70}
              className="object-contain"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-gray-100 text-gray-600 text-sm font-bold mb-10 shadow-lg shadow-gray-100">
            <Sparkles className="w-4 h-4 text-gray-400" />
            SalonOS Platform
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-black">
            Run your salon like a{" "}
            <span className="text-gray-400">modern business.</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
            SalonOS helps you manage bookings, track clients, and grow your salon —
            all in one simple, powerful system.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-12">
            <Link href="/login">
              <button className="bg-black text-white hover:bg-gray-800 rounded-xl px-7 py-3.5 shadow-xl shadow-gray-200 transition-all duration-200 active:scale-95 font-bold w-full sm:w-auto">
                Get Started
              </button>
            </Link>

            <Link href="/saloon/demo">
              <button className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-xl px-7 py-3.5 shadow-xl shadow-gray-100 transition-all duration-200 active:scale-95 font-bold w-full sm:w-auto flex items-center justify-center gap-2">
                 <Play className="w-4 h-4 fill-gray-300 text-gray-300"/> View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="px-6 py-28 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black mb-6">
          Still managing bookings manually?
        </h2>
        <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Missing customer calls, managing appointments on WhatsApp, and losing
          potential revenue? It’s time to upgrade your salon system.
        </p>
      </section>

      {/* SOLUTION */}
      <section className="px-6 py-24 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          
          <div className="space-y-6 p-10 bg-[#fcfaf7]/50 rounded-3xl border border-stone-100">
            <h3 className="text-2xl font-bold tracking-tight text-black">
              Everything your salon needs
            </h3>
            <ul className="space-y-4 text-gray-700 font-medium">
              {[ "Your own booking website", "Smart appointment management", "Customer tracking system", "Clean and powerful dashboard"].map((item, i) => (
                <li key={i} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-black shrink-0" /> {item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 p-10 bg-[#fcfaf7]/50 rounded-3xl border border-stone-100">
            <h3 className="text-2xl font-bold tracking-tight text-black">
              Designed for growth
            </h3>
            <ul className="space-y-4 text-gray-700 font-medium">
               {[ "Never miss a lead", "Increase bookings effortlessly", "Manage everything in one place", "Built for modern salon owners"].map((item, i) => (
                <li key={i} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-black shrink-0" /> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-32 text-center max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black mb-16">
          How SalonOS works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-sm font-semibold text-gray-800">
          {[ "1. Create your salon", "2. Add services", "3. Get your booking link", "4. Share with customers", "5. Start getting bookings 🎉"].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-stone-100 shadow-sm">{item}</div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-32 text-center bg-black text-white rounded-[3rem] mx-6 mb-6">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
          Start growing your salon today
        </h2>

        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-xl mx-auto">
          Set up your booking system in minutes and never miss a customer again.
        </p>

        <Link href="/login">
          <button className="bg-white text-black px-10 py-5 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition shadow-2xl shadow-gray-900/50">
            Get Started <Sparkles className="inline ml-2 w-5 h-5 text-amber-500" />
          </button>
        </Link>
      </section>

    

    </div>
  );
}