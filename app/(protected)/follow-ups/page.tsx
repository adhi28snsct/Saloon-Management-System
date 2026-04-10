"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Plus, 
  User as UserIcon, // Renamed to avoid name collisions
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc 
} from "firebase/firestore";
import AddModal from "@/components/AddModal";

// 1. DEFINING THE TYPE (Fixes "Property 'date' does not exist" error)
interface FollowUp {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  action: string;
  status: string;
  businessId: string;
  createdAt: string;
  isDueToday: boolean;
  isOverdue: boolean;
}

export default function FollowUpsPage() {
  const [search, setSearch] = useState("");
  const { user, userData } = useAuth();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. NULL GUARD (Fixes "userData is possibly null" error)
    if (!user || !userData?.businessId) return;

    const q = query(
      collection(db, "followUps"),
      where("businessId", "==", userData.businessId),
      where("status", "==", "Pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const today = new Date().toISOString().split("T")[0];
      
      const data = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          ...d,
          isDueToday: d.date === today,
          isOverdue: d.date < today,
        } as FollowUp;
      });

      // 3. SORTING LOGIC (Now type-safe)
      data.sort((a, b) => {
        if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
        if (a.isDueToday !== b.isDueToday) return a.isDueToday ? -1 : 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      setFollowUps(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userData?.businessId]);

  const filtered = useMemo(() => {
    return followUps.filter(f => 
      f.name?.toLowerCase().includes(search.toLowerCase()) || 
      f.phone?.includes(search)
    );
  }, [followUps, search]);

  const handleComplete = async (id: string) => {
    try {
      await updateDoc(doc(db, "followUps", id), { status: "Completed" });
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 md:px-8">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">Client Retention</h1>
          <p className="text-gray-500 text-sm mt-1 italic font-medium">Outreach for your valued guests</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-md border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-gray-300 text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>
          
          <AddModal
            title="Schedule Follow-up"
            // FIX: triggerText prop must accept ReactNode in AddModal.tsx
            triggerText={
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Task
              </div>
            }
            fields={[
              { name: "name", label: "Client Name", placeholder: "Enter name" },
              { name: "phone", label: "Phone", placeholder: "Enter phone" },
              { name: "service", label: "Previous Service", placeholder: "Hair Coloring" },
              { name: "date", label: "Reminder Date", placeholder: "YYYY-MM-DD" },
              { name: "action", label: "Goal", placeholder: "Call / Offer / Feedback" },
            ]}
            onSubmit={async (data) => {
              if (userData?.businessId) {
                await addDoc(collection(db, "followUps"), {
                  ...data,
                  status: "Pending",
                  businessId: userData.businessId,
                  createdAt: new Date().toISOString(),
                });
              }
            }}
          />
        </div>
      </header>

      {/* LIST SECTION */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white border border-gray-100 animate-pulse rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
             <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-500 font-serif italic text-lg">Your outreach is all caught up.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <FollowUpCard key={item.id} item={item} onComplete={handleComplete} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// 4. FOLLOW-UP CARD COMPONENT
function FollowUpCard({ item, onComplete }: { item: FollowUp, onComplete: (id: string) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`group flex flex-col md:flex-row items-center p-5 rounded-xl transition-all duration-200 gap-6 hover:shadow-md shadow-sm border ${
        item.isOverdue ? "bg-red-50 border-red-100" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex-1 flex items-center gap-5">
        <div className={`h-14 w-14 flex items-center justify-center rounded-lg transition-colors border ${
          item.isOverdue ? "bg-red-100 text-red-500 border-red-200" : "bg-gray-50 text-gray-500 border-gray-100 group-hover:bg-gray-100 group-hover:text-gray-700"
        }`}>
          {/* FIX: Using UserIcon to solve "Cannot find name User" */}
          {item.isOverdue ? <AlertCircle className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="font-serif text-lg text-gray-900 leading-tight">{item.name}</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Re: {item.service}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a href={`tel:${item.phone}`}>
          <Button size="icon" variant="ghost" className="rounded-md w-10 h-10 border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
            <Phone className="w-4 h-4" />
          </Button>
        </a>
        <a href={`https://wa.me/${item.phone}`} target="_blank" rel="noreferrer">
          <Button size="icon" variant="ghost" className="rounded-md w-10 h-10 border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
            <MessageSquare className="w-4 h-4" />
          </Button>
        </a>
        <button
          onClick={() => onComplete(item.id)}
          className="ml-2 w-10 h-10 rounded-md flex items-center justify-center border border-gray-200 text-gray-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all bg-white shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}