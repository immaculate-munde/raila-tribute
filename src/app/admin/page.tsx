"use client";

import { useState } from "react";
import Link from "next/link";

interface Tribute {
  id: string;
  name: string;
  message: string;
  date: string;
  photoUrl?: string;
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Hardcoded admin credentials
  const handleLogin = () => {
    if (email === "munde" && password === "munde@006") {
      setIsAuthenticated(true);
      fetchTributes();
    } else {
      alert("Invalid credentials ❌");
    }
  };

  // 🧭 Fetch all tributes
  const fetchTributes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tributes");
      const data = await res.json();
      setTributes(data);
    } catch (error) {
      console.error("Failed to fetch tributes:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete tribute
  const handleDelete = async (id: string, photoUrl?: string) => {
    if (!confirm("Are you sure you want to delete this tribute?")) return;

    try {
      const res = await fetch("/api/deleteTribute", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, photoUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete tribute");

      alert("✅ Tribute deleted successfully");
      fetchTributes(); // refresh list
    } catch (err: any) {
      console.error("❌ Delete failed:", err);
      alert("Error deleting tribute: " + err.message);
    }
  };

  // ---- LOGIN SCREEN ----
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111122] to-[#0a0a0f] text-white">
        <div className="bg-[#111122]/80 p-8 rounded-2xl shadow-2xl w-80 text-center border border-[#bfa14a]/30">
          <h1 className="text-3xl font-extrabold mb-6 text-[#f4c430] tracking-wide">
            Admin Login
          </h1>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 w-full p-3 rounded-lg bg-[#0d0d15] border border-[#f4c430]/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f4c430]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-5 w-full p-3 rounded-lg bg-[#0d0d15] border border-[#f4c430]/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f4c430]"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#f4c430] hover:bg-[#e0b820] transition rounded-lg font-semibold text-[#111122]"
          >
            Login
          </button>

          <Link
            href="/"
            className="block mt-6 text-sm text-[#f4c430]/80 hover:text-[#f4c430] transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ---- DASHBOARD SCREEN ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111122] to-[#0a0a0f] text-white">
      <header className="flex justify-between items-center border-b border-[#f4c430]/20 px-8 py-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#f4c430] drop-shadow-lg">
          🕊️ Raila Odinga Admin Dashboard
        </h1>
        <div className="flex gap-3">
          <Link
            href="/tributes"
            className="px-4 py-2 bg-[#f4c430]/10 border border-[#f4c430]/40 rounded-lg hover:bg-[#f4c430]/20 text-[#f4c430] transition"
          >
            View Tributes
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-[#0d0d15] border border-[#f4c430]/40 rounded-lg hover:bg-[#f4c430]/20 text-[#f4c430] transition"
          >
            Home
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-[#b22222] hover:bg-[#d32f2f] transition rounded-lg font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="px-8 py-6">
        {loading ? (
          <div className="text-center mt-20">
            <div className="animate-spin border-4 border-[#f4c430] border-t-transparent rounded-full w-10 h-10 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading tributes...</p>
          </div>
        ) : tributes.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">No tributes available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tributes.map((t) => (
              <div
                key={t.id}
                className="bg-[#111122]/80 rounded-2xl p-5 shadow-lg border border-[#f4c430]/30 hover:shadow-[#f4c430]/30 hover:-translate-y-1 transition-all duration-300"
              >
                {t.photoUrl && (
                  <img
                    src={t.photoUrl}
                    alt={t.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="mb-3">
                  <h2 className="text-xl font-semibold text-[#f4c430]">{t.name}</h2>
                  <p className="text-gray-300 mt-2 leading-relaxed">{t.message}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                  <span className="italic">{t.date}</span>
                  <button
                    onClick={() => handleDelete(t.id, t.photoUrl)}
                    className="px-3 py-1 bg-[#b22222] hover:bg-[#d32f2f] rounded-lg transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
