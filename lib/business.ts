import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createBusiness(user: any) {
  const businessRef = doc(db, "businesses", user.uid);

  const baseName =
    user.displayName || user.email?.split("@")[0] || "salon";

  const slugBase = generateSlug(baseName);
  const uniqueSuffix = Math.random().toString(36).substring(2, 6);

  const finalSlug = `${slugBase}-${uniqueSuffix}`;

  await setDoc(businessRef, {
    id: user.uid,
    name: baseName,
    slug: finalSlug,

    ownerId: user.uid,
    plan: "FREE",
    isActive: true,

    createdAt: new Date().toISOString(),
  });
}