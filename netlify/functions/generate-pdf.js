// netlify/functions/generate-pdf.js
const puppeteer = require('puppeteer');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  try {
    console.log('PDF Function: Starting', {
      method: event.httpMethod,
      hasBody: !!event.body,
      queryParams: event.queryStringParameters
    });

    let resultId, firstName;
    
    // Parse request data
    if (event.httpMethod === 'POST' && event.body) {
      try {
        const body = JSON.parse(event.body);
        resultId = body.resultId;
        firstName = body.firstName;
      } catch (e) {
        console.error('Error parsing JSON body:', e);
      }
    }
    
    // Fallback to query parameters
    if (!resultId) {
      resultId = event.queryStringParameters?.resultId || event.queryStringParameters?.result_id;
    }
    
    if (!firstName) {
      firstName = event.queryStringParameters?.firstName;
    }

    // Get token from headers
    const authHeader = event.headers.authorization || event.headers.Authorization;
    let token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      token = event.queryStringParameters?.token || event.queryStringParameters?.accessToken;
    }

    if (!resultId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Result ID is required',
          details: 'Please provide resultId in request body or query parameters'
        }),
      };
    }

    // Build PDF URL
    const baseUrl = process.env.URL || 'https://tiebymin-ai.netlify.app';
    const pdfUrl = new URL("/ai-overview/pdf", baseUrl);
    pdfUrl.searchParams.set("print", "true");
    pdfUrl.searchParams.set("result_id", resultId);
    
    if (token) {
      pdfUrl.searchParams.set("token", token);
    }

    const userName = firstName || "User";
    pdfUrl.searchParams.set("userName", userName);

    console.log("PDF Generation Debug:", {
      resultId,
      token: token ? "Token provided" : "No token",
      pdfUrl: pdfUrl.toString(),
      baseUrl
    });

    // Netlify configuration with Chromium plugin
    const chromeExecutablePath = process.env.CHROME_PATH || 
                               process.env.PUPPETEER_EXECUTABLE_PATH ||
                               '/opt/buildhome/.cache/puppeteer/chrome/linux-*/chrome';

    console.log("Chrome executable path:", chromeExecutablePath);

    const launchOptions = {
      headless: true,
      executablePath: chromeExecutablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-web-security',
        '--disable-features=TranslateUI',
        '--disable-extensions',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--mute-audio',
        '--no-default-browser-check',
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-sync',
        '--disable-client-side-phishing-detection',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--safebrowsing-disable-auto-update',
        '--disable-crash-reporter'
      ],
    };

    console.log("Launching browser...");
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setViewport({
      width: 800,
      height: 1600,
      deviceScaleFactor: 1,
    });

    console.log("Navigating to PDF URL...");
    await page.goto(pdfUrl.toString(), {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 90000, // 90 seconds for Netlify
    });

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("Initial page load wait completed");

    // Try to wait for content readiness with multiple strategies
    let contentReady = false;
    let attempts = 0;
    const maxAttempts = 20;

    while (!contentReady && attempts < maxAttempts) {
      attempts++;
      
      try {
        await page.waitForSelector('#pdf-content[data-pdf-ready="true"]', { timeout: 2000 });
        console.log("PDF content marked as ready");
        contentReady = true;
        break;
      } catch (readyError) {
        console.log(`Attempt ${attempts}: data-pdf-ready=true not found`);
      }

      try {
        const hasBasicData = await page.$('#pdf-content[data-has-basic-data="true"]');
        if (hasBasicData) {
          console.log("PDF content has basic data, proceeding");
          contentReady = true;
          break;
        }
      } catch (basicDataError) {
        console.log(`Attempt ${attempts}: Basic data check failed`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (!contentReady) {
      console.warn("Content readiness check timed out, proceeding anyway");
    }

    // Final wait for resources
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log("Generating PDF...");
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      width: '210mm',
      height: '297mm',
      preferCSSPageSize: true,
      timeout: 60000,
    });

    await browser.close();
    console.log("PDF generated successfully, size:", pdf.length);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=hasil-analisa-lengkap.pdf',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Length': pdf.length.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: pdf.toString('base64'),
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error("PDF Generation Error:", error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to generate PDF',
        details: error.message,
        stack: error.stack,
      }),
    };
  }
};