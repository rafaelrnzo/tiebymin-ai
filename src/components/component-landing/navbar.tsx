"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useState, useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { userProfile, analysisHistory, fetchUserData } = useUserData();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [latestAnalysisResult, setLatestAnalysisResult] = useState<{
    analysis_id: string;
  } | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      // Only access localStorage on client side
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");
        const userToken = localStorage.getItem("userToken");
        const loggedIn =
          !!(accessToken && accessToken.trim()) ||
          !!(userToken && userToken.trim());
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          try {
            await fetchUserData();
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            setIsLoggedIn(false);
          }
        }
      }
    };

    checkLogin();
  }, [fetchUserData]);

  useEffect(() => {
    if (analysisHistory.length > 0) {
      setLatestAnalysisResult(analysisHistory[0]);
    }
  }, [analysisHistory]);

  const navLinks = [
    {
      href:
        isLoggedIn && latestAnalysisResult
          ? `/ai-overview?result_id=${latestAnalysisResult.analysis_id}`
          : "/overview",
      label: "Overview AI",
    },
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
    <div className=" fixed top-0 left-0 right-0 z-50 w-full px-0 lg:pt-[60px]">
      <header className="lg:container mx-0 w-full lg:mx-auto relative rounded-none lg:py-0 py-3 lg:rounded-full bg-[#333333] text-[#f0f0f0] shadow-lg backdrop-blur-md">
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
            <Link
              href={
                isLoggedIn ? "/register?startStep=measurements" : "/register"
              }
            >
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
            {isLoggedIn && (
              <Link href="/ai-overview/profile">
                <Button
                  size="lg"
                  className="rounded-full bg-[#f0f0f0] hover:bg-gray-300 flex items-center gap-2 px-6 py-3"
                >
                  <User className="w-4 h-4 text-[#323232] fill-[#323232]" />
                  <span className="font-semibold text-[#323232]">Profile</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="xl:hidden flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4">
          <Link href="/">
            <Image
              src="/tie-by-min-logo-light.png" // Menggunakan logo terang agar kontras
              alt="Tiebymin Logo"
              width={100}
              height={24}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#f0f0f0] hover:bg-gray-700 rounded-full p-1 sm:p-2"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#333333] text-[#f0f0f0] border-gray-600 w-[250px] sm:w-[280px]"
              >
                {/* Logo in mobile sheet header */}
                <div className="flex items-center justify-between mt-4 ml-4 mb-4">
                  <Image
                    src="/tie-by-min-logo-light.png"
                    alt="Tiebymin Logo"
                    width={80}
                    height={20}
                    priority
                    className="h-6 w-auto"
                  />
                </div>

                <div className="flex flex-col space-y-4 sm:space-y-6 ml-2 sm:ml-4">
                  {navLinks.map((link, index) => (
                    <div key={link.href}>
                      <Link
                        href={link.href}
                        className="text-base sm:text-lg font-medium hover:text-gray-300 transition-colors"
                        onClick={(e) => handleLinkClick(e, link.href)}
                      >
                        {link.label}
                      </Link>
                      {/* Don't show hr below Testimoni link */}
                      {link.label !== "Testimoni" && (
                        <hr className="text-[#f0f0f0]/20 mt-4 mr-4" />
                      )}
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 pt-3">
                    <Link
                      href={
                        isLoggedIn
                          ? "/register?startStep=measurements"
                          : "/register"
                      }
                      onClick={closeSheet}
                    >
                      <div className="flex flex-col gap-4 mr-4">
                        <Button
                          size="default"
                          className="rounded-full bg-[#EF789B] hover:bg-[#E5679A] flex items-center gap-2 w-full px-4 py-2"
                        >
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#f0f0f0] fill-[#f0f0f0]" />
                          <span className="text-sm sm:text-base">
                            Coba Sekarang
                          </span>
                        </Button>
                        {isLoggedIn && (
                          <Link
                            href="/ai-overview/profile"
                            onClick={closeSheet}
                          >
                            <Button
                              size="default"
                              className="rounded-full bg-[#f0f0f0] hover:bg-gray-300 flex items-center gap-2 w-full px-4 py-2"
                            >
                              <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#323232] fill-[#323232]" />
                              <span className="text-sm sm:text-base text-[#323232]">
                                Profile
                              </span>
                            </Button>
                          </Link>
                        )}
                      </div>
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
