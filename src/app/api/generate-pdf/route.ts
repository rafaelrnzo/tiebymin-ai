import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return await generatePdf(req);
}

export async function GET(req: NextRequest) {
  return await generatePdf(req);
}

async function generatePdf(req: NextRequest) {
  try {
    let resultId, firstName;
    
    // Cek metode request
    if (req.method === 'POST') {
      // Untuk POST, ambil data dari body
      try {
        const body = await req.json();
        resultId = body.resultId;
        firstName = body.firstName;
      } catch (e) {
        console.error('Error parsing JSON body:', e);
      }
    }
    
    // Jika tidak ada data dari body atau metode GET, coba ambil dari URL query
    if (!resultId) {
      resultId = req.nextUrl.searchParams.get('resultId');
    }
    
    if (!firstName) {
      firstName = req.nextUrl.searchParams.get('firstName');
    }

    const pdfUrl = new URL("/ai-overview/pdf", req.nextUrl.origin);
    pdfUrl.searchParams.set("print", "true");
    if (resultId) {
      pdfUrl.searchParams.set("result_id", resultId);
    }

    const userName = firstName || "User";
    pdfUrl.searchParams.set("userName", userName); 

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
      width: 800,
      height: 1600,
      deviceScaleFactor: 1,
    });

    await page.goto(pdfUrl.toString(), {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000,
    });

    // Wait for images to load - increased time for all images
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      await page.waitForSelector("#pdf-content", { timeout: 15000 });
    } catch (error) {
      console.warn(
        `PDF content selector not found, continuing anyway, ${error}`
      );
    }

    // Wait for product recommendation images to load
    try {
      await page.waitForSelector('img[alt*="Product"]', { timeout: 10000 });
      console.log("Product images found and loaded");
    } catch (error) {
      console.warn("Product images not found within timeout, continuing anyway");
    }

    // Additional wait for dynamic content and images - increased time
    await new Promise(resolve => setTimeout(resolve, 4000));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      // margin: {
      //   top: "20px",
      //   right: "20px",
      //   bottom: "20px",
      //   left: "20px",
      // },
      width: '210mm',
      height: '297mm',
      preferCSSPageSize: true,
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(Buffer.from(pdf), {
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
        details: error instanceof Error ? error.message : String(error),
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
