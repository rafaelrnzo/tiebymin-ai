"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    content: "/testi-1.png",
    hoverContent:
      '"Mantap Tiebymin beneran ngebantu nemuin hijab yang on-point buat aku. Nggak pake ribet, hasilnya cakep."',
    author: "Lady Fortuna",
    badgeType: "success",
  },
  {
    type: "image",
    content: "/testi-2.png",
    hoverContent:
      '"Gila, AI-nya nggak kaleng-kaleng. Cocok banget sama style fashion aku dan bikin outfit hijabku makin mantap. Bintang lima tiebymin!!!!"',
    author: "Shinta P",
    badgeType: "success",
  },
  {
    type: "image",
    content: "/testi-3.png",
    hoverContent:
      '"Ini literally penolongku. Rekomendasi hijab dari AI-nya accurate parah. Effortlessbanget dan hasilnya auto keren. Luv!"',
    author: "Miska",
    badgeType: "highlight",
  },
  {
    type: "image",
    content: "/testi-4.png",
    hoverContent:
      '"Definisi AI yang berguna banget buat spill rekomendasi hijab. Anti pusing-pusing mikirin cocok apa nggak. Worth it banget sih!"',
    author: "Arsyila S",
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
}> = ({ author }) => {
  return (
    <div
      className={`absolute bg-white bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full`}
    >
      <div className="bg-white p-0.5 rounded-full">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27.75 14C27.75 18.1812 25.8838 21.9275 22.9375 24.45C20.4491 26.5838 17.278 27.7547 14 27.75C10.5875 27.75 7.46626 26.5075 5.06251 24.45C3.55194 23.1601 2.33934 21.5578 1.50846 19.7536C0.677578 17.9494 0.248208 15.9863 0.250006 14C0.250006 6.40625 6.40626 0.25 14 0.25C21.5938 0.25 27.75 6.40625 27.75 14ZM19 9.625C19 8.29892 18.4732 7.02715 17.5355 6.08947C16.5979 5.15178 15.3261 4.625 14 4.625C12.6739 4.625 11.4022 5.15178 10.4645 6.08947C9.52679 7.02715 9.00001 8.29892 9.00001 9.625C9.00001 10.9511 9.52679 12.2229 10.4645 13.1605C11.4022 14.0982 12.6739 14.625 14 14.625C15.3261 14.625 16.5979 14.0982 17.5355 13.1605C18.4732 12.2229 19 10.9511 19 9.625ZM22.125 21.7812V21.5C22.125 20.1739 21.5982 18.9021 20.6605 17.9645C19.7229 17.0268 18.4511 16.5 17.125 16.5H10.875C9.54892 16.5 8.27715 17.0268 7.33947 17.9645C6.40179 18.9021 5.87501 20.1739 5.87501 21.5V21.7812C6.13334 22.0504 6.40417 22.3067 6.68751 22.55C8.72308 24.2966 11.3178 25.2546 14 25.25C15.5187 25.2529 17.0222 24.9469 18.419 24.3506C19.8157 23.7543 21.0766 22.8801 22.125 21.7812Z"
            fill="black"
          />
        </svg>
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
        <div className="testimonial-flip-front relative rounded-2xl">
          <Image
            src={data.content}
            alt={`Testimonial by ${data.author}`}
            width={320}
            height={480}
            quality={100}
            className="h-full w-full object-cover rounded-2xl"
          />
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
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320 + 24, behavior: "smooth" });
    }
  };

  const goToNextCard = () => {
    setCurrentCardIndex((prev) => Math.min(prev + 1, testimonials.length - 1));
  };

  const goToPreviousCard = () => {
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
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
          {/* Desktop: Scroll-based navigation */}
          <div className="hidden md:block">
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
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all focus:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </div>

          {/* Mobile: Button-based navigation */}
          <div className="md:hidden">
            <div className="flex justify-center">
              <TestimonialCard
                data={testimonials[currentCardIndex]}
                isFlipped={flippedCards.has(currentCardIndex)}
                onFlip={() => handleCardFlip(currentCardIndex)}
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={goToPreviousCard}
                disabled={currentCardIndex === 0}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </button>
              <button
                onClick={goToNextCard}
                disabled={currentCardIndex === testimonials.length - 1}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
