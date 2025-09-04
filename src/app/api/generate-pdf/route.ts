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
      try {
        const body = await req.json();
        resultId = body.resultId;
        firstName = body.firstName;
      } catch (e) {
        console.error('Error parsing JSON body:', e);
      }
    }
    
    if (!resultId) {
      resultId = req.nextUrl.searchParams.get('resultId') || req.nextUrl.searchParams.get('result_id');
    }
    
    if (!firstName) {
      firstName = req.nextUrl.searchParams.get('firstName');
    }

    // Get token from request headers or query params
    let token: string | undefined = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      token = req.nextUrl.searchParams.get('token') || req.nextUrl.searchParams.get('accessToken') || undefined;
    }

    const pdfUrl = new URL("/ai-overview/pdf", req.nextUrl.origin);
    pdfUrl.searchParams.set("print", "true");
    if (resultId) {
      pdfUrl.searchParams.set("result_id", resultId);
    }
    if (token) {
      pdfUrl.searchParams.set("token", token);
    }

    const userName = firstName || "User";
    pdfUrl.searchParams.set("userName", userName);

    console.log("PDF Generation Debug:", {
      resultId,
      token: token ? "Token provided" : "No token",
      pdfUrl: pdfUrl.toString()
    });

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
        args: [
          ...chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ],
        executablePath: await chromium.executablePath(),
        headless: true,
      };
    } else {
      puppeteer = await import("puppeteer");
      launchOptions = {
        ...launchOptions,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
        headless: true,
      };
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setViewport({
      width: 800,
      height: 1600,
      deviceScaleFactor: 1,
    });

    // Set longer timeout and better wait conditions
    await page.goto(pdfUrl.toString(), {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 60000,
    });

    // Wait for page to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Initial page load wait completed");

    try {
      // Multiple strategies for waiting for content readiness
      let contentReady = false;
      let attempts = 0;
      const maxAttempts = 15; // 30 seconds total with 2 second intervals

      while (!contentReady && attempts < maxAttempts) {
        attempts++;
        
        try {
          // Strategy 1: Wait for the ideal ready state
          await page.waitForSelector('#pdf-content[data-pdf-ready="true"]', { timeout: 2000 });
          console.log("PDF content marked as ready via data-pdf-ready=true");
          contentReady = true;
          break;
        } catch (readyError) {
          console.log(`Attempt ${attempts}: data-pdf-ready=true not found, trying fallback...`);
        }

        try {
          // Strategy 2: Check if we have basic data
          const hasBasicData = await page.$('#pdf-content[data-has-basic-data="true"]');
          if (hasBasicData) {
            console.log("PDF content has basic data, proceeding");
            contentReady = true;
            break;
          }
        } catch (basicDataError) {
          console.log(`Attempt ${attempts}: Basic data check failed`);
        }

        try {
          // Strategy 3: Check if content exists and loading is complete
          const loadingComplete = await page.$('#pdf-content[data-loading-state="loaded"]');
          if (loadingComplete) {
            console.log("PDF content loading is complete, proceeding");
            contentReady = true;
            break;
          }
        } catch (loadingError) {
          console.log(`Attempt ${attempts}: Loading state check failed`);
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (!contentReady) {
        console.warn("Content readiness check timed out, proceeding with PDF generation anyway");
      }

      // Final check - ensure the element exists at all
      const contentExists = await page.$('#pdf-content');
      if (!contentExists) {
        console.error("Critical Error: #pdf-content element does not exist on the page.");
        const bodyContent = await page.$('body');
        if (!bodyContent) {
          throw new Error("No content found on the page at all.");
        }
        console.log("Using body content as a last resort for PDF generation.");
      }

      // Additional wait for any remaining resources
      console.log("Final wait for resources...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log("Proceeding with PDF generation");
    } catch (error) {
      console.warn(`PDF content preparation failed: ${error}. Attempting to generate PDF anyway.`);
    }

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      width: '210mm',
      height: '297mm',
      preferCSSPageSize: true,
    });

    await browser.close();

    // Return PDF as response
    const pdfBuffer = Buffer.from(pdf);
    
    console.log("PDF Generation: Returning PDF", {
      bufferSize: pdfBuffer.length,
      contentType: "application/pdf"
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=hasil-analisa-lengkap.pdf",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Length": pdfBuffer.length.toString(),
        // Add CORS headers if needed
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
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