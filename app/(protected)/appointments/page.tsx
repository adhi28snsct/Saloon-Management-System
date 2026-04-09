"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Check, CheckCircle2, XCircle, Search, User, Phone, Clock, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddModal from "@/components/AddModal";
import { useAuth } from "@/components/AuthContext";
import { subscribeAppointments, createAppointment, updateAppointmentStatus } from "@/lib/appointment";

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const { userData } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!userData?.businessId) return;
    const unsubscribe = subscribeAppointments(userData.businessId, (data: any[]) => {
      setAppointments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userData]);

  const handleStatusChange = async (apt: any, newStatus: string) => {
    if (actionLoading[apt.id]) return;
    setActionLoading(prev => ({ ...prev, [apt.id]: true }));
    try {
      await updateAppointmentStatus(apt, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(prev => ({ ...prev, [apt.id]: false }));
    }
  };

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch = apt.name.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === "ALL" || apt.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [appointments, search, activeTab]);

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-200 pb-8">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 tracking-tight">Appointments</h1>
          <p className="text-stone-500 text-sm mt-1 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Manage your daily studio schedule
          </p>
        </div>

        <AddModal
          title="Create New Booking"
          triggerText={
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Booking
            </div>
          }
          fields={[
            { name: "name", label: "Client Name", placeholder: "e.g. Jane Doe" },
            { name: "phone", label: "Phone Number", placeholder: "e.g. +1 234..." },
            { name: "serviceId", label: "Service", placeholder: "Select service" },
            { name: "date", label: "Date", placeholder: "YYYY-MM-DD" },
            { name: "time", label: "Start Time", placeholder: "14:00" },
            { name: "duration", label: "Duration (Mins)", placeholder: "45" },
            { name: "price", label: "Price", placeholder: "50" },
          ]}
          onSubmit={async (data) => {
            if (userData?.businessId) await createAppointment(userData.businessId, data);
          }}
        />
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl border border-stone-100 shadow-sm">
        <div className="flex p-1 bg-stone-50 rounded-xl w-full lg:w-auto overflow-x-auto">
          {["ALL", "BOOKED", "ACCEPTED", "COMPLETED", "CANCELLED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeTab === tab 
                  ? "bg-white text-stone-900 shadow-sm" 
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
          <Input
            placeholder="Search client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-none bg-stone-50 focus-visible:ring-stone-200"
          />
        </div>
      </div>

      {/* LIST SECTION */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-stone-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
          <p className="text-stone-400 font-serif italic">No appointments found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((apt) => (
              <AppointmentCard 
                key={apt.id} 
                apt={apt} 
                isLoading={actionLoading[apt.id]} 
                onStatusChange={handleStatusChange} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// SUB-COMPONENT: REFINED APPOINTMENT CARD
function AppointmentCard({ apt, isLoading, onStatusChange }: any) {
  const status = apt.status || "BOOKED";
  
  const statusStyles: any = {
    BOOKED: "bg-amber-50 text-amber-700 border-amber-100",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    COMPLETED: "bg-stone-900 text-white border-stone-900",
    CANCELLED: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group bg-white border border-stone-100 p-6 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
    >
      <div className="flex gap-6">
        {/* Date Badge */}
        <div className="flex flex-col items-center justify-center bg-stone-50 w-20 h-20 rounded-2xl border border-stone-100">
          <span className="text-[10px] font-bold uppercase tracking-tighter text-stone-400">
            {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="text-2xl font-serif text-stone-800">
            {new Date(apt.date).getDate()}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-serif text-stone-900 leading-none">{apt.name}</h3>
            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${statusStyles[status]}`}>
              {status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-stone-500 text-sm">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {apt.phone}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.startTime} - {apt.endTime}</span>
            <span className="text-stone-900 font-semibold">${apt.price}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 self-center md:self-auto">
        {status === "BOOKED" && (
          <Button 
            variant="outline"
            className="rounded-full border-stone-200 hover:bg-emerald-50 hover:text-emerald-700"
            onClick={() => onStatusChange(apt, "ACCEPTED")}
            disabled={isLoading}
          >
            Confirm
          </Button>
        )}
        {status === "ACCEPTED" && (
          <Button 
            className="rounded-full bg-stone-900 text-white"
            onClick={() => onStatusChange(apt, "COMPLETED")}
            disabled={isLoading}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Done
          </Button>
        )}
        {status !== "CANCELLED" && status !== "COMPLETED" && (
          <Button 
            variant="ghost" 
            className="rounded-full text-stone-400 hover:text-red-600"
            onClick={() => onStatusChange(apt, "CANCELLED")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </motion.div>
  );
}