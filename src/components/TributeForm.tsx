// components/TributeForm.tsx
'use client';
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function TributeForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = "";
      if (file) {
        const storageRef = ref(storage, `tributes/${Date.now()}_${file.name}`);
        const snap = await uploadBytes(storageRef, file);
        photoUrl = await getDownloadURL(snap.ref);
      }

      await addDoc(collection(db, "tributes"), {
        name: name || "Anonymous",
        message,
        photoUrl,
        createdAt: serverTimestamp(),
      });

      setName(""); setMessage(""); setFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit tribute.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#07101a]/50 p-4 rounded-lg space-y-3 border border-[#7a5f3f]">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name (optional)" className="w-full p-2 rounded bg-transparent border border-[#5f4b35]" />
      <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write your tribute..." required className="w-full p-2 rounded bg-transparent border border-[#5f4b35]" />
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
      <div className="flex gap-2">
        <button disabled={loading} className="px-4 py-2 rounded bg-gold text-royal font-semibold disabled:opacity-60">Send Tribute</button>
        <span className="text-sm self-center text-[#dcd2c3]">{loading && "Sending..."}</span>
      </div>
    </form>
  );
}
