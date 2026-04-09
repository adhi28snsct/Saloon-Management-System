"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

import DashboardUI from "@/components/Dashboard";
import ProfileModal from "@/components/ProfileModal";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, userData } = useAuth();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [followUpsCount, setFollowUpsCount] = useState(0);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!user || !userData?.businessId) return;

    // 🔹 Appointments
    const aptQ = query(
      collection(db, "appointments"),
      where("businessId", "==", userData.businessId)
    );

    const unsubApt = onSnapshot(aptQ, (snap) => {
      const data: any[] = [];
      snap.forEach((doc) =>
        data.push({ id: doc.id, ...doc.data() })
      );
      setAppointments(data);
    });

    // 🔹 Customers
    const custQ = query(
      collection(db, "customers"),
      where("businessId", "==", userData.businessId)
    );

    const unsubCust = onSnapshot(custQ, (snap) => {
      setCustomersCount(snap.size);
    });

    // 🔹 FollowUps
    const followQ = query(
      collection(db, "followUps"),
      where("businessId", "==", userData.businessId),
      where("status", "==", "Pending")
    );

    const unsubFollow = onSnapshot(followQ, (snap) => {
      setFollowUpsCount(snap.size);
    });

    return () => {
      unsubApt();
      unsubCust();
      unsubFollow();
    };
  }, [user, userData]);

  /* ================= SEARCH ================= */

  const filteredAppointments = appointments.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= REVENUE ================= */

  const totalRevenue = filteredAppointments.reduce((sum, apt) => {
    const amount = parseInt(
      String(apt.price || "0").replace(/[^0-9]/g, "")
    );
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  /* ================= TODAY (FIXED) ================= */

  const todayStr = new Date().toLocaleDateString("en-CA");

  const todaysAppointments = filteredAppointments.filter((a) => {
    if (!a.date) return false;

    // ✅ If stored as string
    if (typeof a.date === "string") {
      return a.date === todayStr;
    }

    // ✅ If Firestore Timestamp
    if (a.date?.seconds) {
      const d = new Date(a.date.seconds * 1000)
        .toLocaleDateString("en-CA");
      return d === todayStr;
    }

    return false;
  });

  /* ================= UI ================= */

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 pt-4">
        <h1 className="text-xl font-bold">Dashboard</h1>

        <Button onClick={() => setProfileOpen(true)}>
          Edit Profile
        </Button>
      </div>

      {/* MAIN */}
      <DashboardUI
        totalRevenue={totalRevenue}
        appointments={filteredAppointments}
        customersCount={customersCount}
        followUpsCount={followUpsCount}
        todaysAppointments={todaysAppointments}
        search={search}
        setSearch={setSearch}
      />

      {/* PROFILE MODAL */}
      <ProfileModal
  open={profileOpen}
  onOpenChange={setProfileOpen}
  business={{
    id: user?.uid, // ✅ FIXED (VERY IMPORTANT)
    name: userData?.name || "",
    description: userData?.description || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    coverImage: userData?.coverImage || "",
    email: userData?.email || "", // ✅ ADD THIS
  }}
/>
    </div>
  );
}