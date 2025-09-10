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

    // Adaptive timeout based on connection quality (detected from user agent or headers)
    const userAgent = req.headers.get('user-agent') || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // More aggressive timeouts for mobile/poor connections
    const gotoTimeout = isMobile ? 30000 : 45000;
    const waitTimeout = isMobile ? 1000 : 1500;
    const maxWaitAttempts = isMobile ? 8 : 12; // Fewer attempts for mobile

    // Use more lenient waitUntil for mobile to avoid hanging
    await page.goto(pdfUrl.toString(), {
      waitUntil: isMobile ? 'domcontentloaded' : ['networkidle0', 'domcontentloaded'],
      timeout: gotoTimeout,
    });
  
    // Even shorter initial wait for mobile
    await new Promise(resolve => setTimeout(resolve, waitTimeout));

    try {
      // Multiple strategies for waiting for content readiness
      let contentReady = false;
      let attempts = 0;
      const maxAttempts = isMobile ? 8 : 15; // Reduced for mobile (16s vs 30s)

      while (!contentReady && attempts < maxAttempts) {
        attempts++;
        
        try {
          // Strategy 1: Wait for the ideal ready state
          await page.waitForSelector('#pdf-content[data-pdf-ready="true"]', { timeout: 2000 });
          contentReady = true;
          break;
        } catch (readyError) {
        }

        try {
          // Strategy 2: Check if we have basic data
          const hasBasicData = await page.$('#pdf-content[data-has-basic-data="true"]');
          if (hasBasicData) {
            contentReady = true;
            break;
          }
        } catch (basicDataError) {
        }

        try {
          // Strategy 3: Check if content exists and loading is complete
          const loadingComplete = await page.$('#pdf-content[data-loading-state="loaded"]');
          if (loadingComplete) {
            contentReady = true;
            break;
          }
        } catch (loadingError) {
        }

        // Shorter intervals for mobile
        const interval = isMobile ? 1500 : 2000;
        await new Promise(resolve => setTimeout(resolve, interval));
      }

      if (!contentReady) {
      }

      // Final check - ensure the element exists at all
      const contentExists = await page.$('#pdf-content');
      if (!contentExists) {
        const bodyContent = await page.$('body');
        if (!bodyContent) {
          throw new Error("No content found on the page at all.");
        }
      }

      // Shorter additional wait for mobile
      const additionalWait = isMobile ? 1500 : 3000;
      await new Promise(resolve => setTimeout(resolve, additionalWait));
      
    } catch (error) {
    }

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      width: isMobile ? '190mm' : '210mm', // Slightly smaller for mobile optimization
      height: '297mm',
      preferCSSPageSize: true,
      scale: isMobile ? 0.9 : 1.0, // Reduced scale for mobile
    });

    await browser.close();

    // Return PDF as response
    const pdfBuffer = Buffer.from(pdf);
    

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