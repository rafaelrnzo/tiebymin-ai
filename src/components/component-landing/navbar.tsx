// components/navbar.tsx

import Link from "next/link";
import Image from "next/image"; // <- Jangan lupa import Image
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, WandSparkles } from "lucide-react";

export function Navbar() {
  const navLinks = [
    { href: "/overview", label: "Overview" },
    { href: "/ai", label: "AI" },
    { href: "/tutorial", label: "Tutorial" },
    { href: "/faq", label: "FAQ" },
  ];

  const rightNavLinks = [{ href: "/testimoni", label: "Testimoni" }];

  return (
    <div className="sticky top-4 z-50 w-full px-4 lg:px-8">
      <header className="rounded-full bg-[#333333] text-white shadow-lg backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center flex-1">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-700"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Buka menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-[#1c1c1c] text-white border-r-gray-800 w-[250px] sm:w-[300px]"
                >
                  <nav className="flex flex-col space-y-4 pt-6">
                    {[...navLinks, ...rightNavLinks].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium text-gray-300 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Link Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* === Bagian Tengah (Logo Gambar) === */}
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/tiebymin-logo.png" // Pastikan path ini sesuai
                alt="Tiebymin Logo"
                width={120} // Sesuaikan lebar logo
                height={28}
                priority
              />
            </Link>
          </div>

          {/* === Bagian Kanan (Testimoni & Tombol CTA) === */}
          <div className="flex items-center justify-end flex-1 space-x-6">
            <nav className="hidden lg:flex items-center">
              <Link
                href="/testimoni"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Testimoni
              </Link>
            </nav>
            <Button className="rounded-full bg-[#EF789B] text-white hover:bg-white hover:text-black transition-colors">
              <WandSparkles className="mr-2 h-4 w-4" />
              Coba sekarang
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
