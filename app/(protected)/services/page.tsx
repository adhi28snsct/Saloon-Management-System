"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ServicesUI from "@/components/Services";
import { toast } from "sonner";

export default function ServicesPage() {
  const { userData } = useAuth();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [slug, setSlug] = useState("");

  // 🔹 Fetch business slug
  useEffect(() => {
    const fetchBusiness = async () => {
      if (!userData?.businessId) return;

      const docRef = doc(db, "businesses", userData.businessId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setSlug(snap.data().slug);
      }
    };

    fetchBusiness();
  }, [userData]);

  // 🔹 Realtime services
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
      setServices(data.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  // 🔹 Public link
  const publicLink =
    typeof window !== "undefined" && slug
      ? `${window.location.origin}/saloon/${slug}`
      : "";

  // 🔹 Add Service
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.businessId) return;

    if (!form.name || !form.price || !form.duration) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      let imageUrl = "";

      if (image) {
        const storageRef = ref(
          storage,
          `services/${userData.businessId}/${Date.now()}-${image.name}`
        );

        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "services"), {
        name: form.name,
        price: Number(form.price),
        duration: Number(form.duration),
        image: imageUrl,
        businessId: userData.businessId,
        isActive: true,
        createdAt: new Date().getTime(),
      });

      setForm({ name: "", price: "", duration: "" });
      setImage(null);

      toast.success("Service added successfully 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add service");
    }
  };

  // 🔥 DELETE WITH TOAST CONFIRM
  const handleDelete = (id: string) => {
    toast("Delete this service?", {
      description: "This action cannot be undone",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteDoc(doc(db, "services", id));
            toast.success("Service deleted");
          } catch (err) {
            toast.error("Failed to delete service");
          }
        },
      },
    });
  };

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 PUBLIC LINK UI */}
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-600">
          Your Public Booking Page
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <p className="text-sm text-gray-800 break-all">
            {publicLink || "Loading..."}
          </p>

          <div className="flex gap-2 flex-wrap">

            {/* Copy */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicLink);
                toast.success("Link copied!");
              }}
              className="px-3 py-2 text-xs bg-black text-white rounded-md hover:bg-gray-800"
            >
              Copy
            </button>

            {/* Open */}
            <button
              onClick={() => window.open(publicLink, "_blank")}
              className="px-3 py-2 text-xs border rounded-md hover:bg-gray-100"
            >
              Open
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => {
                const msg = `Book your appointment here: ${publicLink}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
              }}
              className="px-3 py-2 text-xs border rounded-md hover:bg-gray-100"
            >
              WhatsApp
            </button>

          </div>
        </div>
      </div>

      {/* 🔹 EXISTING UI */}
      <ServicesUI
        services={services}
        loading={loading}
        form={form}
        setForm={setForm}
        setImage={setImage}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
      />
    </div>
  );
}