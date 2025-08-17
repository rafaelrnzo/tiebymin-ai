import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

// --- Data untuk link di footer ---
const footerLinks = {
  navigasi: [
    { href: "/", label: "Home" },
    { href: "/cara-penggunaan", label: "Cara Penggunaan" },
    { href: "/hubungi-kami", label: "Hubungi Kami" },
    { href: "/faq", label: "FAQ" },
  ],
  marketPlace: [
    { href: "#", label: "Shopee" },
    { href: "#", label: "Tokopedia" },
    { href: "#", label: "Lazada" },
    { href: "#", label: "Tiktokshop" },
  ],
  sumberDaya: [
    { href: "/testimoni", label: "Testimoni" },
    { href: "/dokumentasi", label: "Dokumentasi" },
    { href: "/terms-of-service", label: "Terms Of Service" },
    { href: "/privacy-policy", label: "Privacy Policy" },
  ],
};

export default function Footer() {
  return (
    <>
      <section className="bg-[#FFC6C6] py-12 lg:px-[200px]">
        <div className="container mx-auto bg-[#F0F0F0] rounded-2xl p-8 lg:p-16 text-center">
          <h2 className="font-handlee text-4xl lg:text-5xl font-bold text-[#323232] leading-tight">
            Siap Jadi Yang Paling Stylish
            <br />
            Dibandingkan Yang Lain
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-[#323232] font-poppins">
            Temukan Fashion Yang Sesuai Untukmu Dengan Cara Yang Cerdas. Hanya
            Butuh Satu Foto. Tiebymin AI Memberikan Rekomendasi Instan Tanpa
            Perlu Repot, Serta Hemat Waktu Dan Biaya.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-[#323232] text-white font-semibold rounded-lg px-6 py-3 shadow-sm hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            Coba Analisis
          </Button>
        </div>
      </section>

      {/* === Footer Utama === */}
      <footer className="bg-[#FFC6C6] text-[#323232] pt-16 pb-8 lg:px-[200px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Kolom Brand */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-poppins">tiebymin</h3>
              <p className="mt-4 text-sm max-w-xs">
                Hanya Butuh Satu Foto, Tiebymin AI Memberikan Rekomendasi Akurat
                Tanpa Perlu Repot.
              </p>
              <div className="flex space-x-4 mt-6">
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Image
                    src="/tiktok-icon.png"
                    alt="TikTok Icon"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <Image
                    src="/instagram-icon.png"
                    alt="Instagram Icon"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            </div>

            {/* Kolom Navigasi */}
            <div>
              <h4 className="font-bold">Navigasi</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {footerLinks.navigasi.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom Market Place */}
            <div>
              <h4 className="font-bold">Market Place</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {footerLinks.marketPlace.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom Sumber Daya */}
            <div>
              <h4 className="font-bold">Sumber Daya</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {footerLinks.sumberDaya.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Garis pemisah dan Hak Cipta */}
          <div className="border-t border-white/20 mt-12 pt-6 text-sm">
            <p>© 2025, Tiebymin AI</p>
          </div>
        </div>
      </footer>
    </>
  );
}
