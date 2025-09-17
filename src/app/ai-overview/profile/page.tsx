"use client";

import { Navbar } from "@/components/component-landing/navbar";
import DashboardSkeleton from "@/components/skeleton-loading/profile-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useGenerateStory } from "@/hooks/useGenerateStory";
import { useToast } from "@/hooks/useToast";
import { useUserData } from "@/hooks/useUserData";
import { Download, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// Interface for story generation result
interface StoryGenerationResult {
  data: Uint8Array;
  size: number;
  type: string;
  generationTime?: string;
}

// Function to shorten month names
const shortenMonth = (dateString: string) => {
  return dateString
    .replace("January", "Jan")
    .replace("February", "Feb")
    .replace("March", "Mar")
    .replace("April", "Apr")
    .replace("May", "May")
    .replace("June", "Jun")
    .replace("July", "Jul")
    .replace("August", "Aug")
    .replace("September", "Sep")
    .replace("October", "Oct")
    .replace("November", "Nov")
    .replace("December", "Dec");
};

export default function DashboardPage() {
  const [generatingStoryIds, setGeneratingStoryIds] = useState<Set<string>>(
    new Set()
  );
  const [storyProgress, setStoryProgress] = useState<Map<string, number>>(
    new Map()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Ubah dari 10 ke 2 untuk menampilkan 2 data per halaman

  // Enhanced download states
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<
    "fast" | "slow" | "unknown"
  >("unknown");

  const router = useRouter();
  const {
    userProfile,
    analysisHistory,
    isLoading,
    error,
    fetchUserData,
    logout,
  } = useUserData();

  const { mutateAsync: generateStory } = useGenerateStory();
  const { showToast } = useToast();

  // Network quality detection seperti PDF preview
  useEffect(() => {
    if (typeof window !== "undefined" && "navigator" in window) {
      const connection =
        (
          navigator as Navigator & {
            connection?: { effectiveType: string; downlink: number };
            mozConnection?: { effectiveType: string; downlink: number };
            webkitConnection?: { effectiveType: string; downlink: number };
          }
        ).connection ||
        (
          navigator as Navigator & {
            mozConnection?: { effectiveType: string; downlink: number };
          }
        ).mozConnection ||
        (
          navigator as Navigator & {
            webkitConnection?: { effectiveType: string; downlink: number };
          }
        ).webkitConnection;

      if (connection) {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink || 0;

        // Lebih akurat berdasarkan kecepatan
        if (
          effectiveType === "slow-2g" ||
          effectiveType === "2g" ||
          downlink < 1
        ) {
          setConnectionQuality("slow");
        } else if (effectiveType === "3g" || downlink < 5) {
          setConnectionQuality("slow");
        } else {
          setConnectionQuality("fast");
        }
      } else {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        setConnectionQuality(isMobile ? "slow" : "fast");
      }
    }
  }, []);

  // Memoized pagination calculations untuk performa yang lebih baik
  const paginationData = useMemo(() => {
    const totalItems = analysisHistory?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = analysisHistory?.slice(startIndex, endIndex) || [];

    return {
      totalItems,
      totalPages,
      currentItems,
      startIndex,
      endIndex,
    };
  }, [analysisHistory, currentPage, itemsPerPage]);

  // Reset ke halaman pertama ketika data berubah
  useEffect(() => {
    if (
      paginationData.totalPages > 0 &&
      currentPage > paginationData.totalPages
    ) {
      setCurrentPage(1);
    }
  }, [analysisHistory?.length, currentPage, paginationData.totalPages]);

  const generatePageNumbers = useMemo(() => {
    const { totalPages } = paginationData;
    const pages: number[] = [];
    const maxVisiblePages = 5; // Meningkatkan jumlah halaman yang terlihat

    if (totalPages <= maxVisiblePages) {
      // Tampilkan semua halaman jika total kurang dari max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Hitung range di sekitar halaman saat ini
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - halfVisible);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      // Sesuaikan start jika kita mendekati akhir
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      // Tambahkan halaman pertama jika tidak termasuk
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push(-1); // Placeholder untuk "..."
        }
      }

      // Tambahkan halaman di range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Tambahkan halaman terakhir jika tidak termasuk
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push(-1); // Placeholder untuk "..."
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [paginationData.totalPages, currentPage]);

  // Handler untuk perubahan halaman
  const handlePageChange = (page: number) => {
    if (
      page >= 1 &&
      page <= paginationData.totalPages &&
      page !== currentPage
    ) {
      setCurrentPage(page);
      // Scroll ke atas tabel untuk UX yang lebih baik
      const tableElement = document.querySelector(".overflow-x-auto");
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Handle OAuth-style token extraction from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;

      let accessToken = null;

      // Check for access_token in query parameters (from backend redirect)
      if (urlParams.has("access_token")) {
        accessToken = urlParams.get("access_token");
      }
      // Fallback: check for access_token in hash
      else if (hash.includes("access_token")) {
        const hashParams = new URLSearchParams(hash.substring(1));
        accessToken = hashParams.get("access_token");
      }

      if (accessToken) {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("userToken", accessToken); // For backward compatibility

          document.cookie = `auth=${accessToken}; path=/; max-age=86400`;

          // Clean the URL (remove query params and hash)
          window.history.replaceState(null, "", window.location.pathname);
        }

        fetchUserData();
      }
    }
  }, [fetchUserData]);

  // Use the flexible auth check hook
  const { isAuthChecking, isAuthenticated } = useAuthCheck({
    redirectTo: "/login",
    autoRedirect: true,
    fetchUserData: false, // We handle user data fetching manually due to OAuth logic
    onAuthenticated: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("analysisResultId");
      }
      fetchUserData();
    },
    onUnauthenticated: () => {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    },
  });

  // Enhanced download dengan progress tracking seperti PDF preview
  const handleDownloadStory = useCallback(
    async (resultId: string) => {
      if (!resultId) return;

      setGeneratingStoryIds((prev) => new Set(prev).add(resultId));
      setStoryProgress((prev) => new Map(prev).set(resultId, 0));
      setDownloadError(null);

      try {
        // Simulate progress untuk UX yang lebih baik
        const progressInterval = setInterval(() => {
          setStoryProgress((prev) => {
            const currentProgress = prev.get(resultId) || 0;
            if (currentProgress >= 90) return prev;
            return new Map(prev).set(
              resultId,
              currentProgress + Math.random() * 15
            );
          });
        }, 500);

        // Pre-cache data jika belum ada
        setStoryProgress((prev) => new Map(prev).set(resultId, 20));

        // Optimized API call dengan timeout
        const timeoutDuration = connectionQuality === "slow" ? 60000 : 30000;
        const downloadPromise = generateStory(resultId);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Download timeout")),
            timeoutDuration
          )
        );

        const result = await Promise.race([downloadPromise, timeoutPromise]);

        clearInterval(progressInterval);
        setStoryProgress((prev) => new Map(prev).set(resultId, 100));

        if (result && (result as StoryGenerationResult).data) {
          const resultData = (result as StoryGenerationResult).data;
          const resultType =
            (result as StoryGenerationResult).type || "image/png";

          // Convert Uint8Array to ArrayBuffer for Blob compatibility
          const arrayBuffer = resultData.buffer.slice(
            resultData.byteOffset,
            resultData.byteOffset + resultData.byteLength
          ) as ArrayBuffer;

          const blob = new Blob([arrayBuffer], { type: resultType });
          const file = new File([blob], `story-tiebymin-${Date.now()}.png`, {
            type: resultType,
          });

          // Optimized blob handling
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name;
          link.style.display = "none";

          document.body.appendChild(link);
          link.click();

          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);

          showToast("Story berhasil diunduh!", "success");
        }
      } catch (error) {
        setStoryProgress((prev) => {
          const newMap = new Map(prev);
          newMap.delete(resultId);
          return newMap;
        });

        let errorMessage = "Terjadi kesalahan saat mendownload story";

        if (error instanceof Error) {
          if (error.message.includes("timeout")) {
            errorMessage =
              connectionQuality === "slow"
                ? "Download timeout. Silakan coba lagi dengan koneksi yang lebih stabil."
                : "Download timeout. Silakan coba lagi.";
          } else if (
            error.message.includes("network") ||
            error.message.includes("ERR_CONTENT_DECODING_FAILED")
          ) {
            errorMessage =
              "Masalah koneksi atau encoding. Silakan cek internet dan coba lagi.";
          } else if (error.message.includes("Invalid")) {
            errorMessage = "File story tidak valid. Silakan coba lagi.";
          } else {
            errorMessage = error.message;
          }
        }

        setDownloadError(errorMessage);
        showToast(errorMessage, "error");

        // Auto clear error setelah 5 detik
        setTimeout(() => setDownloadError(null), 5000);
      } finally {
        setGeneratingStoryIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(resultId);
          return newSet;
        });

        // Clear progress after completion
        setTimeout(() => {
          setStoryProgress((prev) => {
            const newMap = new Map(prev);
            newMap.delete(resultId);
            return newMap;
          });
        }, 2000);
      }
    },
    [generateStory, connectionQuality, showToast]
  );

  // Helper function to check if a specific story is generating
  const isGeneratingSpecificStory = (resultId: string) => {
    return generatingStoryIds.has(resultId);
  };

  // Helper function to get progress for a specific story
  const getStoryProgress = (resultId: string) => {
    return storyProgress.get(resultId) || 0;
  };

  // Show loading while checking authentication or fetching user data
  if (isAuthChecking || isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-[#f0f0f0] min-h-screen w-full font-poppins text-[#323232]">
        <Navbar />
        <main className="lg:px-[200px] px-4 mt-[20px] lg:mt-[50px] flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f0f0] min-h-screen w-full font-poppins text-[#323232]">
      <Navbar />
      <main className="container mx-auto px-4 pt-[100px] lg:pt-[190px]">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] lg:gap-[50px] mb-[20px]">
          <Card className="lg:col-span-1 rounded-2xl border flex flex-col items-center justify-center text-center p-6">
            <Image
              src={"/flower-profile.png"}
              alt="Analysis Result"
              width={204}
              height={204}
              className="h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] md:h-[180px] md:w-[180px] lg:h-[204px] lg:w-[204px] object-cover rounded-full"
              loading="lazy"
            />
            <input
              defaultValue={userProfile?.user_full_name || "User"}
              className="w-full text-center font-bold text-[24px] lg:text-[36px] border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:border-gray-600 focus:outline-none focus:ring-0"
            />
            <div className="flex flex-row gap-4 items-center lg:flex-col w-full">
              <button className="py-2 border w-full rounded-lg border-[#EF789B] text-[#EF789B] hover:bg-[#EF789B] hover:text-[#f0f0f0]">
                Reset Password
              </button>
              <button
                onClick={() => logout()}
                className="w-full py-2 text-[#f0f0f0] font-bold font-poppins rounded-lg bg-[#EF789B] hover:bg-pink-500"
              >
                Log Out
              </button>
            </div>
          </Card>

          <div className="w-full lg:col-span-2">
            <div className="flex flex-col w-full gap-[20px] lg:gap-[50px] h-full">
              <h1 className="hidden lg:block font-oswald text-4xl md:text-5xl font-bold text-[#323232]">
                Selamat datang, {userProfile?.user_first_name || "User"}!
              </h1>
              <p className="hidden lg:block text-[#323232] text-xl font-poppins">
                Temukan versi terbaik dirimu dengan sentuhan teknologi AI. Mulai
                dari bentuk wajah, warna kulit, bentuk tubuh hingga rekomendasi
                produk terbaik. Semuanya kami analisis untuk bantu kamu tampil
                lebih percaya diri dalam setiap aktivitas kamu.
              </p>
              <div className="bg-[#323232] bg-[url('/card-bg.webp')] text-[#f0f0f0] rounded-2xl shadow-xl p-6 flex flex-col items-center justify-between gap-6 flex-1">
                <div className="text-center md:text-left">
                  <h3 className="font-handlee italic text-4xl md:text-5xl mt-5">
                    Mulai Analisis Kecantikan Kamu
                  </h3>
                </div>
                <Button
                  onClick={() =>
                    router.push("/register?startStep=measurements")
                  }
                  className="bg-[#EF789B] hover:bg-pink-500 text-[#f0f0f0] font-bold rounded-lg text-lg w-full md:w-auto shrink-0 py-5 px-8 mb-5"
                >
                  <div className="">
                    <svg
                      width="31"
                      height="31"
                      viewBox="0 0 31 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21.8172 2.34371C21.5108 2.91585 21.2001 3.50085 20.5851 4.11585C19.9701 4.73085 19.3851 5.04157 18.8108 5.348C18.4036 5.56228 18.0029 5.77657 17.6001 6.09371C17.4229 6.23133 17.2796 6.40761 17.181 6.60909C17.0824 6.81056 17.0311 7.0319 17.0311 7.25621C17.0311 7.48052 17.0824 7.70186 17.181 7.90334C17.2796 8.10481 17.4229 8.28109 17.6001 8.41871C18.0029 8.73585 18.4036 8.95014 18.8108 9.16657C19.3851 9.47085 19.9722 9.78157 20.5872 10.3966C21.2022 11.0116 21.5129 11.5966 21.8172 12.1709C22.0315 12.578 22.2458 12.9787 22.5629 13.3816C22.7005 13.5591 22.8769 13.7028 23.0786 13.8016C23.2803 13.9005 23.5019 13.9519 23.7265 13.9519C23.9511 13.9519 24.1727 13.9005 24.3744 13.8016C24.5761 13.7028 24.7525 13.5591 24.8901 13.3816C25.2072 12.9787 25.4193 12.578 25.6358 12.1709C25.9401 11.5966 26.2508 11.0116 26.8658 10.3966C27.4808 9.78157 28.0658 9.47085 28.6401 9.16657C29.0472 8.95014 29.4501 8.738 29.8529 8.41871C30.03 8.28109 30.1734 8.10481 30.272 7.90334C30.3706 7.70186 30.4218 7.48052 30.4218 7.25621C30.4218 7.0319 30.3706 6.81056 30.272 6.60909C30.1734 6.40761 30.03 6.23133 29.8529 6.09371C29.4725 5.80828 29.0665 5.55865 28.6401 5.348C28.0658 5.04157 27.4829 4.73085 26.8658 4.11585C26.2486 3.50085 25.9401 2.91585 25.6358 2.34157C25.4193 1.93443 25.2072 1.53371 24.8901 1.13085C24.7525 0.95333 24.5761 0.809642 24.3744 0.710791C24.1727 0.61194 23.9511 0.560547 23.7265 0.560547C23.5019 0.560547 23.2803 0.61194 23.0786 0.710791C22.8769 0.809642 22.7005 0.95333 22.5629 1.13085C22.2458 1.53371 22.0336 1.93657 21.8172 2.34371ZM15.9458 10.523C15.4003 10.0984 14.97 9.54394 14.6941 8.91019C14.4182 8.27644 14.3056 7.58365 14.3665 6.89514C13.705 6.85851 13.0426 6.83993 12.3801 6.83943C10.4301 6.83943 8.53149 7.01728 6.72935 7.21871C5.24932 7.38811 3.87061 8.05482 2.8188 9.10974C1.767 10.1647 1.10437 11.5453 0.939346 13.0259C0.746489 14.8194 0.579346 16.703 0.579346 18.6401C0.579346 20.5751 0.746489 22.4587 0.939346 24.2523C1.10437 25.7328 1.767 27.1135 2.8188 28.1684C3.87061 29.2233 5.24932 29.89 6.72935 30.0594C8.52935 30.2609 10.4279 30.4387 12.3801 30.4387C14.3301 30.4387 16.2286 30.2609 18.0308 30.0594C19.5108 29.89 20.8895 29.2233 21.9413 28.1684C22.9931 27.1135 23.6558 25.7328 23.8208 24.2523C24.0136 22.4587 24.1786 20.5751 24.1786 18.638C24.1772 17.9551 24.1586 17.2794 24.1229 16.6109C23.4289 16.6785 22.729 16.5696 22.0884 16.2943C21.4477 16.0189 20.8871 15.586 20.4586 15.0359C20.0636 14.5143 19.7171 13.9577 19.4236 13.373L19.3272 13.193C19.166 12.8593 18.9518 12.5539 18.6929 12.2887C18.4255 12.0325 18.1205 11.8187 17.7886 11.6544L17.6065 11.558C17.0225 11.2644 16.4666 10.9179 15.9458 10.523ZM16.7708 24.4301C17.6579 25.1544 18.3479 26.0844 18.7851 27.1301C18.4493 27.273 18.0965 27.3659 17.7265 27.4087C15.9479 27.6059 14.1693 27.7709 12.3715 27.7709C10.5758 27.7709 8.7972 27.6059 7.01863 27.4066C6.65985 27.3659 6.30856 27.275 5.97506 27.1366C6.42506 26.0951 7.11935 25.1351 7.98292 24.428C9.22278 23.415 10.7747 22.8616 12.3758 22.8616C13.9769 22.8616 15.5288 23.415 16.7686 24.428M12.3758 20.5859C14.8401 20.5859 16.2286 19.1994 16.2286 16.7351C16.2286 14.2709 14.8422 12.8844 12.3779 12.8844C9.91363 12.8844 8.5272 14.2709 8.5272 16.7351C8.5272 19.1994 9.91363 20.5859 12.3779 20.5859"
                        fill="#F0F0F0"
                      />
                    </svg>
                  </div>
                  <p className="font-poppins">Mulai Analisa</p>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Bagian Riwayat Tes */}
        <section className="flex flex-col gap-[20px] lg:gap-[50px] mt-0 lg:mt-[50px]">
          <div className="flex flex-col gap-4">
            <h2 className="font-oswald text-3xl md:text-4xl font-bold text-[#323232]">
              Test History
            </h2>
          </div>
          <p className="text-[#323232] font-poppins">
            Yuk intip lagi hasil analisa yang pernah kamu lakukan. Semua hasil
            dari analisa kamu tersimpan rapi di sini. Siapa tahu kamu menemukan
            kembali inspirasi warna, bentuk hijab, atau gaya yang bikin
            penampilanmu semakin memukau setiap hari.
          </p>

          <div className="overflow-x-auto rounded-2xl">
            <Table className="border-0">
              <TableHeader className="border-0">
                <TableRow className="bg-[#FFC6C6] rounded-2xl shadow-md border-0">
                  <TableHead className="text-[#323232] font-bold text-base pl-10 rounded-l-2xl py-4 border-0">
                    Date
                  </TableHead>
                  <TableHead className="text-[#323232] font-bold text-base py-4 border-0">
                    Preview
                  </TableHead>
                  <TableHead className="text-[#323232] font-bold text-base rounded-r-2xl py-4 border-0">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginationData.currentItems.length > 0 ? (
                  paginationData.currentItems.map((item, index) => (
                    <TableRow
                      key={item.analysis_id || index}
                      className="border-b-[#323232]/20"
                    >
                      <TableCell className="font-medium py-4 pl-10">
                        {item.analysis_date
                          ? shortenMonth(item.analysis_date)
                          : "N/A"}
                      </TableCell>
                      <TableCell className="py-4">
                        <Button
                          variant="outline"
                          className="rounded-lg border-gray-300"
                          onClick={() =>
                            router.push(
                              `/ai-overview?result_id=${item.analysis_id}`
                            )
                          }
                        >
                          <div>
                            <svg
                              width="21"
                              height="25"
                              viewBox="0 0 21 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20.5 21.9875V8.5375C20.5 7.875 20.2375 7.2375 19.7625 6.775L13.725 0.7375C13.2625 0.2625 12.625 0 11.9625 0H3C1.625 0 0.5125 1.125 0.5125 2.5L0.5 22.5C0.5 23.875 1.6125 25 2.9875 25H18C18.5625 25 19.0625 24.8125 19.4875 24.5L13.95 18.9625C12.875 19.6625 11.5875 20.0625 10.2 19.9875C7.2375 19.85 4.7 17.5375 4.3 14.6C4.16799 13.6237 4.26805 12.63 4.59207 11.6995C4.91609 10.7691 5.45493 9.92822 6.16485 9.24509C6.87477 8.56196 7.73577 8.05584 8.67796 7.76784C9.62014 7.47983 10.617 7.41805 11.5875 7.5875C14.025 8 16.05 9.9 16.5875 12.3125C17 14.1375 16.6 15.8375 15.7125 17.1875L20.5 21.9875ZM6.75 13.75C6.75 15.825 8.425 17.5 10.5 17.5C12.575 17.5 14.25 15.825 14.25 13.75C14.25 11.675 12.575 10 10.5 10C8.425 10 6.75 11.675 6.75 13.75Z"
                                fill="black"
                              />
                            </svg>
                          </div>
                          <p className="hidden sm:block">Lihat Hasil Analisa</p>
                          <p className="sm:hidden">Lihat</p>
                        </Button>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-8">
                          <Button
                            className="bg-[#EF789B] hover:bg-pink-500 rounded-lg shadow-md"
                            onClick={() =>
                              router.push(
                                `/ai-overview/pdf/preview?result_id=${item.analysis_id}`
                              )
                            }
                          >
                            <Download className="h-4 w-4 text-[#f0f0f0]" />
                            <p className="hidden sm:block text-[#f0f0f0] ml-2">
                              Download
                            </p>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-lg border-gray-300 relative min-w-[44px] min-h-[44px]"
                            onClick={() =>
                              handleDownloadStory(item.analysis_id)
                            }
                            disabled={isGeneratingSpecificStory(
                              item.analysis_id
                            )}
                          >
                            {isGeneratingSpecificStory(item.analysis_id) ? (
                              <div className="flex flex-col items-center gap-1">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#EF789B] border-t-transparent" />
                                <span className="text-xs text-[#EF789B] font-bold">
                                  {getStoryProgress(item.analysis_id) > 0
                                    ? `${Math.round(
                                        getStoryProgress(item.analysis_id)
                                      )}%`
                                    : "Memproses..."}
                                </span>
                              </div>
                            ) : (
                              <Share2 className="h-5 w-5" />
                            )}

                            {/* Progress bar overlay - more visible */}
                            {isGeneratingSpecificStory(item.analysis_id) &&
                              getStoryProgress(item.analysis_id) > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 rounded-b-lg overflow-hidden">
                                  <div
                                    className="h-full bg-[#EF789B] transition-all duration-300 ease-out rounded-b-lg"
                                    style={{
                                      width: `${getStoryProgress(
                                        item.analysis_id
                                      )}%`,
                                    }}
                                  />
                                </div>
                              )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-gray-500"
                    >
                      {paginationData.totalItems === 0
                        ? "Belum ada riwayat analisa"
                        : `Tidak ada data di halaman ${currentPage}`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Pagination Section - Ditampilkan hanya jika ada lebih dari 1 halaman */}
        {paginationData.totalPages > 1 && (
          <section className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent className="gap-2">
                {generatePageNumbers.map((page, index) => (
                  <PaginationItem key={`${page}-${index}`}>
                    {page === -1 ? (
                      // Ellipsis placeholder
                      <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className={`rounded-md cursor-pointer ${
                          page === currentPage
                            ? "bg-[#EF789B] text-[#f0f0f0] border-0 hover:bg-[#EF789B]/90 hover:text-[#f0f0f0]"
                            : "bg-[#323232]/10 text-[#323232] hover:bg-[#EF789B]/10"
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>
          </section>
        )}

        {/* Enhanced error handling seperti PDF preview */}
        {downloadError && (
          <div className="fixed bottom-4 right-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md shadow-lg flex items-center justify-between">
            <span className="text-sm">{downloadError}</span>
            <Button
              onClick={() => setDownloadError(null)}
              variant="ghost"
              size="sm"
              className="text-red-700 hover:bg-red-200 ml-2"
            >
              ✕
            </Button>
          </div>
        )}

        {/* Connection quality indicator */}
        {connectionQuality === "slow" && (
          <div className="fixed bottom-4 left-4 p-2 bg-amber-100 border border-amber-400 text-amber-700 rounded-lg max-w-md shadow-lg">
            ⚠️ Koneksi lambat terdeteksi. Download mungkin membutuhkan waktu
            lebih lama.
          </div>
        )}

        {/* Global progress indicator when any story is generating */}
        {generatingStoryIds.size > 0 && (
          <div className="fixed top-4 right-4 p-3 bg-[#EF789B] text-white rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                Membuat Story... ({generatingStoryIds.size})
              </span>
              <span className="text-xs opacity-90">
                {Array.from(generatingStoryIds)
                  .map((id) => `${Math.round(getStoryProgress(id) || 0)}%`)
                  .join(", ")}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
