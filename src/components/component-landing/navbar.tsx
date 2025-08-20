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
    <div className="mx-auto sticky top-4 sm:top-8 z-50 w-full px-4 lg:px-[200px]">
      <header className="relative rounded-full bg-[#333333] text-white shadow-lg backdrop-blur-md">
        <div className="hidden lg:flex items-center justify-between py-3 px-8">
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

          {/* Bagian Tengah: Link Navigasi */}
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

          {/* Bagian Kanan: Tombol Aksi */}
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

        <div className="lg:hidden flex items-center justify-between py-3 px-4">
          <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-700 rounded-full"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#333333] text-white border-gray-600 w-[280px]"
              >
                <div className="flex flex-col space-y-6 mt-8 ml-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium hover:text-gray-300 transition-colors"
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="flex gap-2 pt-4">
                    <Link href="/login" onClick={closeSheet}>
                      <Button
                        size="lg"
                        className="rounded-full bg-[#EF789B] hover:bg-[#E5679A] flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Coba Sekarang</span>
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button
                        size="lg"
                        className="rounded-full bg-white hover:bg-gray-300 flex items-center gap-2 px-6 py-3"
                      >
                        <User className="w-4 h-4 text-[#323232] fill-[#323232]" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Tengah: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Image
                src="/tiebymin-logo.png"
                alt="Tiebymin Logo"
                width={110}
                height={26}
                priority
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Kanan: Tombol Aksi (disembunyikan agar tidak terlalu ramai, bisa juga diganti dengan icon jika perlu) */}
          <div className="w-10 h-10">
            {/* Placeholder untuk menjaga logo tetap di tengah */}
          </div>
        </div>
      </header>
    </div>
  );
}
