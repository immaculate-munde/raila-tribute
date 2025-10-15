import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "tributes"));
    const tributes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(tributes);
  } catch (error) {
    console.error("Error fetching tributes:", error);
    return NextResponse.json({ error: "Failed to fetch tributes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await addDoc(collection(db, "tributes"), {
      name: body.name,
      message: body.message,
      date: new Date().toLocaleString(),
      timestamp: serverTimestamp(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding tribute:", error);
    return NextResponse.json({ error: "Failed to add tribute" }, { status: 500 });
  }
}
