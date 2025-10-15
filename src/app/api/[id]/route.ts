import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await deleteDoc(doc(db, "tributes", params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tribute:", error);
    return NextResponse.json({ error: "Failed to delete tribute" }, { status: 500 });
  }
}
