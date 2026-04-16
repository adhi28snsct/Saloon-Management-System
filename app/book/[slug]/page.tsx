"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Clock,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  User,
  Phone,
  Mail,
  ChevronRight,
  Calendar,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* --- UTILS --- */
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
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

const formatTime = (time: string) => {
  const [h, m] = time.split(":");
  const hours = parseInt(h);
  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${m} ${ampm}`;
};

const SkeletonLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf7]">
    <Loader2 className="w-8 h-8 text-stone-300 animate-spin" />
    <p className="mt-4 font-serif italic text-stone-400">Preparing your session...</p>
  </div>
);

function BookingForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params.slug as string;
  const serviceParam = searchParams.get("service");

  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  const [step, setStep] = useState(serviceParam ? 2 : 1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "businesses"), where("slug", "==", slug));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const doc = snap.docs[0];
        const biz = { id: doc.id, ...doc.data() };
        setBusiness(biz);

        const srvQ = query(collection(db, "services"), where("businessId", "==", biz.id), where("isActive", "==", true));
        const srvSnap = await getDocs(srvQ);
        const srvData = srvSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setServices(srvData);

        if (serviceParam) {
          const selected = srvData.find((s) => s.id === serviceParam);
          if (selected) setSelectedService(selected);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [slug, serviceParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !selectedService || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "appointments"), {
        ...formData,
        serviceName: selectedService.name,
        serviceId: selectedService.id,
        date: selectedDate.toISOString().split("T")[0],
        startTime: selectedTime,
        businessId: business.id,
        status: "BOOKED",
        createdAt: new Date(),
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <SkeletonLoader />;

  if (success) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center bg-[#fcfaf7] p-6">
        <div className="text-center bg-white p-12 rounded-[2.5rem] shadow-sm max-w-md w-full border border-stone-100">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-stone-800" size={40} />
          </div>
          <h2 className="text-3xl font-serif mb-2">Reservation Confirmed</h2>
          <p className="text-stone-500 mb-8 font-light leading-relaxed">We have reserved your time at {business.name}. A confirmation email has been sent.</p>
          <button onClick={() => router.push(`/saloon/${slug}`)} className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-stone-800 transition-all">
            Return to Studio
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-stone-900 antialiased font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT: MAIN FLOW */}
        <div className="flex-1 p-6 md:p-12 lg:p-20 border-r border-stone-100 bg-white/50">
          <header className="flex items-center justify-between mb-12">
            <button 
              onClick={() => step === 1 ? router.back() : setStep(step - 1)}
              className="group flex items-center gap-2 text-stone-400 hover:text-black transition-colors"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Back</span>
            </button>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`h-1 w-8 rounded-full transition-colors ${s <= step ? 'bg-black' : 'bg-stone-200'}`} />
              ))}
            </div>
          </header>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-4xl font-serif mb-8">Select Treatment</h2>
                <div className="space-y-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => { setSelectedService(service); setStep(2); }}
                      className="w-full text-left p-6 rounded-2xl border border-stone-200 hover:border-black hover:bg-white transition-all group flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-xl font-serif mb-1">{service.name}</h3>
                        <p className="text-stone-400 text-xs uppercase tracking-widest">{service.duration} mins • ₹{service.price}</p>
                      </div>
                      <ChevronRight size={20} className="text-stone-300 group-hover:text-black transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-4xl font-serif mb-8">Choose Date</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {getUpcomingDays().map((d, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedDate(d); setStep(3); }}
                      className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                        selectedDate?.toDateString() === d.toDateString() 
                        ? 'bg-black border-black text-white shadow-lg' 
                        : 'bg-white border-stone-100 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-tighter opacity-60 font-bold">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-xl font-serif">{d.getDate()}</span>
                      <span className="text-[9px] uppercase tracking-tighter opacity-60 font-bold">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-4xl font-serif mb-8">Preferred Time</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setSelectedTime(t); setStep(4); }}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                        selectedTime === t 
                        ? 'bg-black border-black text-white shadow-lg' 
                        : 'bg-white border-stone-100 hover:border-stone-300'
                      }`}
                    >
                      {formatTime(t)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.form key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-4xl font-serif mb-8">Final Details</h2>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input required placeholder="Full Name" className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-200 focus:border-black outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input required placeholder="Mobile Number" className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-200 focus:border-black outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input required type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-200 focus:border-black outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <button 
                  disabled={submitting}
                  className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 hover:bg-stone-800 disabled:bg-stone-300 transition-all"
                >
                  {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Complete Reservation"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: SUMMARY (Visible on desktop) */}
        <div className="lg:w-[400px] p-6 md:p-12 lg:p-20 bg-[#f8f6f2]">
          <div className="sticky top-20">
            <h3 className="text-stone-400 text-[10px] uppercase tracking-[0.4em] font-bold mb-8">Summary</h3>
            <div className="space-y-8">
              <div className="space-y-1">
                <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">Studio</p>
                <p className="text-xl font-serif italic">{business.name}</p>
              </div>

              {selectedService && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                  <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">Treatment</p>
                  <p className="text-xl font-serif">{selectedService.name}</p>
                  <p className="text-sm text-stone-500">{selectedService.duration} mins • ₹{selectedService.price}</p>
                </motion.div>
              )}

              {(selectedDate || selectedTime) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4 border-t border-stone-200">
                  {selectedDate && (
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-stone-400" />
                      <span className="text-sm font-medium">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-stone-400" />
                      <span className="text-sm font-medium">{formatTime(selectedTime)}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {!selectedService && (
                <p className="text-stone-400 italic text-sm font-light">Please select a service to begin your journey.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <BookingForm />
    </Suspense>
  );
}