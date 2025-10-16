"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const timelineData = [
  { year: "1945", title: "Birth", desc: "Raila Amollo Odinga was born on January 7, 1945, in Maseno, Kenya." },
  { year: "1965", title: "Studies Abroad", desc: "Completed undergraduate studies in engineering in Germany, gaining international exposure." },
  { year: "1970s", title: "Early Political Activism", desc: "Became active in advocating for democracy and human rights in Kenya under KANU rule." },
  { year: "1982", title: "Detained for Fighting for Democracy", desc: "Imprisoned after the failed coup attempt, marking the start of his struggle for multiparty democracy." },
  { year: "1991", title: "Return to Politics", desc: "After years of detention and exile, he re-emerged as a prominent opposition figure calling for multiparty democracy." },
  { year: "1997", title: "Presidential Candidate", desc: "Ran for president against Daniel arap Moi, consolidating opposition support despite losing." },
  { year: "2002", title: "NARC Victory", desc: "Played a key role in uniting opposition to end KANU’s 40-year rule, leading to Mwai Kibaki’s historic win." },
  { year: "2005", title: "Constitutional Referendum", desc: "Led the opposition in the rejected draft constitution referendum, boosting his political profile." },
  { year: "2007", title: "Presidential Election Controversy", desc: "Ran for president; disputed results led to post-election violence and a national crisis." },
  { year: "2008", title: "Prime Minister of Kenya", desc: "Formed the Grand Coalition Government with President Mwai Kibaki to promote unity and reform." },
  { year: "2010", title: "Champion of the New Constitution", desc: "Instrumental in shaping and passing Kenya’s 2010 Constitution, a defining democratic milestone." },
  { year: "2013", title: "Presidential Run", desc: "Ran for president but lost to Uhuru Kenyatta, continuing his role as opposition leader." },
  { year: "2017", title: "Presidential Run & Election Dispute", desc: "Contested the election results, which were annulled by the Supreme Court; lost the re-run election later." },
  { year: "2022", title: "Elder Statesman", desc: "Continued advocating for good governance, youth empowerment, and Pan-African leadership." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b132b] via-[#1c2541] to-[#3a506b] text-white flex flex-col items-center px-6 py-16">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]">
          Raila Amollo Odinga
        </h1>
        <p className="text-lg md:text-xl text-yellow-100 mb-6 leading-relaxed">
          “A man of resilience, courage, and undying love for Kenya.”
          <br /> Honoring his journey — from activism to statesmanship.
        </p>

        <div className="relative w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden border-4 border-yellow-400 shadow-[0_0_40px_rgba(255,215,0,0.5)]">
          <Image
            src="/images/raila/hero.png"
            alt="Raila Amollo Odinga"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/tributes"
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-full font-semibold text-gray-900 shadow-lg hover:shadow-yellow-300/60 transition-transform transform hover:scale-105"
          >
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

      {/* Timeline Section */}
      <section className="relative max-w-6xl w-full mb-16">
        {/* Center vertical line */}
        <div className="hidden md:block absolute left-1/2 top-0 w-1 bg-yellow-400 h-full -translate-x-1/2" />

        {timelineData.map((item, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative w-full md:w-1/2 p-6 mb-16 ${
                isLeft ? "md:pr-12 md:ml-auto text-right" : "md:pl-12 md:mr-auto text-left"
              }`}
            >
              {/* Circle connecting to main line */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white z-10" />

              <div className="bg-[#1c2541]/80 border border-yellow-400 rounded-2xl p-6 shadow-md relative z-20">
                <h3 className="text-3xl font-extrabold text-yellow-400 mb-2">{item.year}</h3>
                <p className="text-yellow-100 font-semibold text-lg">{item.title}</p>
                <p className="text-yellow-200 mt-2 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="text-yellow-200 text-sm text-center">
        © {new Date().getFullYear()} In Loving Memory of Raila Amollo Odinga.
        <br />
        Built with ❤️ by <span className="font-semibold text-yellow-400">Immaculate Munde</span>.
      </footer>
    </main>
  );
}
