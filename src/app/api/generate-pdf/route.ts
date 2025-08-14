import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resultId } = body;

    const pdfUrl = new URL("/ai-overview/pdf", req.nextUrl.origin);
    pdfUrl.searchParams.set("print", "true");
    if (resultId) {
      pdfUrl.searchParams.set("result_id", resultId);
    }

    const isVercel = !!process.env.VERCEL_ENV;
    let puppeteer;
    let launchOptions: {
      headless: boolean;
      args?: string[];
      executablePath?: string;
    } = {
      headless: true,
    };

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

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    await page.goto(pdfUrl.toString(), {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000, 
    });

    try {
      await page.waitForSelector("#pdf-content", { timeout: 10000 });
    } catch (error) {
      console.warn(
        `PDF content selector not found, continuing anyway, ${error}`
      );
    }

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

    // Return PDF as response
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=hasil-analisa-lengkap.pdf",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Length": pdf.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
