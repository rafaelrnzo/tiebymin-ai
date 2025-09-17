import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return await generatePdf(req);
}

export async function GET(req: NextRequest) {
  return await generatePdf(req);
}

async function generatePdf(req: NextRequest) {
  const startTime = Date.now();
  console.log('🚀 Starting PDF generation...');

  try {
    let resultId, firstName;
    
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        resultId = body.resultId;
        firstName = body.firstName;
      } catch (e) {
        // Handle error silently
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
          '--single-process', // Faster startup
          '--disable-gpu',
          '--disable-plugins',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-backgrounding-occluded-windows',
          '--memory-pressure-off',
          '--max_old_space_size=2048', // Reduced memory
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--disable-background-networking',
          '--disable-web-security', // Faster loading
          '--disable-features=VizDisplayCompositor',
          '--disable-accelerated-video-decode',
          '--disable-background-media-download',
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
          '--disable-gpu',
          '--disable-plugins',
          '--disable-extensions',
          '--memory-pressure-off',
          '--max_old_space_size=2048', // Reduced memory
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--disable-background-networking',
          '--disable-web-security', // Faster loading
          '--disable-features=VizDisplayCompositor',
          '--disable-accelerated-video-decode',
          '--disable-background-media-download',
        ],
        headless: true,
      };
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // OPTIMIZED: Smart resource blocking - allow product images while maintaining speed
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      const url = request.url();

      if (resourceType === 'image') {
        // Allow ALL images for product recommendations to work
        // This is critical for product images to load properly
        request.continue();
      } else if (resourceType === 'stylesheet') {
        request.continue(); // Allow CSS
      } else if (resourceType === 'script') {
        // Allow critical scripts and our domain scripts
        if (url.includes(req.nextUrl.origin) || url.includes('_next') || url.includes('static')) {
          request.continue();
        } else {
          request.abort(); // Block external scripts for speed
        }
      } else if (resourceType === 'font') {
        request.continue(); // Allow fonts
      } else if (resourceType === 'media') {
        request.abort(); // Block all media for speed
      } else if (resourceType === 'websocket' || resourceType === 'other') {
        request.abort(); // Block unnecessary connections
      } else {
        request.continue();
      }
    });

    // OPTIMIZED: Smaller viewport for faster processing
    await page.setViewport({
      width: 800,
      height: 1200,
      deviceScaleFactor: 1,
    });

    // ULTRA FAST: Optimized loading strategy
    // Note: Connection detection is handled on client side, default to fast for server
    const isSlowConnection = false; // Default to fast connection for server-side

    await page.goto(pdfUrl.toString(), {
      waitUntil: isSlowConnection ? 'networkidle0' : 'domcontentloaded', // Faster for good connections
      timeout: isSlowConnection ? 25000 : 15000, // Dynamic timeout
    });

    // TAMBAHAN: Wait untuk custom data attribute yang menandakan PDF siap
    console.log('Waiting for PDF content to be ready...');
    
    // Wait sampai pdf-content ready dengan multiple fallbacks
    await page.waitForFunction(
      () => {
        const pdfContent = document.getElementById('pdf-content');
        if (!pdfContent) return false;
        
        // Check apakah ada loading indicator
        const loadingElements = document.querySelectorAll('[data-testid="loading"], .animate-pulse, .skeleton');
        const hasLoading = loadingElements.length > 0;
        
        // Check apakah konten sudah ada
        const hasContent = pdfContent.children.length > 0;
        
        // Check custom ready attribute
        const isReady = pdfContent.getAttribute('data-pdf-ready') === 'true';
        
        console.log('PDF readiness check:', {
          hasContent,
          hasLoading,
          isReady,
          loadingCount: loadingElements.length
        });
        
        return hasContent && !hasLoading && isReady;
      },
      { 
        timeout: 25000,
        polling: 500 // Check setiap 500ms
      }
    );

    // OPTIMIZED: Focus on product images specifically
    await page.evaluate(() => {
      const allImages = Array.from(document.images);

      // Prioritize product images
      const productImages = allImages.filter(img => {
        const src = img.src.toLowerCase();
        const alt = img.alt?.toLowerCase() || '';
        const className = img.className?.toLowerCase() || '';
        const parentClasses = img.parentElement?.className?.toLowerCase() || '';

        return src.includes('product') ||
               src.includes('recommendation') ||
               alt.includes('product') ||
               className.includes('product') ||
               parentClasses.includes('product') ||
               parentClasses.includes('recommendation');
      });

      console.log(`Found ${productImages.length} product images out of ${allImages.length} total images`);

      // Fast path: If product images are loaded, proceed immediately
      const productImagesLoaded = productImages.every(img => img.complete && img.naturalWidth > 0);
      if (productImagesLoaded) {
        console.log('All product images loaded, proceeding immediately');
        return Promise.resolve();
      }

      // Wait specifically for product images
      const productPromises = productImages.map((img, index) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();

        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            console.log(`Product image ${index} timeout`);
            resolve(void 0);
          }, 5000); // Longer timeout for product images

          img.addEventListener('load', () => {
            clearTimeout(timeout);
            console.log(`Product image ${index} loaded successfully`);
            resolve(void 0);
          });

          img.addEventListener('error', () => {
            clearTimeout(timeout);
            console.log(`Product image ${index} failed to load`);
            resolve(void 0);
          });
        });
      });

      return Promise.all(productPromises).catch(() => {
        console.log('Some product images failed, continuing with PDF generation...');
      });
    });

    // ENHANCED: Product-focused rendering completion check
    await page.evaluate(() => {
      // Force layout recalculation
      document.body.offsetHeight;

      // Focus on product images specifically
      const productImages = document.querySelectorAll('img');
      const productImageElements = Array.from(productImages).filter(img => {
        const src = img.src.toLowerCase();
        const alt = img.alt?.toLowerCase() || '';
        const className = img.className?.toLowerCase() || '';
        const parentClasses = img.parentElement?.className?.toLowerCase() || '';

        return src.includes('product') ||
               src.includes('recommendation') ||
               alt.includes('product') ||
               className.includes('product') ||
               parentClasses.includes('product') ||
               parentClasses.includes('recommendation');
      });

      console.log(`Ensuring ${productImageElements.length} product images are visible`);

      // Ensure all product images are visible and properly loaded
      productImageElements.forEach((img, index) => {
        const htmlImg = img as HTMLImageElement;

        // Force visibility
        htmlImg.style.display = 'block';
        htmlImg.style.visibility = 'visible';
        htmlImg.style.opacity = '1';

        // Ensure proper dimensions
        if (htmlImg.offsetWidth === 0 || htmlImg.offsetHeight === 0) {
          htmlImg.style.minWidth = '100px';
          htmlImg.style.minHeight = '100px';
        }

        console.log(`Product image ${index}: ${htmlImg.complete ? 'loaded' : 'loading'}, ${htmlImg.naturalWidth}x${htmlImg.naturalHeight}`);
      });

      // Remove loading states
      const loadingElements = document.querySelectorAll('.animate-pulse, .skeleton, [data-loading]');
      loadingElements.forEach(el => el.remove());

      return true;
    });

    // Short delay for rendering completion
    await new Promise(resolve => setTimeout(resolve, 500));

    // Final validation sebelum generate PDF dengan fokus pada product images
    const finalImageCheck = await page.evaluate(() => {
      const images = document.querySelectorAll('img');

      // More comprehensive product image detection
      const productImages = Array.from(images).filter(img => {
        const src = img.src.toLowerCase();
        const alt = img.alt?.toLowerCase() || '';
        const className = img.className?.toLowerCase() || '';
        const parentClasses = img.parentElement?.className?.toLowerCase() || '';

        return src.includes('product') ||
               src.includes('recommendation') ||
               alt.includes('product') ||
               className.includes('product') ||
               parentClasses.includes('product') ||
               parentClasses.includes('recommendation') ||
               img.closest('[class*="product"]') ||
               img.closest('[class*="recommendation"]');
      });

      const imageStats = {
        total: images.length,
        loaded: Array.from(images).filter(img => img.complete && img.naturalWidth > 0).length,
        failed: Array.from(images).filter(img => img.complete && img.naturalWidth === 0).length,
        productTotal: productImages.length,
        productLoaded: productImages.filter(img => img.complete && img.naturalWidth > 0).length,
        productFailed: productImages.filter(img => img.complete && img.naturalWidth === 0).length,
        productPending: productImages.filter(img => !img.complete).length
      };

      // Detailed logging untuk debugging product images
      console.log('=== PRODUCT IMAGES DEBUG ===');
      productImages.forEach((img, index) => {
        const status = img.complete
          ? (img.naturalWidth > 0 ? 'LOADED' : 'FAILED')
          : 'PENDING';

        console.log(`Product Image ${index + 1} [${status}]:`, {
          src: img.src.substring(0, 150) + '...',
          alt: img.alt,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          visible: img.offsetWidth > 0 && img.offsetHeight > 0,
          inViewport: img.getBoundingClientRect().top < window.innerHeight,
          className: img.className,
          parentClass: img.parentElement?.className
        });
      });
      console.log('=== END PRODUCT IMAGES DEBUG ===');

      return imageStats;
    });

    console.log('Final image check before PDF generation:', finalImageCheck);

    // CRITICAL: Ensure product images are properly loaded
    if (finalImageCheck.productTotal > 0) {
      console.log(`Found ${finalImageCheck.productTotal} product images: ${finalImageCheck.productLoaded} loaded, ${finalImageCheck.productFailed} failed, ${finalImageCheck.productPending} pending`);

      if (finalImageCheck.productLoaded === 0) {
        console.warn('WARNING: No product images loaded! This may result in missing images in PDF.');
      }
    }

    // TAMBAHAN: Specific wait untuk product images jika masih ada yang pending
    if (finalImageCheck.productPending > 0 || finalImageCheck.productFailed > 0) {
      console.log('Waiting additional time for product images...');

      await page.evaluate(() => {
        return new Promise((resolve) => {
          const productImages = Array.from(document.querySelectorAll('img')).filter(img => {
            const src = img.src.toLowerCase();
            const alt = img.alt?.toLowerCase() || '';
            const className = img.className?.toLowerCase() || '';
            const parentClasses = img.parentElement?.className?.toLowerCase() || '';

            return src.includes('product') ||
                   src.includes('recommendation') ||
                   alt.includes('product') ||
                   className.includes('product') ||
                   parentClasses.includes('product') ||
                   parentClasses.includes('recommendation') ||
                   img.closest('[class*="product"]') ||
                   img.closest('[class*="recommendation"]');
          });

          const pendingImages = productImages.filter(img => !img.complete);

          if (pendingImages.length === 0) {
            console.log('All product images already loaded');
            resolve(void 0);
            return;
          }

          console.log(`Waiting for ${pendingImages.length} pending product images...`);

          let loadedCount = 0;
          const totalPending = pendingImages.length;

          const checkComplete = () => {
            loadedCount++;
            console.log(`Product image loaded: ${loadedCount}/${totalPending}`);

            if (loadedCount >= totalPending) {
              console.log('All pending product images loaded');
              resolve(void 0);
            }
          };

          pendingImages.forEach((img, index) => {
            if (img.complete) {
              checkComplete();
            } else {
              img.addEventListener('load', checkComplete);
              img.addEventListener('error', () => {
                console.log(`Product image ${index} failed to load`);
                checkComplete(); // Continue even if failed
              });

              // Force reload jika stuck
              setTimeout(() => {
                if (!img.complete) {
                  console.log(`Force reloading product image ${index}`);
                  const currentSrc = img.src;
                  img.src = '';
                  img.src = currentSrc;
                }
              }, 2000);
            }
          });

          // Timeout setelah 10 detik
          setTimeout(() => {
            console.log('Product image wait timeout, proceeding with PDF generation');
            resolve(void 0);
          }, 10000);
        });
      });
    }

    // ULTRA FAST: Optimized PDF generation settings
    const pdfOptions = {
      format: "A4" as const,
      printBackground: true,
      width: '210mm',
      height: '297mm',
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      generateTaggedPDF: false,
      omitBackground: false,
      timeout: 15000, // Reduced timeout
    };

    const pdf = await page.pdf(pdfOptions);
    await browser.close();

    const pdfBuffer = Buffer.from(pdf);

    // Performance logging
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`✅ PDF generation completed in ${duration}ms (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=hasil-analisa-lengkap.pdf",
      "Content-Length": pdfBuffer.length.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      // Add performance header
      "X-Generation-Time": `${duration}ms`,
    };

    return new NextResponse(pdfBuffer, { headers });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    
    const errorResponse = {
      error: "Failed to generate PDF",
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    };

    return new NextResponse(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}