"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/overview", label: "Overview AI" },
    { href: "/#tutorial", label: "Tutorial" },
    { href: "/metodologi", label: "Metodologi" },
    { href: "/#testimoni", label: "Testimoni" },
  ];

  const closeSheet = () => setIsOpen(false);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.substring(2);
      if (pathname === "/") {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`/${href.substring(1)}`);
      }
    }
    closeSheet();
  };

  return (
    <div className="mx-auto sticky top-0  lg:top-[25px] xl:top-[50px] z-50 w-full px-0 sm:px-4 lg:px-8 xl:px-[200px]">
      <header className="relative rounded-none lg:py-0 py-3 lg:rounded-full bg-[#333333] text-white shadow-lg backdrop-blur-md">
        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center justify-between py-3 px-8">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/tie-by-min-logo-light.png"
                alt="Tiebymin Logo"
                width={120}
                height={28}
                priority
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <nav className="flex items-center gap-20 justify-end">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base font-medium hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-3">
            <Link href="/login">
              <Button
                size="lg"
                className="rounded-full bg-[#FFC6C6] hover:bg-[#f9bfbf] flex items-center gap-2 px-6 py-3"
              >
                <Sparkles className="w-4 h-4 text-[#323232] fill-[#323232]" />
                <span className="font-semibold text-[#323232]">
                  Coba Sekarang
                </span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                size="lg"
                className="rounded-full bg-white hover:bg-gray-300 flex items-center gap-2 px-6 py-3"
              >
                <User className="w-4 h-4 text-[#323232] fill-[#323232]" />
                <span className="font-semibold text-[#323232]">Profile</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ====================================================== */}
        {/* Mobile/Tablet Navigation (BAGIAN YANG DIPERBAIKI) */}
        {/* ====================================================== */}
        <div className="xl:hidden flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4">
          {/* 1. Logo di sebelah kiri */}
          <Link href="/">
            <Image
              src="/tie-by-min-logo-light.png" // Menggunakan logo terang agar kontras
              alt="Tiebymin Logo"
              width={100}
              height={24}
              priority
              className="h-8 w-auto" // Ukuran disesuaikan
            />
          </Link>

          {/* 2. Ikon Menu di sebelah kanan */}
          <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-700 rounded-full p-1 sm:p-2"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#333333] text-white border-gray-600 w-[250px] sm:w-[280px]"
              >
                <div className="flex flex-col space-y-4 sm:space-y-6 mt-6 sm:mt-8 ml-2 sm:ml-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base sm:text-lg font-medium hover:text-gray-300 transition-colors"
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 pt-3 sm:pt-4">
                    <Link href="/login" onClick={closeSheet}>
                      <Button
                        size="default"
                        className="rounded-full bg-[#EF789B] hover:bg-[#E5679A] flex items-center gap-2 w-full sm:w-auto px-4 py-2"
                      >
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        <span className="text-sm sm:text-base">
                          Coba Sekarang
                        </span>
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={closeSheet}>
                      <Button
                        size="default"
                        className="rounded-full bg-white hover:bg-gray-300 flex items-center gap-2 px-4 py-2 mt-2 sm:mt-0"
                      >
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#323232] fill-[#323232]" />
                        <span className="text-sm sm:text-base text-[#323232]">
                          Profile
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
