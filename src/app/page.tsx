"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b132b] via-[#1c2541] to-[#3a506b] text-white flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* 🌟 Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]">
          Raila Amollo Odinga
        </h1>
        <p className="text-lg md:text-xl text-yellow-100 mb-6 leading-relaxed">
          “A man of resilience, courage, and undying love for Kenya.”
          <br /> Honoring his journey — from activism to statesmanship.
        </p>

        {/* 🕊️ Hero Image */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-yellow-400 shadow-[0_0_40px_rgba(255,215,0,0.5)]">
            <Image
              src="/images/raila/hero.png"
              alt="Raila Amollo Odinga"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ✨ Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/tributes"    
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-full font-semibold text-gray-900 shadow-lg hover:shadow-yellow-300/60 transition-transform transform hover:scale-105">
            View Tributes
          </Link>
          
          <Link
            href="/admin"
            className="px-8 py-3 bg-[#1c2541] hover:bg-[#3a506b] border border-yellow-400 rounded-full font-semibold text-yellow-300 shadow-md hover:shadow-yellow-400/40 transition-transform transform hover:scale-105"
          >
            Admin Dashboard
          </Link>
        </div>
      </motion.div>

      {/* 🕊️ Timeline Section */}
      <section className="mt-20 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-10">
          His Journey Through the Years
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              year: "1982",
              title: "Detained for Fighting for Democracy",
              desc: "Raila was imprisoned after the failed coup, marking the beginning of his struggle for multiparty democracy.",
            },
            {
              year: "2002",
              title: "NARC Victory",
              desc: "Key architect in uniting opposition to end KANU’s 40-year rule — leading to a historic win for Mwai Kibaki.",
            },
            {
              year: "2008",
              title: "Prime Minister of Kenya",
              desc: "Served as the 2nd Prime Minister of Kenya in the Grand Coalition Government, promoting unity and reform.",
            },
            {
              year: "2010",
              title: "Champion of the New Constitution",
              desc: "Played a major role in shaping and passing Kenya’s 2010 Constitution — a defining democratic milestone.",
            },
            {
              year: "2022",
              title: "Elder Statesman",
              desc: "Continued advocating for governance, youth empowerment, and Pan-African leadership.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(255, 215, 0, 0.6)",
              }}
              className="bg-[#1c2541]/80 border border-yellow-400 rounded-2xl p-6 shadow-md transition-all duration-300 hover:bg-[#1c2541]/90"
            >
              <h3 className="text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                {item.year}
              </h3>
              <p className="text-yellow-100 mt-3 font-semibold text-lg">
                {item.title}
              </p>
              <p className="text-yellow-200 mt-2 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🕊️ Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-16 text-yellow-200 text-sm"
      >
        © {new Date().getFullYear()} In Loving Memory of Raila Amollo Odinga.
        <br />
        Built with ❤️ by <span className="font-semibold text-yellow-400">Immaculate Munde</span>.
      </motion.footer>
    </main>
  );
}
