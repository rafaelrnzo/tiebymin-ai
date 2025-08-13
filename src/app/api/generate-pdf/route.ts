import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge'; // Gunakan Edge Runtime untuk performa lebih baik

export async function POST(req: NextRequest) {
  try {
    // Redirect ke halaman PDF dengan parameter untuk menampilkan versi cetak
    // dan tambahkan parameter download=true untuk memicu unduhan di browser
    const pdfUrl = new URL("/ai-overview/pdf", req.nextUrl.origin);
    pdfUrl.searchParams.set("print", "true");
    pdfUrl.searchParams.set("download", "true");
    
    // Alih-alih membuat PDF di server, kita redirect ke halaman yang akan
    // memicu browser untuk mencetak/mengunduh PDF
    return NextResponse.redirect(pdfUrl.toString(), {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error redirecting to PDF page:", error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}