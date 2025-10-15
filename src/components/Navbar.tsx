"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Tributes", href: "/tributes" },
    { name: "Dashboard", href: "/admin" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isTop
          ? "bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-yellow-50 shadow-lg"
          : "bg-transparent text-yellow-50 shadow-none"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-extrabold text-yellow-400 hover:text-yellow-300 transition"
        >
          💛 Raila Tributes
        </Link>

        <div className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-semibold text-lg transition-all duration-200 ${
                pathname === item.href
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-yellow-100 hover:text-yellow-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
