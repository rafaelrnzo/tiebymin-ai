import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const resultId = url.searchParams.get("result_id");

    const pdfUrl = new URL("/ai-overview/pdf", req.nextUrl.origin);
    pdfUrl.searchParams.set("print", "true");
    if (resultId) {
      pdfUrl.searchParams.set("result_id", resultId);
    }

    // Determine if running on Vercel
    const isVercel = !!process.env.VERCEL_ENV;
    let puppeteer;
    // Define launch options with proper typing
    let launchOptions: { 
      headless: boolean; 
      args?: string[];
      executablePath?: string;
    } = {
      headless: true,
    };
    
    // Use different puppeteer setup based on environment
    if (isVercel) {
      const chromium = (await import("@sparticuz/chromium")).default;
      puppeteer = await import("puppeteer-core");
      launchOptions = {
        ...launchOptions,
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      };
    } else {
      puppeteer = await import("puppeteer");
    }
    
    // Launch puppeteer
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    // Navigate to the page and wait for content to load
    await page.goto(pdfUrl.toString(), {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });

    // Wait for specific content to ensure everything is loaded
    await page.waitForSelector("#pdf-content");

    // Generate PDF with high quality settings
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      preferCSSPageSize: true,
    });

    await browser.close();

    // Convert Buffer to Blob which is a valid BodyInit type
    // Create a proper Uint8Array from the Buffer to ensure compatibility
    const uint8Array = new Uint8Array(pdf);
    const blob = new Blob([uint8Array], { type: "application/pdf" });

    // Return the PDF with appropriate headers
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=hasil-analisa-lengkap.pdf",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
