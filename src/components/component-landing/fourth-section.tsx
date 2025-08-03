import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Pastikan Anda mengimpor ini dari shadcn/ui
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

// Data untuk FAQ
const faqItems = [
  {
    value: "item-1",
    question: "Kak Cara Pake Nya Gimana Sih?",
    answer:
      "Cara Pakai-Nya Simple Banget, Kamu Tinggal Upload/Ambil Gambar Dari Wajah Kamu, Lalu Pilih Bentuk Badan, Setelah Semua Data Kamu Isi, Maka AI Akan Mulai Melakukan Analisa Secara Otomatis.",
  },
  {
    value: "item-2",
    question: "Bagaimana Cara AI Nya Bekerja?",
    answer:
      "AI kami menggunakan model machine learning canggih yang telah dilatih dengan jutaan data fashion untuk menganalisis fitur wajah, bentuk tubuh, dan warna kulit Anda, lalu mencocokkannya dengan gaya yang paling sesuai.",
  },
  {
    value: "item-3",
    question: "Seberapa Akurat Sih Hasil-Nya?",
    answer:
      "Dengan tingkat akurasi mencapai 97.3%, rekomendasi kami sangat bisa diandalkan. Namun, ingatlah bahwa fashion itu subjektif dan yang terpenting adalah kenyamanan Anda.",
  },
  {
    value: "item-4",
    question: "Data Aku Aman Gak Nih Kak?",
    answer:
      "Kami sangat memprioritaskan privasi Anda. Semua data dan foto yang Anda unggah dienkripsi dan tidak akan pernah dibagikan kepada pihak ketiga tanpa persetujuan Anda.",
  },
];

const FaqSection = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-36 gap-6 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-[16px] text-[#EC7498]">
              Siapa Yang Cocok Menggunakan Tiebymin AI
            </p>
            <div>
              <h2 className="font-serif text-[30px] lg:text-[60px] font-bold text-gray-900 mt-2">
                Sempurna Untuk Semua <br /> Pecinta Fashion!
              </h2>
              <p className="mt-4 text-gray-600 text-[16px] lg:text-[20px]">
                Apakah Kamu Seorang Pemula Atau Antusias Fashion, AI Ini Akan
                Memberikan Rekomendasi Yang Mudah Dan Cepat.
              </p>
            </div>

            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full"
            >
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.value}
                  value={item.value}
                  className="p-4 my-4 rounded-2xl border-none transition-colors duration-300 data-[state=closed]:bg-[#FFE5ED] data-[state=open]:bg-[#EF789B]"
                >
                  <AccordionTrigger className="font-serif text-[20px] w-full text-left font-semibold p-4 hover:no-underline data-[state=closed]:text-gray-900 data-[state=open]:text-white">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-serif text-[15px] px-4 pb-4 text-white/90">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button
              size="lg"
              className="bg-[#EC7498] text-white font-semibold rounded-full px-6 py-3 self-start text-[16px]"
            >
              Coba Analisis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div>
            <Image
              src="/faq-image.png"
              alt="Fashion enthusiasts"
              width={600}
              height={700}
              className="rounded-2xl shadow-xl w-full h-auto hidden lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialSection = () => {
  return (
    <section className="mx-4 lg:mx-0 bg-white pb-16 sm:pb-24">
      <div className="flex flex-col items-center lg:flex-row container mx-auto justify-between">
        <div className="flex flex-col">
          <p className="text-[16px] font-semibold text-[#EC7498]">
            Apa Kata Orang Lain Tentang Tiebymin AI
          </p>
          <div className="flex flex-col font-serif">
            <span className="font-bold text-[30px] lg:text-[46px]">
              Dengar Testimoni Dari
            </span>
            <span className="font-bold text-[30px] lg:text-[46px]">
              Pengguna Tercinta Kita
            </span>
          </div>
          <p className="text-[16px] lg:text-[20px] text-gray-400 my-4">
            Feedback Dari Pengguna Kami Sangat Berharga Untuk <br />
            Meningkatkan Kualitas Layanan Tiebymin AI
          </p>
        </div>
        <div className="relative w-[350px] h-[350px]">
          <Image
            src="/testimonial-person.png"
            alt="Yasmin Azizah"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />

          <div className="absolute bottom-5 -left-5">
            <div className="rounded-full bg-[#EC7498] px-8 py-10 text-center shadow-lg">
              <p className="text-white font-semibold text-[24px] leading-tight">
                Yasmin
                <br />
                Azizah
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-4">
          <p className="text-[24px] italic">“Tipsnya gampang diikuti, bikin</p>
          <p className="text-[24px] italic">
            bikin aku makin percaya diri styling
          </p>
          <p className="text-[24px] italic">hijab Mandiri setiap hari.”</p>
          <div className="flex mt-4 gap-4">
            <ArrowLeft className="h-14 w-14 bg-[#FFE5ED] p-1 rounded-full text-[#EC7498]" />
            <ArrowRight className="h-14 w-14 bg-[#FFE5ED] p-1 rounded-full text-[#EC7498]" />
          </div>
        </div>
      </div>
    </section>
  );
};

// Ekspor gabungan kedua seksi
export const FourthSection = () => {
  return (
    <>
      <FaqSection />
      <TestimonialSection />
    </>
  );
};
