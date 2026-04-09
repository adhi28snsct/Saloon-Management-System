"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db} from "../../../lib/firebase";

import {
  MapPin,
  Phone,
  Clock,
  Star,
  Scissors,
  Award,
  ChevronRight,
  TrendingUp,
  MoveLeft,
  CalendarDays,
  CheckCircle2,
  Loader2,
} from "lucide-react";

/* =========================================
   TYPES
========================================= */
interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  address?: string;
  coverImage?: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price?: number;
  imageUrl?: string;
  isActive: boolean;
}

/* =========================================
   UTILS
========================================= */
const getUpcomingDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const formatTime = (time24: string) => {
  const [h, m] = time24.split(":");
  const hours = parseInt(h, 10);
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${m} ${ampm}`;
};

const categorizeServices = (services: Service[]) => {
  const categories = new Set<string>(["All"]);
  services.forEach((s) => {
    const n = s.name.toLowerCase();
    if (n.includes("hair") || n.includes("cut")) categories.add("Hair");
    else if (n.includes("beard") || n.includes("shave")) categories.add("Beard");
    else if (n.includes("facial") || n.includes("skin")) categories.add("Facial");
  });
  return Array.from(categories);
};

const getServiceImage = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("hair") || n.includes("cut"))
    return "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80";
  if (n.includes("beard") || n.includes("shave"))
    return "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80";
  if (n.includes("facial") || n.includes("skin"))
    return "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop&q=80";
  return "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&auto=format&fit=crop&q=80";
};

/* =========================================
   COMPONENTS
========================================= */
const SectionWrapper = ({ children, className = "", id = "" }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-16 md:py-20 ${className}`}>
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

const SkeletonLoader = () => (
  <div className="min-h-screen bg-stone-50 flex flex-col">
    <div className="h-16 bg-white border-b border-stone-100 flex items-center px-6">
      <div className="w-32 h-6 bg-stone-200 animate-pulse rounded-md" />
      <div className="ml-auto w-24 h-10 bg-stone-200 animate-pulse rounded-lg" />
    </div>
    <div className="h-[400px] w-full bg-stone-200 animate-pulse" />
    <div className="max-w-7xl mx-auto w-full px-6 py-16">
      <div className="w-64 h-10 bg-stone-200 animate-pulse rounded-xl mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-[350px] bg-white rounded-2xl animate-pulse" />
        <div className="h-[350px] bg-white rounded-2xl animate-pulse" />
        <div className="h-[350px] bg-white rounded-2xl animate-pulse" />
      </div>
    </div>
  </div>
);

function BookingForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const slug = params.slug as string;

  /* STATE */
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const containerRef = useRef<HTMLDivElement>(null);

  /* FETCH DATA */
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const q = query(collection(db, "businesses"), where("slug", "==", slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const doc = snap.docs[0];
          setBusiness({ id: doc.id, ...(doc.data() as any) });
        }
      } catch (err) { }
    };
    if (slug) fetchBusiness();
  }, [slug]);

  useEffect(() => {
    const fetchOwnerAndServices = async () => {
      if (!business?.id) return;
      try {
        const emailQ = query(collection(db, "users"), where("uid", "==", business.id));
        const emailSnap = await getDocs(emailQ);
        if (!emailSnap.empty) setOwnerEmail(emailSnap.docs[0].data().email);

        const srvQ = query(collection(db, "services"), where("businessId", "==", business.id), where("isActive", "==", true));
        const srvSnap = await getDocs(srvQ);
        const data: Service[] = [];
        srvSnap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Service));
        setServices(data);

        if (serviceParam) {
          const found = data.find((s) => s.id === serviceParam);
          if (found) {
            setSelectedService(found);
            setStep(2);
          }
        }
      } catch (err) { } finally {
        setLoading(false);
      }
    };
    fetchOwnerAndServices();
  }, [business, serviceParam]);

  const upcomingDays = getUpcomingDays();
  const categories = categorizeServices(services);
  const filteredServices = activeTab === "All" 
    ? services 
    : services.filter(s => {
        const n = s.name.toLowerCase();
        if (activeTab === "Hair") return n.includes("hair") || n.includes("cut");
        if (activeTab === "Beard") return n.includes("beard") || n.includes("shave");
        if (activeTab === "Facial") return n.includes("facial") || n.includes("skin");
        return true;
      });

  /* HANDLERS */
  const scrollToFlow = () => {
    if (containerRef.current) containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
    scrollToFlow();
  };

  const handleNext = () => {
    setStep(s => Math.min(s + 1, 4));
    scrollToFlow();
  };

  const handlePrev = () => {
    setStep(s => Math.max(s - 1, 1));
    scrollToFlow();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !selectedService || !selectedDate || !selectedTime || !ownerEmail) return;

    setSubmitting(true);
    try {
      const duration = selectedService.duration || 30;
      const [h, m] = selectedTime.split(":").map(Number);
      const d = new Date(); d.setHours(h); d.setMinutes(m + duration);
      const endTime = d.toTimeString().slice(0, 5);

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      await addDoc(collection(db, "appointments"), {
        name: formData.name, phone: formData.phone, email: formData.email,
        serviceName: selectedService.name, serviceId: selectedService.id,
        date: dateString, startTime: selectedTime, endTime, duration,
        businessId: business.id, ownerEmail,
        status: "BOOKED", source: "website", createdAt: new Date(),
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert("Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <SkeletonLoader />;
  if (!business) return <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500">Business not found.</div>;

  /* SUCCESS STATE */
  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-900">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-stone-200 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed</h2>
          <p className="text-stone-500 mb-8 max-w-xs mx-auto">Your appointment at {business.name} is scheduled.</p>
          
          <div className="bg-stone-50 rounded-xl p-5 text-left mb-8 space-y-4 border border-stone-100">
             <div className="flex items-center gap-3">
               <CalendarDays className="w-4 h-4 text-stone-400" />
               <p className="font-medium text-stone-800">{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}</p>
             </div>
             <div className="flex items-center gap-3">
               <Clock className="w-4 h-4 text-stone-400" />
               <p className="font-medium text-stone-800">{selectedTime && formatTime(selectedTime)}</p>
             </div>
             <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
               <Scissors className="w-4 h-4 text-stone-400" />
               <div>
                 <p className="font-semibold text-stone-800">{selectedService?.name}</p>
                 <p className="text-sm font-medium text-indigo-600">{selectedService?.price ? `₹${selectedService.price}` : 'Free'}</p>
               </div>
             </div>
          </div>
          <button className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold transition-all active:scale-[0.98]" onClick={() => window.location.reload()}>
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-24 sm:pb-0" ref={containerRef}>
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-[1240px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center font-bold text-sm shadow-sm">
              {business.name.substring(0,1).toUpperCase()}
            </div>
            <span className="font-bold text-lg hidden sm:block">{business.name}</span>
          </div>
          {step === 1 && (
             <button onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition-colors shadow-sm">
               Book Appointment
             </button>
          )}
        </div>
      </nav>

      {/* FOCUS WIZARD (Steps 2 - 4) */}
      {step > 1 ? (
        <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="mb-6">
            <button onClick={handlePrev} className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors mb-6 group">
              <MoveLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
              <h1 className="text-3xl font-bold tracking-tight">Complete Booking</h1>
              <span className="text-sm font-medium text-stone-400 hidden sm:block">Step {step}/4</span>
            </div>
            {/* Progress Track */}
            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${((step)/4)*100}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 mb-8 relative">
            
            {/* STEP 2: DATE */}
            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xl font-semibold mb-6">Choose a Date</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {upcomingDays.map((date, idx) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isToday = new Date().toDateString() === date.toDateString();
                    return (
                      <button
                        key={idx}
                        onClick={() => { setSelectedDate(date); setTimeout(handleNext, 150); }}
                        className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all 
                          ${isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'}
                        `}
                      >
                        <span className={`text-xs font-medium uppercase tracking-wider mb-1 ${isSelected ? 'text-indigo-600' : isToday ? 'text-indigo-600' : 'text-stone-500'}`}>
                          {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className={`text-2xl font-bold ${isSelected ? 'text-indigo-900' : 'text-stone-900'}`}>{date.getDate()}</span>
                        <span className={`text-xs font-medium uppercase tracking-wider ${isSelected ? 'text-indigo-600' : 'text-stone-400'}`}>
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: TIME */}
            {step === 3 && (
              <div className="animate-in fade-in duration-300">
                 <h3 className="text-xl font-semibold mb-2">Select a Time</h3>
                 <p className="text-sm text-stone-500 mb-6">Availability for {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                   {TIME_SLOTS.map(time => {
                     const isSelected = selectedTime === time;
                     return (
                       <button
                         key={time}
                         onClick={() => { setSelectedTime(time); setTimeout(handleNext, 150); }}
                         className={`py-3 px-2 rounded-lg text-sm font-medium border transition-all
                           ${isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'}
                         `}
                       >
                         {formatTime(time)}
                       </button>
                     );
                   })}
                 </div>
              </div>
            )}

            {/* STEP 4: DETAILS */}
            {step === 4 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xl font-semibold mb-6">Your Details</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">Full Name</label>
                    <input 
                      name="name" placeholder="e.g. Jane Doe" value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} 
                      required 
                      className="w-full rounded-lg h-12 border border-stone-200 bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm px-4 transition-all shadow-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">Phone Number</label>
                    <input 
                      name="phone" type="tel" placeholder="e.g. (555) 000-0000" value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))} 
                      required 
                      className="w-full rounded-lg h-12 border border-stone-200 bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm px-4 transition-all shadow-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">Email Address</label>
                    <input 
                      name="email" type="email" placeholder="e.g. jane@example.com" value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} 
                      required 
                      className="w-full rounded-lg h-12 border border-stone-200 bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm px-4 transition-all shadow-sm outline-none"
                    />
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-stone-100">
                    <button 
                      type="submit" 
                      disabled={submitting || !formData.name || !formData.phone || !formData.email}
                      className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 flex items-center justify-center active:scale-[0.98]"
                    >
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Appointment"}
                    </button>
                    <p className="text-center text-xs text-stone-400 mt-4 flex justify-center items-center gap-1">
                      🔒 Secure booking system
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* STEP 1: LANDING & SERVICE SELECTION */}
          
          {/* HERO SECTION */}
          <div className="relative bg-white border-b border-stone-200">
             <div className="absolute inset-0 z-0 h-[480px] md:h-[500px] overflow-hidden">
               <img src={business.coverImage || "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
             </div>
             
             <div className="relative z-10 max-w-[1240px] mx-auto px-6 h-[480px] md:h-[500px] flex flex-col justify-end pb-16 animate-in fade-in duration-500">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-3">
                 {business.name}
               </h1>
               <p className="text-lg md:text-xl text-stone-200 mb-8 max-w-xl">
                 {business.description || "The premium standard for grooming. Book your next confident look instantly."}
               </p>
               <div className="flex flex-col sm:flex-row gap-3">
                 <button onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 py-3 px-6 rounded-md font-medium transition-colors">
                   Book Appointment
                 </button>
                 <button onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white py-3 px-6 rounded-md font-medium transition-colors">
                   View Services
                 </button>
               </div>
             </div>
          </div>

          {/* SERVICES SECTION */}
          <SectionWrapper id="services-section" className="bg-stone-50">
             <div className="mb-10 sm:mb-12">
               <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-stone-900">Select a Service</h2>
               <p className="text-stone-500">Choose from our premium menu below.</p>
             </div>

             {/* TABS */}
             {categories.length > 1 && (
               <div className="flex flex-wrap gap-2 mb-10 border-b border-stone-200 pb-2">
                 {categories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setActiveTab(cat)}
                     className={`px-4 py-2 text-sm font-medium transition-all rounded-t-md ${
                       activeTab === cat 
                         ? "text-indigo-600 border-b-2 border-indigo-600" 
                         : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
             )}

             {/* CARD GRID */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredServices.map((service, idx) => {
                 const isRecommended = idx === 0 || service.name.toLowerCase().includes("premium"); 
                 
                 return (
                   <div 
                     key={service.id} 
                     className="group flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                   >
                     {isRecommended && (
                       <span className="absolute mt-3 ml-3 z-10 bg-indigo-600 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-opacity-90 backdrop-blur shadow-sm flex items-center gap-1">
                         <Star className="w-3 h-3 fill-white" /> Popular
                       </span>
                     )}
                     
                     <div className="relative h-44 overflow-hidden bg-stone-100">
                       <img src={service.imageUrl || getServiceImage(service.name)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                     </div>
                     
                     <div className="p-5 flex flex-col flex-grow">
                       <h3 className="text-lg font-bold text-stone-900 mb-1 leading-tight">{service.name}</h3>
                       
                       <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center text-sm text-stone-500">
                           <Clock className="w-4 h-4 mr-1.5" /> {service.duration} min
                         </div>
                         <div className="font-semibold text-stone-900 bg-stone-100 px-2 py-1 rounded-md text-sm">
                           {service.price ? `₹${service.price}` : "Free"}
                         </div>
                       </div>
                       
                       <div className="mt-auto">
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleServiceSelect(service); }}
                           className="w-full py-2.5 rounded-md font-medium transition-colors bg-stone-100 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-1 shadow-sm group-hover:bg-indigo-50"
                         >
                           Book Now
                         </button>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>
          </SectionWrapper>

          {/* TRUST SECTION */}
          <SectionWrapper className="bg-white border-t border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-stone-50 rounded-xl p-6 flex flex-col items-start gap-4">
                 <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                   <Star className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900">4.9/5 Average Rating</h4>
                   <p className="text-stone-500 text-sm mt-1">Loved by hundreds of satisfied clients.</p>
                 </div>
              </div>
              <div className="bg-stone-50 rounded-xl p-6 flex flex-col items-start gap-4">
                 <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                   <Award className="w-5 h-5 text-indigo-600" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900">Expert Stylists</h4>
                   <p className="text-stone-500 text-sm mt-1">Master professionals with years of experience.</p>
                 </div>
              </div>
              <div className="bg-stone-50 rounded-xl p-6 flex flex-col items-start gap-4">
                 <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                   <Scissors className="w-5 h-5 text-indigo-600" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-stone-900">Premium Tools</h4>
                   <p className="text-stone-500 text-sm mt-1">We use only top-tier grooming products.</p>
                 </div>
              </div>
            </div>
          </SectionWrapper>

          {/* CONTACT SECTION */}
          <SectionWrapper className="bg-white pt-0 pb-20">
             <div className="grid md:grid-cols-2 gap-6 border-t border-stone-100 pt-16">
               <div className="border border-stone-200 rounded-xl p-6 flex items-start gap-4 hover:border-indigo-200 transition-colors bg-white">
                 <div className="bg-stone-100 p-3 rounded-lg">
                   <Phone className="w-5 h-5 text-stone-700" />
                 </div>
                 <div>
                   <h5 className="font-medium text-stone-900 mb-1">Phone</h5>
                   <a href={`tel:${business.phone || '000000000'}`} className="text-stone-500 text-sm hover:text-indigo-600 transition-colors block mb-2">{business.phone || 'Contact number hidden'}</a>
                 </div>
               </div>
               
               <div className="border border-stone-200 rounded-xl p-6 flex items-start gap-4 hover:border-indigo-200 transition-colors bg-white">
                 <div className="bg-stone-100 p-3 rounded-lg">
                   <MapPin className="w-5 h-5 text-stone-700" />
                 </div>
                 <div>
                   <h5 className="font-medium text-stone-900 mb-1">Location</h5>
                   <p className="text-stone-500 text-sm line-clamp-1 mb-2">{business.address || 'Location hidden'}</p>
                   {business.address && (
                     <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-600">
                       Get Directions <ChevronRight className="w-3 h-3 inline pb-0.5" />
                     </a>
                   )}
                 </div>
               </div>
             </div>
          </SectionWrapper>

          {/* STICKY BOTTOM CTA ON MOBILE (ALWAYS VISIBLE) */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-stone-200 p-4 sm:hidden shadow-[0_-4px_15px_rgb(0,0,0,0.05)] pb-safe">
             <button onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-indigo-600 active:bg-indigo-700 text-white py-3.5 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2">
               Book Appointment
             </button>
          </div>
        </>
      )}

      {/* FOOTER */}
      {step === 1 && (
        <footer className="text-center py-8 text-stone-400 text-xs font-medium border-t border-stone-100">
          <p>© {new Date().getFullYear()} {business.name}. Powered by SalonOS.</p>
        </footer>
      )}
    </div>
  );
}

export default function BookingPageWrapper() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <BookingForm />
    </Suspense>
  );
}