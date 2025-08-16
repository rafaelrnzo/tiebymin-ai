import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return await generateStory(req);
}

export async function GET(req: NextRequest) {
  return await generateStory(req);
}

async function generateStory(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const resultId = url.searchParams.get("result_id");

    const storyUrl = new URL("/ai-overview/story", req.nextUrl.origin);
    if (resultId) {
      storyUrl.searchParams.set("result_id", resultId);
    }
    storyUrl.searchParams.set("print", "true");
    
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
    
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
    await page.goto(storyUrl.toString(), { waitUntil: "networkidle0" });

    await page.waitForSelector("#story-content");
    const element = await page.$("#story-content");

    if (!element) {
      throw new Error("Could not find element #story-content");
    }

    const imageBuffer = (await element.screenshot({
      type: "png",
    })) as Buffer; // pastikan di-cast jadi Buffer

    await browser.close();

    return new NextResponse(
      new Uint8Array(imageBuffer), // konversi aman dari Buffer
      {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": "attachment; filename=hasil-analisa.png",
        },
      }
    );
  } catch (error) {
    console.error("Error generating story PNG:", error);
    return new NextResponse("Failed to generate PNG", { status: 500 });
  }
}
