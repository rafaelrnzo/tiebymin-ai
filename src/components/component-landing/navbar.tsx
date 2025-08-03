"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/overview", label: "Overview AI" },
    { href: "/tutorial", label: "Tutorial" },
    { href: "/faq", label: "FAQ" },
  ];

  const testimoniLink = { href: "/testimoni", label: "Testimoni" };

  const closeSheet = () => setIsOpen(false);

  return (
    <div className="mx-auto sticky top-4 z-50 w-full px-4 lg:px-8">
      <header className="relative rounded-full bg-[#333333] text-white shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center py-3 px-6">
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[18px] font-medium hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#333333] text-white border-gray-600"
              >
                <div className="flex flex-col space-y-6 mt-8 ml-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium hover:text-gray-300 transition-colors"
                      onClick={closeSheet}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href={testimoniLink.href}
                    className="text-lg font-medium hover:text-gray-300 transition-colors"
                    onClick={closeSheet}
                  >
                    {testimoniLink.label}
                  </Link>
                  <Button
                    size="lg"
                    className="rounded-full bg-[#EF789B] hover:bg-[#E5679A] flex items-center gap-2 w-fit"
                    onClick={closeSheet}
                  >
                    <Sparkle className="w-4 h-4 text-white" />
                    <span>Coba Sekarang</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 flex justify-center lg:flex-none">
            <Link href="/">
              <Image
                src="/tiebymin-logo.png"
                alt="Tiebymin Logo"
                width={120}
                height={28}
                priority
                className="h-7 w-auto"
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              href={testimoniLink.href}
              className="text-[18px] font-medium hover:text-gray-300 transition-colors"
            >
              {testimoniLink.label}
            </Link>
            <Button
              size="lg"
              className="rounded-full bg-[#EF789B] hover:bg-[#E5679A] flex items-center gap-2"
            >
              <Sparkle className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Coba Sekarang</span>
              <span className="sm:hidden">Coba Sekarang</span>
            </Button>
          </div>

          <div className="lg:hidden">
            <Button
              size="sm"
              className="rounded-full bg-[#EF789B] hover:bg-[#E5679A] flex items-center gap-1 px-3"
            >
              <Sparkle className="w-3 h-3 text-white" />
              <span className="text-xs">Coba Sekarang</span>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
