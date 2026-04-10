"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, User, Phone, Calendar, CreditCard, Star, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddModal from "@/components/AddModal";
import { useAuth } from "@/components/AuthContext";
import { subscribeCustomers, createCustomer } from "@/lib/customers";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const { userData } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.businessId) return;
    const unsubscribe = subscribeCustomers(userData.businessId, (data: any[]) => {
      setCustomers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userData]);

  const filtered = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );
  }, [customers, search]);

  // Logic for "Top Clients" or "New Clients" summary
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-10">
      
      {/* 1. ELEGANT HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">Client Directory</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium italic">
            Building lasting relationships with your clientele
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-md border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-gray-300 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <AddModal
            title="Add New Client"
            triggerText={
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Client
              </div>
            }
            fields={[
              { name: "name", label: "Full Name", placeholder: "Enter name" },
              { name: "phone", label: "Phone", placeholder: "Enter phone" },
              { name: "notes", label: "Notes", placeholder: "Preferences, allergies, etc." },
            ]}
            onSubmit={async (data) => {
              if (userData?.businessId) await createCustomer(userData.businessId, data);
            }}
          />
        </div>
      </header>

      {/* 2. INSIGHT TABS (Optional but pro) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Total Clientele</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Customer Lifetime Value</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-gray-50 text-gray-900 p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Loyalty Program</p>
          <h3 className="text-xl font-serif italic mt-1">12 VIP Members</h3>
        </div>
      </div>

      {/* 3. CLIENT LIST */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white animate-pulse rounded-xl border border-gray-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500 font-serif italic">No clients found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((c) => (
              <CustomerCard key={c.id} customer={c} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function CustomerCard({ customer }: { customer: any }) {
  // Safe Date Formatting
  const lastVisit = useMemo(() => {
    if (!customer.lastVisit) return "New Client";
    const date = customer.lastVisit.seconds 
      ? new Date(customer.lastVisit.seconds * 1000) 
      : new Date(customer.lastVisit);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [customer.lastVisit]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
    >
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="text-gray-400 cursor-pointer hover:text-gray-900" />
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-500 group-hover:bg-gray-100 transition-colors">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-gray-900">{customer.name}</h3>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Phone className="w-3 h-3" /> {customer.phone}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Last Visit</span>
            <span className="text-gray-900 font-medium">{lastVisit}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center gap-2"><CreditCard className="w-3.5 h-3.5" /> Total Spent</span>
            <span className="text-gray-900 font-bold">₹{customer.totalSpent || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= (customer.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                {customer.totalVisits || 0} Visits
            </span>
        </div>
      </div>
    </motion.div>
  );
}