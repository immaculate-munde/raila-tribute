// components/MemoryCard.tsx
import Image from "next/image";

export default function MemoryCard({
  title, date, text, photoUrl,
}: {
  title: string;
  date: string;
  text: string;
  photoUrl?: string;
}) {
  return (
    <article className="bg-[#07101a]/60 border border-[#7a5f3f] rounded-2xl overflow-hidden shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-gold-glow">
      <div className="relative h-48 w-full">
        {photoUrl ? (
          <Image src={photoUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#0b1220] to-[#111827] flex items-center justify-center text-sm text-[#c7a17a]/60">
            No photo
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gold">{title}</h3>
        <time className="block text-sm text-[#dcd2c3] mb-2">{date}</time>
        <p className="text-sm text-[#efe7dc]">{text}</p>
      </div>
    </article>
  );
}
