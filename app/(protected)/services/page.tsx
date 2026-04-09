"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
  const { userData } = useAuth();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
  });

  // 🔹 Subscribe Services (Realtime)
  useEffect(() => {
    if (!userData?.businessId) return;

    const q = query(
      collection(db, "services"),
      where("businessId", "==", userData.businessId)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data: any[] = [];
      snap.forEach((doc) =>
        data.push({ id: doc.id, ...doc.data() })
      );
      setServices(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  // 🔹 Add Service
  const handleAdd = async () => {
    if (!userData?.businessId) return;

    if (!form.name || !form.price || !form.duration) {
      alert("Fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "services"), {
        name: form.name,
        price: Number(form.price),
        duration: Number(form.duration),

        businessId: userData.businessId,
        isActive: true,
        createdAt: new Date(),
      });

      // reset form
      setForm({
        name: "",
        price: "",
        duration: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete Service
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "services", id));
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold">Services</h1>
        <p className="text-sm text-gray-500">
          Manage your salon services
        </p>
      </div>

      {/* Add Service */}
      <div className="bg-white p-4 rounded-lg border space-y-3 max-w-md">
        <h2 className="font-medium">Add New Service</h2>

        <Input
          placeholder="Service Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Input
          placeholder="Price (₹)"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <Input
          placeholder="Duration (minutes)"
          type="number"
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: e.target.value })
          }
        />

        <Button onClick={handleAdd} className="w-full">
          Add Service
        </Button>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        <h2 className="font-medium">Your Services</h2>

        {loading ? (
          <p>Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-500">No services added yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div
                key={s.id}
                className="p-4 border rounded-lg bg-white flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{s.price} • {s.duration} mins
                  </p>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}