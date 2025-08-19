"use client";
import { Check, ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

// Tipe data diperbarui dengan `hoverContent` untuk teks saat hover
type Testimonial = {
  type: "image" | "text";
  content: string;
  hoverContent?: string; // Teks yang muncul saat hover pada gambar
  author: string;
  badgeType: "success" | "highlight";
};

// Konten testimoni diperbarui agar lebih realistis
const testimonials: Testimonial[] = [
  {
    type: "image",
    content: "/hijab-1.png",
    hoverContent:
      '"Awalnya ragu, tapi setelah coba AI-nya, rekomendasi hijabnya pas banget sama bentuk wajah dan warna kulitku. Hemat waktu banget!"',
    author: "Yasmin Azizah",
    badgeType: "success",
  },
  {
    type: "image",
    content: "/hijab-2.png",
    hoverContent:
      '"Fitur analisisnya keren! Aku jadi lebih percaya diri milih style fashion yang cocok. Nggak pernah salah gaya lagi sekarang."',
    author: "Nadia Putri",
    badgeType: "success",
  },
  {
    type: "text", // Kartu ini akan selalu menampilkan teks
    content:
      '"Sebagai orang yang buta fashion, aplikasi ini penyelamat. Cuma butuh satu foto dan semua rekomendasi langsung muncul. Super praktis!"',
    author: "Aisha Kamilia",
    badgeType: "highlight",
  },
  {
    type: "image",
    content: "/hijab-3.png",
    hoverContent:
      '"Suka banget sama rekomendasi produknya, langsung bisa checkout di marketplace favorit. Tiebymin AI bener-bener ngertiin kebutuhanku."',
    author: "Rina Setyawati",
    badgeType: "success",
  },
];

const AuthorBadge: React.FC<{
  author: string;
  type: "success" | "highlight";
}> = ({ author, type }) => {
  const badgeStyles = {
    success: "bg-[#E2F5E6] text-[#34A853]",
    highlight: "bg-[#FFE5ED] text-[#EF789B]",
  };

  return (
    <div
      className={`absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full ${badgeStyles[type]}`}
    >
      <div className="bg-white p-0.5 rounded-full">
        <Check size={14} className="stroke-current" />
      </div>
      <span className="font-semibold text-sm">{author}</span>
    </div>
  );
};

// --- PERUBAHAN UTAMA ADA DI KOMPONEN INI ---
const TestimonialCard: React.FC<{ data: Testimonial }> = ({ data }) => {
  // Jika tipe kartu adalah 'text', tampilkan seperti biasa tanpa efek hover
  if (data.type === "text") {
    return (
      <div className="relative h-[480px] w-80 flex-shrink-0 overflow-hidden rounded-3xl shadow-lg">
        <div className="bg-[#323232] h-full w-full p-8 flex items-center">
          <p className="text-white font-medium text-lg italic leading-relaxed">
            {data.content}
          </p>
        </div>
        <AuthorBadge author={data.author} type={data.badgeType} />
      </div>
    );
  }

  return (
    <div className="group relative h-[480px] w-80 flex-shrink-0 cursor-pointer overflow-hidden rounded-3xl shadow-lg">
      <Image
        src={data.content}
        alt={`Testimonial by ${data.author}`}
        width={320}
        height={480}
        quality={100}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 flex h-full w-full items-center bg-[#323232] bg-opacity-80 p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="text-white font-medium text-lg italic leading-relaxed">
          {data.hoverContent}
        </p>
      </div>

      <AuthorBadge author={data.author} type={data.badgeType} />
    </div>
  );
};

export const ThirdSection = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    if (scrollRef.current) {
      // Scroll sejauh lebar satu kartu ditambah jaraknya
      scrollRef.current.scrollBy({ left: 320 + 24, behavior: "smooth" });
    }
  };

  return (
    <section className="mb-[100px]">
      <div className="container mx-auto px-4 sm:px-10 lg:px-[130px]">
        <hr className="mt-[100px] mb-[80px]" />

        <div className="flex flex-col items-center text-center lg:flex-row lg:text-start justify-between mb-12">
          <div>
            <h2 className="font-handlee italic text-4xl lg:text-5xl text-gray-900">
              Dengar testimoni pengguna tercinta kita
            </h2>
          </div>
        </div>

        {/* Wrapper untuk slider dan tombol navigasi */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} data={testimonial} />
            ))}
          </div>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all focus:outline-none hidden md:flex"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </div>
      </div>
    </section>
  );
};
