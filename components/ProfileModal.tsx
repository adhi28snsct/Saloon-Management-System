"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  MapPin, 
  Phone, 
  Clock, 
  ArrowRight, 
  Scissors, 
  Sparkles, 
  Instagram, 
  ArrowUpRight,
  Wind
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
      <div className="w-16 h-[2px] bg-stone-200 overflow-hidden">
        <div className="w-full h-full bg-stone-800 animate-slide" />
      </div>
    </div>
  );

  if (!business) return <div className="p-20 text-center font-serif">Salon Not Found</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2C2B29] selection:bg-[#EAE4DC] relative overflow-x-hidden">
      
      {/* 🌫️ TEXTURE OVERLAYS (Fills the "Emptiness") */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      <div className="absolute top-[10%] -left-[5%] text-[25vw] font-serif italic text-stone-100/50 select-none -z-10 tracking-tighter">
        {business.name[0]}
      </div>

      {/* 🌿 REFINED NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-serif text-2xl tracking-tighter font-semibold">
              {business.name}
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">
            <a href="#services" className="hover:text-stone-900 transition-colors">Treatments</a>
            <a href="#location" className="hover:text-stone-900 transition-colors">Location</a>
          </div>

          <button 
            onClick={() => router.push(`/book/${business.slug}`)}
            className="bg-[#2C2B29] text-white px-7 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-stone-700 transition-all shadow-xl"
          >
            Book Appointment
          </button>
        </div>
      </nav>

      {/* 🏛️ HERO SECTION */}
      <section className="relative pt-48 pb-24 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-12 z-10">
            <div className="flex items-center gap-4 text-stone-400">
              <div className="w-12 h-px bg-stone-200" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Premium Sanctuary</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-serif leading-[0.9] tracking-tighter text-stone-900">
              Quiet <br />
              <span className="italic font-light text-stone-400">Elegance.</span>
            </h1>

            <p className="text-xl text-stone-500 max-w-sm leading-relaxed font-light italic">
              "{business.description || "A space where time slows down and your natural beauty takes center stage."}"
            </p>

            <div className="flex items-center gap-8">
               <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-4 bg-stone-900 text-white pl-8 pr-2 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:pr-8"
              >
                View Menu 
                <div className="w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
             <div className="absolute -inset-10 bg-[#EAE4DC]/40 rounded-full blur-[100px] -z-10" />
             <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[1px] border-stone-100">
                {business.coverImage ? (
                  <img src={business.coverImage} className="w-full h-full object-cover" alt="Salon" />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center italic text-stone-300">Image Studio</div>
                )}
             </div>
             {/* Float badge to fill space */}
             <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-2xl border border-stone-50 max-w-[200px] hidden md:block">
                <Sparkles className="w-5 h-5 text-stone-300 mb-3" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Curation</p>
                <p className="text-xs font-medium leading-relaxed">Handpicked treatments for holistic well-being.</p>
             </div>
          </div>
        </div>
      </section>

      {/* ✂️ SERVICES - "The Boutique Menu" */}
      <section id="services" className="py-40 bg-white relative">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex flex-col items-center mb-32 text-center space-y-6">
            <Wind className="w-8 h-8 text-stone-200" />
            <h2 className="text-5xl font-serif">The Treatment Menu</h2>
            <div className="w-12 h-px bg-stone-100" />
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="group relative p-10 rounded-[2rem] hover:bg-[#FDFCFB] border border-transparent hover:border-stone-100 transition-all duration-500 cursor-pointer overflow-hidden"
                onClick={() => router.push(`/book/${business.slug}?service=${service.id}`)}
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-stone-300 group-hover:text-stone-500 transition-colors">Signature Experience</p>
                    <h3 className="text-3xl font-serif">{service.name}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 tracking-widest">
                      <Clock className="w-3 h-3" /> {service.duration} MINUTES
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-10">
                    <span className="text-3xl font-serif font-light text-stone-300 group-hover:text-stone-900 transition-colors">₹{service.price}</span>
                    <div className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-4">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📍 CONTACT - Minimalist Anchor */}
      <section id="location" className="py-40 bg-[#FDFCFB]">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-20">
             <div className="space-y-6">
                <h2 className="text-6xl font-serif leading-[1.1]">Visit our <br /><span className="italic font-light text-stone-400">Studio Space.</span></h2>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-16">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-stone-300" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Location</span>
                  </div>
                  <p className="text-lg text-stone-600 font-light max-w-[200px] leading-relaxed">
                    {business.address || "Location details upon request."}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-stone-300" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Contact</span>
                  </div>
                  <p className="text-lg text-stone-600 font-light leading-relaxed">
                    {business.phone || "Connect digitally"}
                  </p>
                  <div className="flex gap-4 pt-2">
                    <Instagram className="w-5 h-5 text-stone-300 hover:text-stone-900 cursor-pointer transition-colors" />
                  </div>
                </div>
             </div>
          </div>

          <div className="relative p-1 bg-gradient-to-br from-stone-100 to-transparent rounded-[3rem]">
            <div className="bg-white p-16 rounded-[2.9rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] text-center space-y-10 border border-white">
               <h3 className="text-4xl font-serif italic font-light">Experience the Calm.</h3>
               <p className="text-stone-400 text-sm font-light max-w-[280px] mx-auto leading-relaxed">
                 We recommend booking at least 48 hours in advance to ensure your preferred time.
               </p>
               <button 
                  onClick={() => router.push(`/book/${business.slug}`)}
                  className="w-full bg-[#2C2B29] text-white py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-stone-800 transition-all shadow-2xl active:scale-[0.98]"
               >
                 Request Appointment
               </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-stone-100 flex flex-col items-center gap-8">
        <span className="font-serif text-xl tracking-tighter opacity-50">{business.name}</span>
        <p className="text-[9px] uppercase tracking-[0.6em] text-stone-300 font-bold">
          {new Date().getFullYear()} — BESPOKE WELLNESS
        </p>
      </footer>
    </div>
  );
}