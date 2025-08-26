"use client";
import { Check, ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

// Add CSS for flip animation
const flipStyles = `
  .testimonial-flip-container {
    perspective: 1000px;
  }
  .testimonial-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s ease-in-out;
    transform-style: preserve-3d;
  }
  .testimonial-flip-front,
  .testimonial-flip-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 1.5rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .testimonial-flip-back {
    transform: rotateY(180deg);
  }
  .testimonial-flip-inner.flipped {
    transform: rotateY(180deg);
  }
  .testimonial-image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .testimonial-flip-container:hover .testimonial-image-overlay {
    opacity: 1;
  }
`;

// Inject styles into head
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("testimonial-flip-styles");
  if (!existingStyle) {
    const style = document.createElement("style");
    style.id = "testimonial-flip-styles";
    style.textContent = flipStyles;
    document.head.appendChild(style);
  }
}

type Testimonial = {
  type: "image" | "text";
  content: string;
  hoverContent?: string;
  author: string;
  badgeType: "success" | "highlight";
};

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
    type: "text",
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
  {
    type: "text",
    content:
      '"Fitur analisis warna kulitnya itu game-changer! Aku baru sadar selama ini sering salah pilih warna. Sekarang penampilan jadi kelihatan lebih fresh dan cerah. Suka banget!"',
    author: "Fitri Handayani",
    badgeType: "highlight",
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
      className={`absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full ${badgeStyles[type]}`}
    >
      <div className="bg-white p-0.5 rounded-full">
        <Check size={14} className="stroke-current" />
      </div>
      <span className="font-semibold text-sm">{author}</span>
    </div>
  );
};

const TestimonialCard: React.FC<{
  data: Testimonial;
  isFlipped: boolean;
  onFlip: () => void;
}> = ({ data, isFlipped, onFlip }) => {
  if (data.type === "text") {
    return (
      <div className="relative h-[400px] sm:h-[480px] w-72 sm:w-80 flex-shrink-0 overflow-hidden rounded-3xl shadow-lg">
        <div className="bg-[#323232] h-full w-full p-8 flex flex-col">
          <p className="text-[#FFC6C6] font-medium text-lg italic leading-relaxed">
            {data.content}
          </p>
        </div>
        <AuthorBadge author={data.author} type={data.badgeType} />
      </div>
    );
  }

  return (
    <div
      className="testimonial-flip-container relative h-[400px] sm:h-[480px] w-72 sm:w-80 flex-shrink-0 cursor-pointer shadow-lg"
      onClick={onFlip}
    >
      <div className={`testimonial-flip-inner ${isFlipped ? "flipped" : ""}`}>
        {/* Front of card - Image */}
        <div className="testimonial-flip-front relative">
          <Image
            src={data.content}
            alt={`Testimonial by ${data.author}`}
            width={320}
            height={480}
            quality={100}
            className="h-full w-full object-cover"
          />
          <div className="testimonial-image-overlay">
            <div className="text-white text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-3 mb-2 inline-block">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">
                Klik untuk melihat testimoni
              </p>
            </div>
          </div>
        </div>

        {/* Back of card - Testimonial Text */}
        <div className="testimonial-flip-back">
          <div className="bg-[#323232] h-full w-full p-8 flex flex-col relative">
            <p className="text-[#FFC6C6] font-medium text-lg italic leading-relaxed text-start mb-6">
              {data.hoverContent}
            </p>
          </div>
        </div>
      </div>

      <AuthorBadge author={data.author} type={data.badgeType} />
    </div>
  );
};

export const ThirdSection = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [flippedCards, setFlippedCards] = React.useState<Set<number>>(
    new Set()
  );

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320 + 24, behavior: "smooth" });
    }
  };

  const handleCardFlip = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section id="testimoni" className="px-4 sm:px-10 lg:px-[200px]">
      <div className="container mx-auto">
        <hr className="mt-[100px] mb-[80px] mx-5 lg:mx-0" />

        <div className="flex flex-col items-center text-center lg:flex-row lg:text-start justify-between mb-[70px]">
          <div>
            <h2 className="font-handlee italic text-3xl sm:text-4xl lg:text-5xl text-gray-900">
              Dengar testimoni pengguna tercinta kita
            </h2>
          </div>
        </div>

        <div className="relative mb-[100px]">
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                data={testimonial}
                isFlipped={flippedCards.has(index)}
                onFlip={() => handleCardFlip(index)}
              />
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
