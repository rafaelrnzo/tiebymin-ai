import { NextRequest, NextResponse } from "next/server";
import puppeteer from 'puppeteer';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const resultId = url.searchParams.get("result_id");

    const storyUrl = new URL("/ai-overview/story", req.nextUrl.origin);
    if (resultId) {
      storyUrl.searchParams.set("result_id", resultId);
    }
    storyUrl.searchParams.set("print", "true");


    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 }); // Instagram story dimensions
    await page.goto(storyUrl.toString(), { waitUntil: 'networkidle0' });

    await page.waitForSelector('#story-content');
    const element = await page.$('#story-content');

    if (!element) {
      throw new Error("Could not find element #story-content");
    }

    const imageBuffer = await element.screenshot({
      type: 'png'
    });

    await browser.close();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename=hasil-analisa.png',
      },
    });
  } catch (error) {
    console.error("Error generating story PNG:", error);
    return new NextResponse("Failed to generate PNG", { status: 500 });
  }
}
