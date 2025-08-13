import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const url = new URL("/ai-overview/pdf?print=true", req.nextUrl.origin);

    await page.goto(url.toString(), {
      waitUntil: "networkidle0", // Tunggu sampai tidak ada lagi aktivitas jaringan
    });

    // Hasilkan PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    // Konversi buffer Puppeteer ke Buffer Node.js, lalu kirim
    const nodeBuffer = Buffer.from(pdfBuffer);

    return new NextResponse(nodeBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="hasil-analisa-lengkap.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}