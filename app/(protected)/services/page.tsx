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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ServicesUI from "@/components/Services";

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

  // 🔹 Add Service with Image Upload
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.businessId) return;

    if (!form.name || !form.price || !form.duration) {
      alert("Please fill all fields");
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

    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete
  const handleDelete = async (id: string) => {
    if (confirm("Delete this service?")) {
      await deleteDoc(doc(db, "services", id));
    }
  };

  return (
    <ServicesUI
      services={services}
      loading={loading}
      form={form}
      setForm={setForm}
      setImage={setImage}
      handleAdd={handleAdd}
      handleDelete={handleDelete}
    />
  );
}