"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Search, 
  Phone, 
  Clock, 
  Plus, 
  ChevronRight,
  MoreVertical,
  CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddModal from "@/components/AddModal";
import { useAuth } from "@/components/AuthContext";
import { subscribeAppointments, createAppointment, updateAppointmentStatus } from "@/lib/appointment";
import { Badge } from "@/components/ui/badge";

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
    <div className="max-w-[1100px] mx-auto space-y-10 p-4 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif tracking-tight text-[#111827]">Appointments</h1>
          <p className="text-[#6b7280] text-sm font-medium flex items-center gap-2 italic">
            <CalendarIcon className="h-4 w-4" />
            Manage and monitor your studio schedule
          </p>
        </div>

        <AddModal
          title="Create New Booking"
          triggerText={
            <Button className="bg-[#111111] hover:bg-[#111827] text-white shadow-sm rounded-lg px-6 active:scale-95 transition-all">
              <Plus className="w-4 h-4 mr-2" strokeWidth={2} /> New Booking
            </Button>
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

      {/* --- CONTROLS: TABS & SEARCH --- */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <nav className="flex p-1.5 bg-[#f8f6f2] rounded-xl w-full lg:w-auto border border-[#e5e7eb]">
          {["ALL", "BOOKED", "ACCEPTED", "COMPLETED", "CANCELLED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                activeTab === tab 
                  ? "bg-white text-[#111827] shadow-sm border border-[#e5e7eb]" 
                  : "text-[#6b7280] hover:text-[#111827] hover:bg-white/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="relative w-full lg:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280] transition-colors" />
          <Input
            placeholder="Search by client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 rounded-lg border-[#e5e7eb] bg-white focus-visible:ring-[#e5e7eb] text-[#111827] placeholder:text-[#6b7280] shadow-sm"
          />
        </div>
      </div>

      {/* --- APPOINTMENTS LIST --- */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-bold">No appointments found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
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

function AppointmentCard({ apt, isLoading, onStatusChange }: any) {
  const status = apt.status || "BOOKED";
  
  const statusConfig: any = {
    BOOKED: { color: "bg-[#f8f6f2] text-[#6b7280] border-[#e5e7eb]", label: "Pending" },
    ACCEPTED: { color: "bg-black text-white border-black", label: "Confirmed" },
    COMPLETED: { color: "bg-white text-[#111827] border-[#e5e7eb]", label: "Finished" },
    CANCELLED: { color: "bg-red-50 text-red-600 border-red-100", label: "Cancelled" },
  };

  const dateObj = new Date(apt.date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white border border-[#e5e7eb] p-6 rounded-2xl shadow-sm hover:shadow-md hover:bg-[#f1efe9]/50 transition-all duration-200 flex flex-col md:flex-row items-center gap-6"
    >
      {/* Date & Time Column */}
      <div className="flex flex-row md:flex-col items-center justify-center md:border-r border-[#e5e7eb] pr-0 md:pr-8 min-w-[100px]">
        <span className="text-[10px] font-bold uppercase text-[#6b7280] tracking-widest">
          {dateObj.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-3xl font-serif text-[#111827] mx-2 md:mx-0 py-1">
          {dateObj.getDate()}
        </span>
        <Badge variant="outline" className="mt-1 bg-[#f8f6f2] border-[#e5e7eb] text-[#6b7280] font-medium text-[10px] px-2 py-0.5">
          {apt.startTime}
        </Badge>
      </div>

      {/* Main Info */}
      <div className="flex-1 flex flex-col md:flex-row justify-between w-full gap-4 pl-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-serif text-[#111827] leading-none">{apt.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest border font-bold ${statusConfig[status].color}`}>
              {statusConfig[status].label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#6b7280] text-sm font-medium">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {apt.phone}</span>
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] mt-0.5">
               {apt.serviceName || "Studio Service"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none border-[#e5e7eb] pt-4 md:pt-0">
          <div className="text-right">
            <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Amount</p>
            <p className="text-xl font-serif text-[#111827]">₹{apt.price}</p>
          </div>

          <div className="flex items-center gap-2">
            {status === "BOOKED" && (
              <Button 
                size="sm"
                variant="outline"
                className="border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white font-medium px-4 rounded-lg"
                onClick={() => onStatusChange(apt, "ACCEPTED")}
                disabled={isLoading}
              >
                Accept
              </Button>
            )}
            {status === "ACCEPTED" && (
              <Button 
                size="sm"
                className="bg-[#111111] text-white hover:bg-[#111827] font-medium px-4 rounded-lg shadow-sm"
                onClick={() => onStatusChange(apt, "COMPLETED")}
                disabled={isLoading}
              >
                Complete
              </Button>
            )}
            {status !== "CANCELLED" && status !== "COMPLETED" && (
              <Button 
                size="icon"
                variant="ghost" 
                className="text-[#6b7280] hover:text-red-600 hover:bg-red-50 rounded-lg"
                onClick={() => onStatusChange(apt, "CANCELLED")}
                disabled={isLoading}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}