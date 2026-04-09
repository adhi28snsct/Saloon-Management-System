import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// 🔥 Create or get user
export async function createOrGetUser(user: any) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // ✅ Create user
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "Owner",
      email: user.email,

      role: "OWNER",              // 🔥 IMPORTANT
      businessId: user.uid,       // 1:1 for now

      createdAt: new Date().toISOString(),
    });

    return { isNewUser: true };
  }

  return { isNewUser: false };
}