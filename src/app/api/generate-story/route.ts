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

    // Get token from request headers or query params
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

    console.log("Story Generation Debug:", {
      resultId,
      token: token ? "Token provided" : "No token",
      storyUrl: storyUrl.toString()
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
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });

    // Set longer timeout for story generation
    await page.goto(storyUrl.toString(), {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 90000 // Increased timeout
    });

    console.log("Page loaded, waiting for content...");

    // Wait for page to be fully loaded with extended timeout
    await new Promise(resolve => setTimeout(resolve, 8000)); // Increased wait time

    try {
      // Wait for story content with extended timeout
      await page.waitForSelector('#story-content[data-story-ready="true"]', { timeout: 60000 });
      console.log("Story content is ready");

      // Additional wait to ensure all images and resources are loaded
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log("Additional wait completed for story resource loading");
      
      // Wait for images to load
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (page as any).evaluate(() => {
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

          // Fallback timeout for image loading
          setTimeout(() => resolve(void 0), 10000);
        });
      });
      
      console.log("All images loaded");
      
    } catch (error) {
      console.warn(`Story content selector not found or not ready in time: ${error}`);
      
      // Check if page has any content
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hasContent = await (page as any).evaluate(() => {
        const storyElement = document.querySelector('#story-content');
        return !!storyElement && storyElement.children.length > 0;
      });
      
      if (!hasContent) {
        await browser.close();
        return new NextResponse("Story content not found", { status: 404 });
      }
      
      console.log("Story content exists but not marked as ready, proceeding...");
    }

    const element = await page.$("#story-content");

    if (!element) {
      console.error("Story content element not found");
      // Try to find any content on the page as fallback
      const bodyElement = await page.$('body');
      if (!bodyElement) {
        await browser.close();
        return new NextResponse("Could not find any content on the page", { status: 404 });
      }
      console.warn("Using body element as fallback for story generation");
      // Create screenshot of the full page as fallback
      console.log("Creating screenshot of full page as fallback");
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

    console.log("Taking screenshot of story content...");
    const imageBuffer = (await element.screenshot({
      type: "png",
    })) as Buffer;

    await browser.close();
    console.log("Story generation completed successfully");

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
    console.error("Story generation error:", error);
    return new NextResponse(`Failed to generate PNG: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
