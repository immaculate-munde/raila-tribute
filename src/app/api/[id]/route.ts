import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin only once
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

// GET tribute by ID
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  if (!id) return NextResponse.json({ error: "Missing tribute ID" }, { status: 400 });

  try {
    const docRef = db.collection("tributes").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Tribute not found" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (err: unknown) {
    console.error("GET error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// PATCH tribute by ID
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  if (!id) return NextResponse.json({ error: "Missing tribute ID" }, { status: 400 });

  try {
    const body = await req.json();
    const { message } = body as { message?: string };

    if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });

    const docRef = db.collection("tributes").doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Tribute not found" }, { status: 404 });

    await docRef.update({ message });
    return NextResponse.json({ success: true, message: "Tribute updated successfully" });
  } catch (err: unknown) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE tribute by ID
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  if (!id) return NextResponse.json({ error: "Missing tribute ID" }, { status: 400 });

  try {
    const docRef = db.collection("tributes").doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return NextResponse.json({ error: "Tribute not found" }, { status: 404 });

    const data = docSnap.data();
    await docRef.delete();

    // Delete associated image if exists
    if (data?.photoUrl) {
      try {
        const bucket = storage.bucket();
        const filePath = decodeURIComponent(data.photoUrl.split("/o/")[1].split("?")[0]);
        await bucket.file(filePath).delete({ ignoreNotFound: true });
      } catch (err) {
        console.warn("Image deletion warning:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Tribute deleted successfully" });
  } catch (err: unknown) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
