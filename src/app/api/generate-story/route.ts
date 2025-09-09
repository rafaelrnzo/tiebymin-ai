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

    let token: string | undefined = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      token = req.nextUrl.searchParams.get('token') || req.nextUrl.searchParams.get('accessToken') || undefined;
    }

    const storyUrl = new URL("/ai-overview/story", req.nextUrl.origin);
    if (resultId) {
      storyUrl.searchParams.set("result_id", resultId);
    }
    if (token) {
      storyUrl.searchParams.set("token", token);
    }
    storyUrl.searchParams.set("print", "true");

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
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });

    await page.goto(storyUrl.toString(), {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 90000
    });

    await new Promise(resolve => setTimeout(resolve, 8000));

    try {
      await page.waitForSelector('#story-content[data-story-ready="true"]', { timeout: 60000 });

      await new Promise(resolve => setTimeout(resolve, 5000));

      await (page as unknown as { evaluate: (fn: () => Promise<void>) => Promise<void> }).evaluate(() => {
        return new Promise((resolve) => {
          const images = Array.from(document.querySelectorAll('img'));
          let loadedCount = 0;
          const totalImages = images.length;

          if (totalImages === 0) {
            resolve(void 0);
            return;
          }

          const checkComplete = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
              resolve(void 0);
            }
          };

          images.forEach((img) => {
            if (img.complete) {
              checkComplete();
            } else {
              img.onload = checkComplete;
              img.onerror = checkComplete;
            }
          });

          setTimeout(() => resolve(void 0), 10000);
        });
      });

    } catch (error) {
      const hasContent = await (page as unknown as { evaluate: (fn: () => boolean) => Promise<boolean> }).evaluate(() => {
        const storyElement = document.querySelector('#story-content');
        return !!storyElement && storyElement.children.length > 0;
      });

      if (!hasContent) {
        await browser.close();
        return new NextResponse("Story content not found", { status: 404 });
      }

    }

    const element = await page.$("#story-content");

    if (!element) {
      const bodyElement = await page.$('body');
      if (!bodyElement) {
        await browser.close();
        return new NextResponse("Could not find any content on the page", { status: 404 });
      }
      const imageBuffer = (await page.screenshot({
        type: "png",
        fullPage: true,
      })) as Buffer;
      await browser.close();
      return new NextResponse(
        new Uint8Array(imageBuffer),
        {
          headers: {
            "Content-Type": "image/png",
            "Content-Disposition": "attachment; filename=hasil-analisa-fallback.png",
          },
        }
      );
    }

    const imageBuffer = (await element.screenshot({
      type: "png",
    })) as Buffer;

    await browser.close();

    return new NextResponse(
      new Uint8Array(imageBuffer),
      {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": "attachment; filename=hasil-analisa.png",
        },
      }
    );
  } catch (error) {
    return new NextResponse(`Failed to generate PNG: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
