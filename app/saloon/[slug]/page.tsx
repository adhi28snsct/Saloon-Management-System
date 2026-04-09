"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  MapPin, 
  Phone, 
  ChevronRight, 
  Instagram,
  ArrowDown
} from "lucide-react";

export default function PublicSalonPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const businessQ = query(collection(db, "businesses"), where("slug", "==", slug));
        const businessSnap = await getDocs(businessQ);

        if (!businessSnap.empty) {
          const bizData = { id: businessSnap.docs[0].id, ...businessSnap.docs[0].data() };
          setBusiness(bizData);

          const servicesQ = query(
            collection(db, "services"), 
            where("businessId", "==", bizData.id), 
            where("isActive", "==", true)
          );
          const servicesSnap = await getDocs(servicesQ);
          const srvData = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setServices(srvData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchSalonData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
      <div className="w-8 h-8 border-t-2 border-stone-300 rounded-full animate-spin" />
    </div>
  );

  if (!business) return <div className="p-20 text-center font-serif text-stone-500 italic">Experience not found</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2C2A27] selection:bg-[#EAE4DC] antialiased">
      
      {/* 🌫️ BLUR-GLASS NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-10 h-24 flex items-center justify-between">
          <span className="font-serif text-2xl tracking-tighter text-white font-medium">
            {business.name}
          </span>
          <div className="flex items-center gap-12">
            <button 
              onClick={() => router.push(`/book/${business.slug}`)}
              className="bg-white/90 text-stone-900 px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-all shadow-xl active:scale-95"
            >
              Reservations
            </button>
          </div>
        </div>
      </nav>

      {/* 🎞️ ATMOSPHERIC HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {business.coverImage ? (
            <img 
              src={business.coverImage} 
              className="w-full h-full object-cover scale-110 animate-subtle-zoom brightness-[0.65]" 
              alt={business.name} 
            />
          ) : (
            <div className="w-full h-full bg-stone-300" />
          )}
          {/* Layered Cinematic Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDFCFB]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-transparent to-transparent opacity-60" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 space-y-8 translate-y-8 animate-fade-in-up">
          <h1 className="text-7xl md:text-[11rem] font-serif leading-none tracking-tighter text-white">
            {business.name}
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-serif italic font-light tracking-wide max-w-2xl mx-auto">
            {business.description || "Crafted for those who value the quiet art of transformation."}
          </p>
          <div className="pt-12 flex justify-center">
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-4 text-white/60 hover:text-white transition-colors group"
            >
              <span className="text-[10px] uppercase tracking-[0.4em]">Begin</span>
              <ArrowDown className="w-4 h-4 animate-bounce group-hover:translate-y-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 📖 SIGNATURE "WOW" SECTION (Emotional Anchor) */}
      <section className="py-60 bg-[#2C2A27] text-[#FDFCFB] overflow-hidden">
        <div className="max-w-7xl mx-auto px-10 relative">
          <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-stone-500/10 blur-[120px] rounded-full" />
          <div className="relative z-10 text-center space-y-12">
            <h2 className="text-5xl md:text-[5.5rem] font-serif leading-tight tracking-tighter">
              Crafted for those <br /> 
              <span className="italic font-light opacity-60">who value refinement.</span>
            </h2>
            <div className="w-px h-24 bg-[#FDFCFB]/20 mx-auto" />
          </div>
        </div>
      </section>

      {/* 🕯️ THE LUXURY MENU */}
      <section id="services" className="py-48 px-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-32 flex flex-col items-center text-center space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">The Curation</h2>
            <p className="text-5xl font-serif">Selected Treatments</p>
          </div>

          <div className="divide-y divide-stone-100">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="group py-14 flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-700 cursor-pointer"
                onClick={() => router.push(`/book/${business.slug}?service=${service.id}`)}
              >
                <div className="space-y-3">
                  <h3 className="text-4xl font-serif font-light transition-all group-hover:italic">
                    {service.name}
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-medium">
                    {service.duration} Minutes
                  </p>
                </div>
                
                <div className="flex items-center gap-12">
                  <span className="text-3xl font-serif text-stone-300 group-hover:text-stone-900 transition-colors duration-500">
                    ₹{service.price}
                  </span>
                  <div className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-700">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📍 THE LOCATION SCENE */}
      <section className="py-60 bg-[#F7F5F2] border-t border-stone-200/40">
        <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-24">
             <h2 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none">
                Experience <br />
                <span className="italic font-light text-stone-400">Stillness.</span>
             </h2>
             
             <div className="grid sm:grid-cols-2 gap-20">
                <div className="space-y-8">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400">Address</h4>
                  <p className="text-2xl font-serif leading-relaxed text-stone-600 font-light">
                    {business.address || "Location details upon reservation."}
                  </p>
                </div>

                <div className="space-y-8">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400">Contact</h4>
                  <p className="text-2xl font-serif leading-relaxed text-stone-600 font-light">
                    {business.phone || "Connect with us"}
                  </p>
                  <div className="flex gap-6 pt-4">
                    <Instagram className="w-5 h-5 text-stone-300 hover:text-stone-900 transition-colors cursor-pointer" />
                  </div>
                </div>
             </div>
          </div>

          <div className="relative group">
            {/* Soft Shadow Glow */}
            <div className="absolute inset-0 bg-stone-900/5 blur-[100px] rounded-full translate-y-12 transition-all duration-1000 group-hover:blur-[120px]" />
            <div className="relative bg-white p-20 rounded-[3rem] text-center space-y-10 border border-white shadow-2xl">
               <h3 className="text-4xl font-serif italic">Secure your time.</h3>
               <p className="text-stone-400 font-light text-sm max-w-[280px] mx-auto leading-relaxed">
                 To ensure the highest standard of service, we operate on an appointment-only basis.
               </p>
               <button 
                  onClick={() => router.push(`/book/${business.slug}`)}
                  className="w-full bg-[#2C2A27] text-white py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-stone-700 shadow-xl transition-all"
               >
                 Request Appointment
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ MINIMAL FOOTER */}
      <footer className="py-24 border-t border-stone-100 text-center space-y-8">
        <span className="font-serif text-3xl tracking-tighter opacity-10 italic">
          {business.name}
        </span>
        <p className="text-[9px] uppercase tracking-[1em] text-stone-300 font-medium">
          EST. {new Date().getFullYear()} — PRIVATE STUDIO
        </p>
      </footer>

      {/* 🪄 GLOBAL CSS FOR ANIMATIONS */}
      <style jsx global>{`
        @keyframes subtle-zoom {
          from { transform: scale(1.1); }
          to { transform: scale(1.0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}