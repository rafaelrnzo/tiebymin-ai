import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge'; // Gunakan Edge Runtime untuk performa lebih baik

export async function POST(req: NextRequest) {
  try {
    // Dapatkan result_id dari request jika ada
    const url = new URL(req.url);
    const resultId = url.searchParams.get("result_id") || "";
    
    // Redirect ke halaman story dengan parameter untuk menampilkan versi cetak
    // dan tambahkan parameter download=true untuk memicu unduhan di browser
    const storyUrl = new URL("/ai-overview/story", req.nextUrl.origin);
    storyUrl.searchParams.set("print", "true");
    storyUrl.searchParams.set("download", "true");
    
    // Tambahkan result_id jika ada
    if (resultId) {
      storyUrl.searchParams.set("result_id", resultId);
    }
    
    // Alih-alih membuat PNG di server, kita redirect ke halaman yang akan
    // memicu browser untuk mengunduh gambar
    return NextResponse.redirect(storyUrl.toString(), {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error redirecting to story page:", error);
    return new NextResponse("Failed to generate PNG", { status: 500 });
  }
}
