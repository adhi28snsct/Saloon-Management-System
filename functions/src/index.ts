import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";

admin.initializeApp();

/* =========================================================
   🚀 1. BOOKING CREATED → SEND EMAIL
========================================================= */
export const onBookingCreateSendEmail = onDocumentCreated(
  {
    document: "appointments/{id}",
    region: "asia-south1",
  },
  async (event) => {
    if (!event.data) {
      console.log("No data");
      return;
    }

    const data = event.data.data();

    try {
      await admin.firestore().collection("mail").add({
        to: data.ownerEmail,
        message: {
          subject: "🔥 New Booking Received",
          html: `...`,
        },
      });

      if (data.email) {
        await admin.firestore().collection("mail").add({
          to: data.email,
          message: {
            subject: "Booking Confirmed 💇‍♂️",
            html: `...`,
          },
        });
      }

      console.log("✅ Booking emails queued");
    } catch (error) {
      console.error("❌ Error sending booking email:", error);
    }
  }
);

/* =========================================================
   ⏰ 2. REMINDER (30 MIN BEFORE)
========================================================= */
export const sendReminderEmails = onSchedule(
  {
    schedule: "every 5 minutes",
    region: "asia-south1",
  },
  async () => {
    const now = new Date();

    // ⏰ 30 mins later
    const target = new Date(now.getTime() + 30 * 60000);

    const date = target.toISOString().split("T")[0];
    const time = target.toTimeString().slice(0, 5);

    try {
      const snapshot = await admin
        .firestore()
        .collection("appointments")
        .where("date", "==", date)
        .where("startTime", "==", time)
        .where("status", "==", "BOOKED")
        .get();

      for (const doc of snapshot.docs) {
        const data = doc.data();

        // 🚫 prevent duplicate reminder
        if (data.reminderSent) continue;

        // 🔥 SEND REMINDER EMAIL TO OWNER
        await admin.firestore().collection("mail").add({
          to: data.ownerEmail,
          message: {
            subject: "⏰ Appointment in 30 Minutes",
            html: `
              <div style="font-family: Arial; max-width: 500px; margin: auto;">
                <h2 style="color:#f59e0b;">Reminder ⏰</h2>

                <p>You have an appointment in 30 minutes</p>

                <div style="background:#f3f4f6; padding:15px; border-radius:8px;">
                  <p><b>Customer:</b> ${data.name}</p>
                  <p><b>Service:</b> ${data.serviceName}</p>
                  <p><b>Time:</b> ${data.startTime}</p>
                </div>

                <p style="margin-top:20px;">Be ready to serve your client 💇‍♂️</p>
              </div>
            `,
          },
        });

        // ✅ mark as sent
        await doc.ref.update({
          reminderSent: true,
        });
      }

      console.log("✅ Reminder check complete");
    } catch (error) {
      console.error("❌ Reminder error:", error);
    }
  }
);