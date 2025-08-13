import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const url = new URL("/ai-overview/story?print=true", req.nextUrl.origin);

    await page.goto(url.toString(), {
      waitUntil: "networkidle0",
    });

    // Ambil screenshot sebagai PNG
    const pngBuffer = await page.screenshot({
      type: "png",
      fullPage: true,
    });

    await browser.close();

    // Kembalikan file PNG ke client
    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="hasil-analisa.png"`,
      },
    });
  } catch (error) {
    console.error("Error generating PNG:", error);
    return new NextResponse("Failed to generate PNG", { status: 500 });
  }
}
