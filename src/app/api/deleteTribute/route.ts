import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// 🔐 Initialize Firebase Admin only once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  });
}

const db = getFirestore();
const storage = getStorage();

// ✅ DELETE tribute (admin only)
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, photoUrl, authKey } = body;

    // Basic admin protection (temporary)
    if (authKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing tribute ID" }, { status: 400 });
    }

    // 🗑️ Delete Firestore doc
    await db.collection("tributes").doc(id).delete();

    // 🖼️ Delete image if exists
    if (photoUrl) {
      try {
        const bucket = storage.bucket();
        const filePath = decodeURIComponent(photoUrl.split("/o/")[1].split("?")[0]);
        await bucket.file(filePath).delete({ ignoreNotFound: true });
      } catch (err) {
        console.warn("Image delete warning:", err);
      }
    }

    return NextResponse.json({ message: "✅ Tribute deleted successfully" });
  } catch (error: any) {
    console.error("❌ Delete failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
