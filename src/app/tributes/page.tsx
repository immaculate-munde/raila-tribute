"use client";

import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { db, storage } from "@/lib/firebase";
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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";

export default function TributesPage() {
  const auth = getAuth();

  // 🔐 Auth state
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  // 💌 Tributes state
  const [tributes, setTributes] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState("");

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // 📜 Load tributes
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "tributes"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTributes(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate
            ? doc.data().date.toDate().toLocaleString()
            : "Just now",
        }))
      );
    });
    return () => unsub();
  }, [user]);

  // 📷 Handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 📝 Submit new tribute
  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      console.error(err);
      alert("Failed to submit tribute.");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Edit tribute
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
    } catch (err) {
      console.error(err);
      alert("Failed to update tribute.");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete tribute
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tribute?")) return;
    setLoading(true);
    try {
      const docRef = doc(db, "tributes", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error(err);
      alert("Failed to delete tribute.");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Email/password auth with single signup restriction
  const handleEmailAuth = async () => {
    if (!email || !password) return alert("Enter email and password.");
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (isSignup && methods.length) {
        alert("Email already registered. Please login.");
        setIsSignup(false);
        return;
      }
      if (!isSignup && !methods.length) {
        alert("No account found. Please sign up first.");
        setIsSignup(true);
        return;
      }
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 🔐 Google login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 🛑 Render login/signup form
  const renderAuthForm = () => (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 px-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">
        {isSignup ? "Sign Up" : "Login"}
      </h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 p-3 rounded-full w-80 bg-blue-900 text-white placeholder-yellow-200 border border-yellow-400"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-3 rounded-full w-80 bg-blue-900 text-white placeholder-yellow-200 border border-yellow-400"
      />
      <button
        onClick={handleEmailAuth}
        className="mb-3 w-80 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-full font-bold text-gray-900 shadow-lg transition"
      >
        {isSignup ? "Sign Up" : "Login"}
      </button>
      <button
        onClick={handleGoogleLogin}
        className="w-80 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-white shadow-lg transition"
      >
        Continue with Google
      </button>
      <p className="mt-4 text-yellow-200">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          className="text-yellow-400 font-semibold cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Login" : "Sign Up"}
        </span>
      </p>
    </div>
  );

  // 🕊️ Render tributes page
  const renderTributesPage = () => (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-yellow-50">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-10">
        Tributes 💛
      </h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={async () => await auth.signOut()}
          className="py-2 px-4 bg-red-500 hover:bg-red-600 rounded-full font-bold text-white shadow-lg"
        >
          Logout
        </button>
      </div>

      {/* 💌 Tribute Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-blue-950 to-blue-800 border border-yellow-500 rounded-3xl p-6 shadow-2xl max-w-xl mx-auto text-left mb-10"
      >
        <label className="block mb-3 font-semibold text-yellow-300">
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Immaculate Munde"
          className="w-full p-3 rounded-full bg-blue-900 border border-yellow-400 text-white mb-4 placeholder-yellow-200"
        />
        <label className="block mb-3 font-semibold text-yellow-300">
          Your Tribute Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Write your heartfelt message here..."
          className="w-full p-3 rounded-3xl bg-blue-900 border border-yellow-400 text-white mb-4 placeholder-yellow-200"
        />
        <label className="cursor-pointer mb-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full transition">
          {photo ? "Change Photo" : "Choose Photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
        {preview && (
          <div className="mb-4">
            <p className="text-yellow-300 mb-2">Preview:</p>
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-xl border border-yellow-400 mx-auto"
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

      {/* 🕊️ Tribute Cards */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tributes.map((t) => (
          <div
            key={t.id}
            className="bg-gradient-to-br from-blue-950 to-blue-800 border border-yellow-500 rounded-3xl p-5 shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
          >
            {t.photoUrl && (
              <Image
                src={t.photoUrl}
                alt={t.name}
                width={300}
                height={200}
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
                <button
                  onClick={handleUpdate}
                  className="mt-2 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-full transition shadow-lg"
                >
                  {loading ? "Updating..." : "Save"}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="mt-2 w-full py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition shadow-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="text-yellow-100 mt-2">{t.message}</p>
                <p className="text-sm text-yellow-200 mt-3">{t.date}</p>
                <div className="flex flex-col gap-2 mt-3">
                  <button
                    onClick={() => startEdit(t.id, t.message)}
                    className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-full transition shadow-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition shadow-lg"
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

  // ✅ Render based on user
  return user ? renderTributesPage() : renderAuthForm();
}
