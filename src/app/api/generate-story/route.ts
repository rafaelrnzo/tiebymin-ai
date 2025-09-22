import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return await generateStory(req);
}

export async function GET(req: NextRequest) {
  return await generateStory(req);
}

async function generateStory(req: NextRequest) {
  const startTime = Date.now();
  console.log("🚀 Starting story generation...");

  try {
    const url = new URL(req.url);
    const resultId = url.searchParams.get("result_id");

    let token: string | undefined = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    if (!token) {
      token =
        req.nextUrl.searchParams.get("token") ||
        req.nextUrl.searchParams.get("accessToken") ||
        undefined;
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
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process", // Faster startup
          "--disable-gpu",
          "--disable-plugins",
          "--disable-extensions",
          "--disable-background-timer-throttling",
          "--disable-renderer-backgrounding",
          "--disable-backgrounding-occluded-windows",
          "--memory-pressure-off",
          "--max_old_space_size=2048", // Reduced memory
          "--disable-features=TranslateUI",
          "--disable-ipc-flooding-protection",
          "--disable-background-networking",
          "--disable-web-security", // Faster loading
          "--disable-features=VizDisplayCompositor",
          "--disable-accelerated-video-decode",
          "--disable-background-media-download",
        ],
        executablePath: await chromium.executablePath(),
        headless: true,
      };
    } else {
      puppeteer = await import("puppeteer");
      launchOptions = {
        ...launchOptions,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
          "--disable-plugins",
          "--disable-extensions",
          "--memory-pressure-off",
          "--max_old_space_size=2048", // Reduced memory
          "--disable-features=TranslateUI",
          "--disable-ipc-flooding-protection",
          "--disable-background-networking",
          "--disable-web-security", // Faster loading
          "--disable-features=VizDisplayCompositor",
          "--disable-accelerated-video-decode",
          "--disable-background-media-download",
        ],
        headless: true,
      };
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // ULTRA FAST: Smart resource blocking for story generation
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      const url = request.url();

      if (resourceType === "image") {
        // Allow ALL images for story generation - critical for user photos
        request.continue();
      } else if (resourceType === "stylesheet") {
        request.continue(); // Allow CSS
      } else if (resourceType === "script") {
        // Allow critical scripts
        if (
          url.includes(req.nextUrl.origin) ||
          url.includes("_next") ||
          url.includes("static")
        ) {
          request.continue();
        } else {
          request.abort(); // Block external scripts for speed
        }
      } else if (resourceType === "font") {
        request.continue(); // Allow fonts
      } else if (resourceType === "media") {
        request.abort(); // Block all media for speed
      } else if (resourceType === "websocket" || resourceType === "other") {
        request.abort(); // Block unnecessary connections
      } else {
        request.continue();
      }
    });

    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });

    // ULTRA FAST: Optimized loading strategy
    const userAgent = req.headers.get("user-agent") || "";
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

    // Ultra-fast timeouts for maximum speed
    const gotoTimeout = isMobile ? 20000 : 30000; // Even faster
    const waitTimeout = isMobile ? 1000 : 2000; // Reduced wait
    const imageWaitTimeout = isMobile ? 3000 : 5000; // Shorter image wait

    // Use fastest loading strategy
    await page.goto(storyUrl.toString(), {
      waitUntil: "domcontentloaded", // Fastest option
      timeout: gotoTimeout,
    });

    // Minimal initial wait
    await new Promise((resolve) => setTimeout(resolve, waitTimeout));

    try {
      // ULTRA FAST: Optimized selector waiting
      const selectorTimeout = isMobile ? 10000 : 20000; // Much faster
      await page.waitForSelector('#story-content[data-story-ready="true"]', {
        timeout: selectorTimeout,
      });

      // Minimal post-selector wait
      const postSelectorWait = isMobile ? 500 : 1000;
      await new Promise((resolve) => setTimeout(resolve, postSelectorWait));

      // ULTRA FAST: Optimized image loading for story generation
      await (
        page as unknown as {
          evaluate: (fn: () => Promise<void>) => Promise<void>;
        }
      ).evaluate(() => {
        return new Promise((resolve) => {
          const allImages = Array.from(document.querySelectorAll("img"));

          // Prioritize story-critical images (user photos, profile images)
          const criticalImages = allImages.filter((img) => {
            const src = img.src.toLowerCase();
            const alt = img.alt?.toLowerCase() || "";
            const className = img.className?.toLowerCase() || "";

            return (
              src.includes("user") ||
              src.includes("photo") ||
              src.includes("profile") ||
              alt.includes("user") ||
              alt.includes("photo") ||
              className.includes("avatar") ||
              className.includes("profile")
            );
          });

          console.log(
            `Found ${criticalImages.length} critical story images out of ${allImages.length} total`
          );

          // Fast path: If critical images are loaded, proceed immediately
          const criticalLoaded = criticalImages.every(
            (img) => img.complete && img.naturalWidth > 0
          );
          if (criticalLoaded) {
            console.log("Critical story images loaded, proceeding immediately");
            resolve(void 0);
            return;
          }

          // Wait for critical images only
          const criticalPromises = criticalImages.map((img, index) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();

            return new Promise((resolveImg) => {
              const timeout = setTimeout(() => {
                console.log(`Critical image ${index} timeout`);
                resolveImg(void 0);
              }, 2000); // Very short timeout for critical images

              img.addEventListener("load", () => {
                clearTimeout(timeout);
                console.log(`Critical image ${index} loaded successfully`);
                resolveImg(void 0);
              });

              img.addEventListener("error", () => {
                clearTimeout(timeout);
                console.log(`Critical image ${index} failed to load`);
                resolveImg(void 0);
              });
            });
          });

          // Also wait for a few general images to ensure content is ready
          const generalImages = allImages
            .filter((img) => !criticalImages.includes(img))
            .slice(0, 2);
          const generalPromises = generalImages.map((img, index) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();

            return new Promise((resolveImg) => {
              const timeout = setTimeout(() => resolveImg(void 0), 1000);
              img.addEventListener("load", () => {
                clearTimeout(timeout);
                resolveImg(void 0);
              });
              img.addEventListener("error", () => {
                clearTimeout(timeout);
                resolveImg(void 0);
              });
            });
          });

          // Wait for all promises with a global timeout
          Promise.all([...criticalPromises, ...generalPromises])
            .then(() => {
              console.log("All story images ready");
              resolve(void 0);
            })
            .catch(() => {
              console.log("Some story images failed, continuing...");
              resolve(void 0);
            });

          // Global timeout
          setTimeout(() => {
            console.log("Story image loading timeout, proceeding...");
            resolve(void 0);
          }, imageWaitTimeout);
        });
      });
    } catch (error) {
      console.warn("Story generation timeout, using fallback screenshot");

      // For mobile, be more lenient with content check
      const hasContent = await (
        page as unknown as { evaluate: (fn: () => boolean) => Promise<boolean> }
      ).evaluate(() => {
        const storyElement =
          document.querySelector("#story-content") ||
          document.querySelector("main") ||
          document.body;
        return (
          !!storyElement &&
          (storyElement.children.length > 0 ||
            storyElement.innerHTML.trim().length > 0)
        );
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

      const bodyElement = await page.$("body");
      if (!bodyElement) {
        await browser.close();
        return new NextResponse("Could not find any content on the page", {
          status: 404,
        });
      }
      const imageBuffer = (await page.screenshot(screenshotOptions)) as Buffer;
      await browser.close();
      return new NextResponse(new Uint8Array(imageBuffer), {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename=hasil-analisa-fallback-${
            isMobile ? "mobile" : "desktop"
          }.png`,
        },
      });
    }

    // ULTRA FAST: Optimized screenshot generation - ELEMENT CAPTURE
    const screenshotOptions = isMobile
      ? {
          type: "png" as const,
          omitBackground: true,
          // No fullPage or clip for element screenshot
        }
      : {
          type: "png" as const,
          omitBackground: false,
          // No fullPage or clip for element screenshot
        };

    const imageBuffer = (await element.screenshot(screenshotOptions)) as Buffer;
    await browser.close();

    // Performance logging
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(
      `✅ Story generation completed in ${duration}ms (${(
        imageBuffer.length /
        1024 /
        1024
      ).toFixed(2)} MB)`
    );

    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=hasil-analisa.png",
        // Add performance header
        "X-Generation-Time": `${duration}ms`,
      },
    });
  } catch (error) {
    return new NextResponse(
      `Failed to generate PNG: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}
