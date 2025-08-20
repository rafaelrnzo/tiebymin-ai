import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import Image from "next/image";
import { ThirdSection } from "./third-section";

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
    <section className="bg-white px-4 sm:px-10 lg:px-[200px] py-12 sm:py-16">
      <div className="container mx-auto">
        <hr className="mt-[100px] mb-[90px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-24 gap-6 items-center">
          <div className="flex flex-col">
            <p className="text-2xl sm:text-3xl font-handlee italic">
              Sempurna Untuk
            </p>
            <div>
              <h2 className="font-oswald text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                Semua Pecinta Fashion!
              </h2>
              <p className="mt-4 text-gray-600 text-base sm:text-lg lg:text-xl mb-3">
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
                  className="px-4 my-4 rounded-2xl transition-colors duration-300 data-[state=closed]:bg-transparent data-[state=open]:bg-[#FFC6C6] data-[state=closed]:border"
                >
                  <AccordionTrigger className="font-poppins text-base sm:text-lg lg:text-xl w-full text-left font-semibold p-4 hover:no-underline data-[state=closed]:text-gray-900 data-[state=open]:text-[#323232]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-poppins text-sm sm:text-base px-4 pb-4 text-[#323232]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <a href="/metodologi">
              <Button
                size="lg"
                className="bg-[#323232] w-full text-white font-semibold rounded-xl py-5 sm:py-7 self-start text-base"
              >
                <Clipboard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                Lihat Metodologi
              </Button>
            </a>
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

export const FourthSection = () => {
  return (
    <>
      <FaqSection />
      <ThirdSection />
    </>
  );
};
