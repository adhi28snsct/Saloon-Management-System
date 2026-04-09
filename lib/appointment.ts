import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { upsertCustomerFromAppointment } from "./customers";

// 🔥 Subscribe to appointments
export function subscribeAppointments(businessId: string, callback: any) {
  const q = query(
    collection(db, "appointments"),
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

// 🔥 Create appointment
export async function createAppointment(
  businessId: string,
  payload: any
) {
  const startTime = payload.time;
  const duration = Number(payload.duration || 30);

  const [h, m] = startTime.split(":").map(Number);

  const endDate = new Date();
  endDate.setHours(h);
  endDate.setMinutes(m + duration);

  const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(
    endDate.getMinutes()
  ).padStart(2, "0")}`;

  return addDoc(collection(db, "appointments"), {
    name: payload.name,
    phone: payload.phone,

    serviceId: payload.serviceId || "",

    date: payload.date,
    startTime,
    endTime,

    status: "BOOKED",
    price: Number(payload.price || 0),

    businessId,
    createdAt: new Date().toISOString(),
  });
}

// 🔥 Update appointment status
export async function updateAppointmentStatus(appointment: any, newStatus: string) {
  if (appointment.status !== "ACCEPTED" && newStatus === "ACCEPTED") {
    await upsertCustomerFromAppointment(appointment.businessId, appointment);
  }

  const aptRef = doc(db, "appointments", appointment.id);
  await updateDoc(aptRef, {
    status: newStatus
  });
}