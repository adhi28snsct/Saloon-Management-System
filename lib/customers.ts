import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// 🔥 Subscribe customers
export function subscribeCustomers(businessId: string, callback: any) {
  const q = query(
    collection(db, "customers"),
    where("businessId", "==", businessId)
  );

  return onSnapshot(q, (snapshot) => {
    const data: any[] = [];

    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    data.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    callback(data);
  });
}

// 🔥 Create customer manually
export async function createCustomer(businessId: string, data: any) {
  return addDoc(collection(db, "customers"), {
    name: data.name,
    phone: data.phone,
    notes: data.notes || "",

    lastVisit: null,
    totalVisits: 0,
    totalSpent: 0,

    businessId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// 🔥 Create OR Update from appointment
export async function upsertCustomerFromAppointment(
  businessId: string,
  data: any
) {
  if (!data.phone) return;

  const customersRef = collection(db, "customers");

  const q = query(
    customersRef,
    where("businessId", "==", businessId),
    where("phone", "==", data.phone)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    const existingDoc = snap.docs[0];

    await updateDoc(doc(db, "customers", existingDoc.id), {
      lastVisit: serverTimestamp(),
      totalVisits: increment(1),
      updatedAt: serverTimestamp(),
    });

    return;
  }

  await addDoc(customersRef, {
    name: data.name,
    phone: data.phone,
    notes: "Added via appointment",

    lastVisit: serverTimestamp(),
    totalVisits: 1,

    businessId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}