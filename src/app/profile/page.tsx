import { Navbar } from "@/components/component-landing/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Eye,
  KeyRound,
  LogOut,
  Share2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

// Mock data untuk riwayat tes
const testHistory = [
  { date: "December 20, 2025" },
  { date: "December 20, 2025" },
  { date: "December 20, 2026" },
  { date: "December 20, 2025" },
];

// Komponen Ikon Profil
const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-16 w-16 text-[#EF789B]"
    {...props}
  >
    <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 10c-3.87 0-7 1.79-7 4v2h14v-2c0-2.21-3.13-4-7-4zm7.5-1a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5zm-15 0a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z" />
    <path d="M15.5 6.5a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5zm-7 0a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z" />
  </svg>
);

export default function DashboardPage() {
  return (
    <div className="bg-white min-h-screen w-full font-poppins text-[#333]">
      <Navbar />
      <main className="lg:px-[200px] py-8 sm:py-12 md:py-16">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 md:mb-16">
          <Card className="lg:col-span-1 rounded-2xl border flex flex-col items-center justify-center text-center p-6">
            <Image
              src={"/flower.png"}
              alt="Analysis Result"
              width={100}
              height={100}
              className="h-[100px] w-[100px] object-cover rounded-full"
              loading="lazy"
            />{" "}
            <h2 className="font-oswald text-2xl font-semibold mt-4">
              Winona Karamoy
            </h2>
            <div className="w-full mt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-lg border-[#EF789B] text-[#EF789B] hover:bg-[#EF789B] hover:text-white"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
              <Button
                variant="destructive"
                className="w-full rounded-lg bg-[#EF789B] hover:bg-pink-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </Card>

          {/* Konten Selamat Datang dan Kartu Analisis */}
          <div className="w-full lg:col-span-2 space-y-[9rem]">
            <div className="flex flex-col gap-14 w-full">
              <h1 className="font-oswald text-4xl md:text-5xl font-bold text-gray-800">
                Selamat datang, Wilona!
              </h1>
              <p className="mt-2 text-gray-600">
                Temukan versi terbaik dirimu dengan sentuhan teknologi AI. Mulai
                dari bentuk wajah, warna kulit, bentuk tubuh hingga rekomendasi
                produk terbaik. Semuanya kami analisis untuk bantu kamu tampil
                lebih percaya diri dalam setiap aktivitas kamu.
              </p>
            </div>
            {/* Kartu Mulai Analisis */}
            <Card className="bg-[#323232] bg-[url('/card-bg.png')] mt-auto text-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="font-handlee text-4xl md:text-5xl">
                  Mulai Analisis Kecantikan Kamu
                </h3>
              </div>
              <Button className="bg-[#EF789B] hover:bg-pink-500 text-white font-bold py-6 px-8 rounded-lg text-lg w-full md:w-auto shrink-0">
                <Sparkles className="mr-3 h-6 w-6" />
                Mulai Analisa
              </Button>
            </Card>
          </div>
        </section>

        {/* Bagian Riwayat Tes */}
        <section className="flex flex-col gap-6">
          <h2 className="font-oswald text-3xl md:text-4xl font-bold text-gray-800">
            Test History
          </h2>
          <p className="mt-2 mb-6 text-gray-600">
            Yuk intip lagi hasil analisa yang pernah kamu lakukan. Semua hasil
            dari analisa kamu tersimpan rapi di sini. Siapa tahu kamu menemukan
            kembali inspirasi warna, bentuk hijab, atau gaya yang bikin
            penampilanmu semakin memukau setiap hari.
          </p>

          {/* Tabel Riwayat */}
          <div className="overflow-x-auto rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FFC6C6] hover:bg-[#FFC6C6]/90 rounded">
                  <TableHead className="text-[#323232] font-bold text-base w-[30%]">
                    Date
                  </TableHead>
                  <TableHead className="text-[#323232] font-bold text-base w-[40%]">
                    Preview
                  </TableHead>
                  <TableHead className="text-[#323232] font-bold text-base text-left w-[30%]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testHistory.map((item, index) => (
                  <TableRow key={index} className="border-b border-gray-200">
                    <TableCell className="font-medium py-4">
                      {item.date}
                    </TableCell>
                    <TableCell className="py-4">
                      <Button
                        variant="outline"
                        className="rounded-lg border-gray-300"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Hasil Analisa
                      </Button>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Button className="bg-[#EF789B] hover:bg-pink-500 rounded-lg">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-lg border-gray-300"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Paginasi */}
        <section className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </main>
    </div>
  );
}
