import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raila Tributes",
  description: "A heartfelt tribute platform to Raila Amollo Odinga.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-yellow-50`}
      >
        {/* ✅ Navbar visible across all pages */}
        <Navbar />

        {/* Spacer to avoid content hiding behind navbar */}
         <div>{children}</div> {/* No padding */}
      </body>
    </html>
  );
}
