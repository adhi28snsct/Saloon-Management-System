"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/* ================= CONFIG ================= */

const firebaseConfig = {
  apiKey: "AIzaSyAylC6aCf-3nbrDJT-u_MolSilrF2PFpF4",
  authDomain: "saloon-management-a5bd6.firebaseapp.com",
  projectId: "saloon-management-a5bd6",

  // 🔥 FIXED (VERY IMPORTANT)
  storageBucket: "saloon-management-a5bd6.firebasestorage.app",

  messagingSenderId: "158253808688",
  appId: "1:158253808688:web:63354fb4a408f89c46c1f5",
  measurementId: "G-K4KHK2NM82",
};

/* ================= INIT ================= */

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/* ================= AUTH ================= */

export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Auth persistence set to LOCAL");
  })
  .catch((err) => {
    console.error("❌ Persistence error:", err);
  });

/* ================= FIRESTORE ================= */

export const db = getFirestore(app);

/* ================= STORAGE ================= */

// 🔥 FORCE CORRECT BUCKET (IMPORTANT)
export const storage = getStorage(
  app,
  "gs://saloon-management-a5bd6.firebasestorage.app"
);