import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";

admin.initializeApp();

/* =========================================================
   🔧 HELPER
========================================================= */
const sendMail = async (to: string, subject: string, html: string) => {
  if (!to) return;

  return admin.firestore().collection("mail").add({
    to,
    message: { subject, html },
  });
};

/* =========================================================
   🚀 BOOKING CREATED
========================================================= */
export const onBookingCreateSendEmail = onDocumentCreated(
  {
    document: "appointments/{id}",
    region: "asia-south1",
  },
  async (event) => {
    if (!event.data) return;

    const data = event.data.data();

    try {
      let ownerEmail = data.ownerEmail;

      if (!ownerEmail && data.businessId) {
        const businessDoc = await admin
          .firestore()
          .collection("businesses")
          .doc(data.businessId)
          .get();

        ownerEmail = businessDoc.data()?.email;
      }

      // OWNER
      await sendMail(
        ownerEmail,
        "🔥 New Booking Received",
        `
        <div style="font-family: Arial;">
          <h2>New Booking 🚀</h2>
          <p><b>Customer:</b> ${data.name}</p>
          <p><b>Service:</b> ${data.serviceName}</p>
          <p><b>Date:</b> ${data.date}</p>
          <p><b>Time:</b> ${data.startTime}</p>
        </div>
        `
      );

      // CLIENT
      if (data.email) {
        await sendMail(
          data.email,
          "Booking Confirmed 💇‍♂️",
          `
          <div style="font-family: Arial;">
            <h2>Booking Confirmed</h2>
            <p>Service: ${data.serviceName}</p>
            <p>Date: ${data.date}</p>
            <p>Time: ${data.startTime}</p>
          </div>
          `
        );
      }

      console.log("✅ Booking emails sent");
    } catch (err) {
      console.error(err);
    }
  }
);

/* =========================================================
   ⏰ REMINDER
========================================================= */
export const sendReminderEmails = onSchedule(
  {
    schedule: "every 5 minutes",
    region: "asia-south1",
  },
  async () => {
    const now = new Date();
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

        if (data.reminderSent) continue;

        let ownerEmail = data.ownerEmail;

        if (!ownerEmail && data.businessId) {
          const businessDoc = await admin
            .firestore()
            .collection("businesses")
            .doc(data.businessId)
            .get();

          ownerEmail = businessDoc.data()?.email;
        }

        // OWNER
        await sendMail(
          ownerEmail,
          "⏰ Appointment in 30 Minutes",
          `
          <div style="font-family: Arial;">
            <h2>Reminder ⏰</h2>
            <p>Customer: ${data.name}</p>
            <p>Service: ${data.serviceName}</p>
            <p>Time: ${data.startTime}</p>
          </div>
          `
        );

        // CLIENT
        if (data.email) {
          await sendMail(
            data.email,
            "⏰ Your Appointment Reminder",
            `
            <div style="font-family: Arial;">
              <h2>Reminder ⏰</h2>
              <p>Service: ${data.serviceName}</p>
              <p>Time: ${data.startTime}</p>
            </div>
            `
          );
        }

        await doc.ref.update({
          reminderSent: true,
        });
      }

      console.log("✅ Reminder done");
    } catch (err) {
      console.error(err);
    }
  }
);
