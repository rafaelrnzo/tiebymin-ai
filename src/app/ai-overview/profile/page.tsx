"use client";

import { Navbar } from "@/components/component-landing/navbar";
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
import { Download, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";
import { useGenerateStory } from "@/hooks/useAnalysisData";
import { useToast } from "@/hooks/useToast";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import DashboardSkeleton from "@/components/skeleton-loading/profile-skeleton";

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
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

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
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userToken", accessToken); // For backward compatibility

        document.cookie = `auth=${accessToken}; path=/; max-age=86400`;

        // Clean the URL (remove query params and hash)
        window.history.replaceState(null, "", window.location.pathname);

        fetchUserData();
      }
    }
  }, [fetchUserData]);

  // Use the flexible auth check hook
  const { isAuthChecking, isAuthenticated } = useAuthCheck({
    redirectTo: "/register",
    autoRedirect: true,
    fetchUserData: false, // We handle user data fetching manually due to OAuth logic
    onAuthenticated: () => {
      console.log("User authenticated successfully in profile page");
      localStorage.removeItem("analysisResultId");
      fetchUserData();
    },
    onUnauthenticated: () => {
      console.log("User not authenticated, redirecting to register");
    },
  });

  const handleDownloadStory = async (resultId: string) => {
    if (!resultId) return;
    setIsGeneratingStory(true);

    try {
      console.log("Starting story generation for result ID:", resultId);

      const result = await generateStory(resultId);
      console.log("Story generation result:", result);

      // Check if result exists and has data
      if (result && result.data) {
        console.log("Story data received, size:", result.data.byteLength);

        const imageData = result.data;
        const file = new File([imageData], `story-tiebymin-${Date.now()}.png`, {
          type: "image/png",
        });

        console.log("File created:", file.name, file.size, "bytes");

        // Check if Web Share API is available and can share files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Tie By Min Story",
              text: "Coba AI Fashion Analysis aku!",
            });
            console.log("Story shared successfully");
            showToast("Story berhasil dibagikan!", "success");
          } catch (shareError) {
            console.log("Share failed, falling back to download:", shareError);
            // Fallback to download
            const url = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link); // Add to DOM for better compatibility
            link.click();
            document.body.removeChild(link); // Clean up
            URL.revokeObjectURL(url);
            console.log("Story downloaded successfully");
            showToast("Story berhasil diunduh!", "success");
          }
        } else {
          console.log("Web Share API not available, downloading directly");
          // Direct download
          const url = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name;
          document.body.appendChild(link); // Add to DOM for better compatibility
          link.click();
          document.body.removeChild(link); // Clean up
          URL.revokeObjectURL(url);
          console.log("Story downloaded successfully");
          showToast("Story berhasil diunduh!", "success");
        }
      } else {
        console.error("No story data received in result:", result);
        throw new Error("No story data received from server");
      }
    } catch (error) {
      console.error("Story generation error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("Error details:", {
        message: err?.message,
        stack: err?.stack,
        response: err?.response,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
      });

      showToast(
        `Gagal membuat story: ${err?.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setIsGeneratingStory(false);
    }
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
          <h2 className="font-oswald text-3xl md:text-4xl font-bold text-[#323232]">
            Test History
          </h2>
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
                {analysisHistory.length > 0 ? (
                  analysisHistory.map((item, index) => (
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
                            className="rounded-lg border-gray-300"
                            onClick={() =>
                              handleDownloadStory(item.analysis_id)
                            }
                            disabled={isGeneratingStory}
                          >
                            <Share2 className="h-4 w-4" />
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
                      Belum ada riwayat analisa
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  className="bg-[#EF789B] text-[#f0f0f0] border-0 hover:bg-[#EF789B]/90 hover:text-[#f0f0f0] rounded-md"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="rounded-md bg-[#323232]/10 text-[#f0f0f0]"
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="rounded-md bg-[#323232]/10 text-[#f0f0f0]"
                >
                  3
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </main>
    </div>
  );
}
