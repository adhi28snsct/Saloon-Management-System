"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Phone, 
  ChevronRight, 
  Instagram,
  ArrowDown,
  Star,
  Users,
  Award,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";

export default function PremiumSalonLanding() {
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

          const servicesQ = query(collection(db, "services"), where("businessId", "==", bizData.id), where("isActive", "==", true));
          const servicesSnap = await getDocs(servicesQ);
          setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    if (slug) fetchSalonData();
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#fcfaf7] animate-pulse font-serif italic text-gray-400">Loading experience...</div>;
  if (!business) return <div className="p-20 text-center font-serif bg-[#fcfaf7]">Studio not found.</div>;

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-gray-900 selection:bg-stone-200 antialiased font-sans">
      
      {/* 🌫️ CONVERSION-FOCUSED NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcfaf7]/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="font-serif text-2xl tracking-tight cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            {business.name}
          </span>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden md:block text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-black transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => router.push(`/book/${business.slug}`)}
              className="bg-black text-white px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.1em] font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95"
            >
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {/* 🎞️ HIGH-CONVERSION HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={business.coverImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop"} 
            className="w-full h-full object-cover brightness-[0.7]" 
            alt={business.name} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf7] via-transparent to-black/20" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 animate-fade-in-up">
          <h1 className="text-6xl md:text-9xl font-serif text-white mb-6 drop-shadow-sm">
            {business.name}
          </h1>
          <p className="text-stone-200 text-lg md:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Elevated grooming and wellness. Book your session at our {business.city || "private"} studio.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push(`/book/${business.slug}`)}
              className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Appointment
            </button>
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-black/30 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-black/50 transition-all"
            >
              View Services
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <ArrowDown className="w-6 h-6" />
        </div>
      </section>

      {/* 🏆 TRUST SIGNALS BAR */}
      <section className="py-12 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-stone-100 p-3 rounded-full"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /></div>
            <div><p className="font-bold text-lg leading-none">4.9/5</p><p className="text-[10px] uppercase text-stone-400 tracking-tighter">Google Rating</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-stone-100 p-3 rounded-full"><Users className="w-5 h-5 text-stone-600" /></div>
            <div><p className="font-bold text-lg leading-none">2,400+</p><p className="text-[10px] uppercase text-stone-400 tracking-tighter">Happy Clients</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-stone-100 p-3 rounded-full"><Award className="w-5 h-5 text-stone-600" /></div>
            <div><p className="font-bold text-lg leading-none">8 Years</p><p className="text-[10px] uppercase text-stone-400 tracking-tighter">Experience</p></div>
          </div>
        </div>
      </section>

      {/* 🕯️ VISUAL SERVICE GRID */}
      <section id="services" className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-[11px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-4">The Selection</h2>
            <p className="text-4xl md:text-6xl font-serif">Curated Treatments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="group bg-white rounded-[2rem] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
                onClick={() => router.push(`/book/${business.slug}?service=${service.id}`)}
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={service.image || "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={service.name} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    ₹{service.price}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-serif mb-2 group-hover:text-stone-600 transition-colors">{service.name}</h3>
                    <div className="flex items-center gap-4 text-stone-400 text-xs mb-6">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration} mins</span>
                    </div>
                  </div>
                  <button className="w-full py-4 border border-stone-200 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold group-hover:bg-black group-hover:text-white group-hover:border-black transition-all flex items-center justify-center gap-2">
                    Select Service <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📍 CONTACT & LOCATION */}
      <section className="py-24 bg-stone-900 text-white rounded-[3rem] mx-4 md:mx-10 mb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-2 gap-20 relative z-10">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-7xl font-serif leading-tight">Find us in the <br/><span className="italic text-stone-400">Heart of {business.city || "the City"}.</span></h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-stone-500 mt-1" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Studio Address</p>
                  <p className="text-xl font-light">{business.address || "Available on request"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-stone-500 mt-1" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Contact</p>
                  <p className="text-xl font-light">{business.phone || "Connect with us"}</p>
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="h-[400px] bg-stone-800 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
             {/* Mock Map Background */}
             <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s-l+000(0,0)/0,0,1/1000x1000?access_token=YOUR_TOKEN')] bg-cover opacity-50" />
          </div>
        </div>
      </section>

      {/* 🎯 FINAL CTA SECTION */}
      <section className="py-40 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-10 animate-fade-in-up">
          <h2 className="text-5xl md:text-8xl font-serif leading-none tracking-tighter">Ready for <br/> refinement?</h2>
          <p className="text-stone-500 text-lg md:text-xl font-light">Join our list of discerning clients today.</p>
          <button 
            onClick={() => router.push(`/book/${business.slug}`)}
            className="bg-black text-white px-12 py-6 rounded-full text-xs uppercase tracking-[0.3em] font-bold hover:scale-105 transition-transform shadow-2xl active:scale-95"
          >
            Reserve Your Time
          </button>
        </div>
      </section>

      {/* 📱 STICKY MOBILE CTA */}
      <div className="fixed bottom-6 right-6 z-[60] md:hidden">
        <button 
          onClick={() => router.push(`/book/${business.slug}`)}
          className="bg-black text-white px-8 py-5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl active:scale-95 flex items-center gap-3"
        >
          <Calendar className="w-4 h-4" /> Book Now
        </button>
      </div>

   

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
    </div>
  );
}