"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

interface Tribute {
  id: string;
  name: string;
  message: string;
  photoUrl?: string;
  date: string;
}

// Safe timestamp formatting
const formatDate = (date?: Timestamp | { seconds: number } | string): string => {
  if (!date) return "Just now";
  if (date instanceof Timestamp) return date.toDate().toLocaleString();
  if (typeof date === "object" && "seconds" in date)
    return new Date(date.seconds * 1000).toLocaleString();
  return String(date);
};

export default function TributesPage() {
  // Tributes state
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState("");

  // Load tributes from Firestore
  useEffect(() => {
    const q = query(collection(db, "tributes"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const loaded: Tribute[] = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: typeof data.name === "string" ? data.name : "Anonymous",
          message: typeof data.message === "string" ? data.message : "",
          photoUrl: typeof data.photoUrl === "string" ? data.photoUrl : undefined,
          date: formatDate(data.date),
        };
      });
      setTributes(loaded);
    });

    return () => unsub();
  }, []);

  // Handle photo selection
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Submit new tribute
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !message) return alert("Please fill in all fields.");
    setLoading(true);

    try {
      let photoUrl = "";
      if (photo) {
        const photoRef = ref(storage, `tributes/${photo.name}-${Date.now()}`);
        await uploadBytes(photoRef, photo);
        photoUrl = await getDownloadURL(photoRef);
      }

      await addDoc(collection(db, "tributes"), {
        name,
        message,
        photoUrl,
        date: serverTimestamp(),
      });

      setName("");
      setMessage("");
      setPhoto(null);
      setPreview(null);
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit tribute
  const startEdit = (id: string, currentMessage: string) => {
    setEditingId(id);
    setEditingMessage(currentMessage);
  };

  const handleUpdate = async () => {
    if (!editingId || !editingMessage) return;
    setLoading(true);
    try {
      const docRef = doc(db, "tributes", editingId);
      await updateDoc(docRef, { message: editingMessage });
      setEditingId(null);
      setEditingMessage("");
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete tribute
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tribute?")) return;
    setLoading(true);
    try {
      const docRef = doc(db, "tributes", id);
      await deleteDoc(docRef);
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-yellow-50">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-10">
        Tributes 💛
      </h1>

      {/* Tribute Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-blue-950 to-blue-800 border border-yellow-500 rounded-3xl p-6 shadow-2xl max-w-xl mx-auto text-left mb-10"
      >
        <label className="block mb-3 font-semibold text-yellow-300">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Immaculate Munde"
          className="w-full p-3 rounded-full bg-blue-900 border border-yellow-400 text-white mb-4 placeholder-yellow-200"
        />
        <label className="block mb-3 font-semibold text-yellow-300">Your Tribute Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Write your heartfelt message here..."
          className="w-full p-3 rounded-3xl bg-blue-900 border border-yellow-400 text-white mb-4 placeholder-yellow-200"
        />
        <label className="cursor-pointer mb-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full transition">
          {photo ? "Change Photo" : "Choose Photo"}
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </label>
        {preview && (
          <div className="mb-4">
            <p className="text-yellow-300 mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="rounded-xl border border-yellow-400 mx-auto w-48 h-48 object-cover"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-full transition shadow-lg"
        >
          {loading ? "Submitting..." : "Submit Tribute"}
        </button>
      </form>

      {/* Tribute Cards */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tributes.map((t) => (
          <div
            key={t.id}
            className="bg-gradient-to-br from-blue-950 to-blue-800 border border-yellow-500 rounded-3xl p-5 shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
          >
            {t.photoUrl && (
              <img
                src={t.photoUrl}
                alt={t.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-xl font-bold text-yellow-300">{t.name}</h3>

            {editingId === t.id ? (
              <>
                <textarea
                  value={editingMessage}
                  onChange={(e) => setEditingMessage(e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded-2xl bg-blue-900 border border-yellow-400 text-white mt-2"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 py-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-full text-sm transition"
                  >
                    {loading ? "Updating..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-yellow-100 mt-2">{t.message}</p>
                <p className="text-sm text-yellow-200 mt-3">{t.date}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(t.id, t.message)}
                    className="flex-1 py-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-full text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="flex-1 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
