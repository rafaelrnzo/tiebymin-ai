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

    // Adaptive timeout based on connection quality
    const userAgent = req.headers.get('user-agent') || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
    // More aggressive timeouts for mobile/poor connections
    const gotoTimeout = isMobile ? 40000 : 60000;
    const waitTimeout = isMobile ? 2000 : 4000;
    const imageWaitTimeout = isMobile ? 5000 : 10000; // Shorter image wait for mobile

    // Use more lenient waitUntil for mobile
    await page.goto(storyUrl.toString(), {
      waitUntil: isMobile ? 'domcontentloaded' : ['networkidle0', 'domcontentloaded'],
      timeout: gotoTimeout
    });
  
    // Shorter initial wait for mobile
    await new Promise(resolve => setTimeout(resolve, waitTimeout));

    try {
      // Shorter selector wait for mobile
      const selectorTimeout = isMobile ? 20000 : 60000;
      await page.waitForSelector('#story-content[data-story-ready="true"]', { timeout: selectorTimeout });
  
      // Shorter post-selector wait for mobile
      const postSelectorWait = isMobile ? 2000 : 5000;
      await new Promise(resolve => setTimeout(resolve, postSelectorWait));
  
      await (page as unknown as { evaluate: (fn: () => Promise<void>) => Promise<void> }).evaluate(() => {
        return new Promise((resolve) => {
          const images = Array.from(document.querySelectorAll('img'));
          let loadedCount = 0;
          const totalImages = images.length;
  
          if (totalImages === 0) {
            resolve(void 0);
            return;
          }
  
          // For mobile/poor connections, don't wait for all images - wait for first 3 or timeout
          const maxImagesToWait = totalImages > 3 ? 3 : totalImages;
          let imagesToLoad = 0;
  
          const checkComplete = () => {
            imagesToLoad++;
            if (imagesToLoad >= maxImagesToWait || loadedCount >= totalImages) {
              resolve(void 0);
            }
          };
  
          images.forEach((img, index) => {
            if (index >= maxImagesToWait) return; // Only wait for first N images on mobile
            
            if (img.complete) {
              loadedCount++;
              checkComplete();
            } else {
              img.onload = checkComplete;
              img.onerror = checkComplete;
            }
          });
  
          // Shorter timeout for mobile
          setTimeout(() => resolve(void 0), imageWaitTimeout);
        });
      });

    } catch (error) {
      console.warn('Story generation timeout, using fallback screenshot');
      
      // For mobile, be more lenient with content check
      const hasContent = await (page as unknown as { evaluate: (fn: () => boolean) => Promise<boolean> }).evaluate(() => {
        const storyElement = document.querySelector('#story-content') || document.querySelector('main') || document.body;
        return !!storyElement && (storyElement.children.length > 0 || storyElement.innerHTML.trim().length > 0);
      });
  
      if (!hasContent) {
        await browser.close();
        return new NextResponse("Story content not found", { status: 404 });
      }

    }

    const element = await page.$("#story-content");

    if (!element) {
      // For mobile, use smaller viewport for screenshot
      const screenshotOptions = isMobile
        ? { type: "png" as const, fullPage: true, omitBackground: true }
        : { type: "png" as const, fullPage: true };
      
      const bodyElement = await page.$('body');
      if (!bodyElement) {
        await browser.close();
        return new NextResponse("Could not find any content on the page", { status: 404 });
      }
      const imageBuffer = (await page.screenshot(screenshotOptions)) as Buffer;
      await browser.close();
      return new NextResponse(
        new Uint8Array(imageBuffer),
        {
          headers: {
            "Content-Type": "image/png",
            "Content-Disposition": `attachment; filename=hasil-analisa-fallback-${isMobile ? 'mobile' : 'desktop'}.png`,
          },
        }
      );
    }

    const screenshotOptions = isMobile
      ? { type: "png" as const, omitBackground: true, clip: { x: 0, y: 0, width: 1080, height: 1920 } }
      : { type: "png" as const };
    
    const imageBuffer = (await element.screenshot(screenshotOptions)) as Buffer;

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
