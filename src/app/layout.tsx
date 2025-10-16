import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientBody from "@/components/ClientBody";

export const metadata = {
  title: "Raila Tributes",
  description: "A heartfelt tribute platform to Raila Amollo Odinga.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <ClientBody>
        <Navbar />
        <div>{children}</div>
      </ClientBody>
    </html>
  );
}
