// netlify/functions/generate-story.js
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
    console.log('Story Function: Starting', {
      method: event.httpMethod,
      queryParams: event.queryStringParameters
    });

    const resultId = event.queryStringParameters?.result_id;
    
    if (!resultId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Result ID is required',
          details: 'Please provide result_id in query parameters'
        }),
      };
    }

    // Get token from headers
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const token = authHeader?.replace('Bearer ', '');

    // Build Story URL
    const baseUrl = process.env.URL || 'https://tiebymin-ai.netlify.app';
    const storyUrl = new URL("/ai-overview/story", baseUrl);
    storyUrl.searchParams.set("result_id", resultId);
    
    if (token) {
      storyUrl.searchParams.set("token", token);
    }

    console.log("Story Generation Debug:", {
      resultId,
      token: token ? "Token provided" : "No token",
      storyUrl: storyUrl.toString()
    });

    // Netlify configuration with Chromium plugin
    const chromeExecutablePath = process.env.CHROME_PATH || 
                               process.env.PUPPETEER_EXECUTABLE_PATH ||
                               '/opt/buildhome/.cache/puppeteer/chrome/linux-*/chrome';

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
        '--mute-audio',
        '--no-default-browser-check'
      ],
    };

    console.log("Launching browser for story generation...");
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Set viewport for Instagram story dimensions
    await page.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
    });

    console.log("Navigating to story URL...");
    await page.goto(storyUrl.toString(), {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 90000,
    });

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("Story page loaded, waiting for content...");

    // Wait for story content to be ready
    try {
      await page.waitForSelector('[data-story-ready="true"], .story-content, main', { 
        timeout: 30000 
      });
      console.log("Story content found");
    } catch (error) {
      console.warn("Story content selector not found, proceeding anyway");
    }

    // Additional wait for images and data
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log("Taking screenshot...");
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 390,
        height: 844,
      },
      omitBackground: false,
    });

    await browser.close();
    console.log("Story screenshot generated successfully, size:", screenshot.length);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename=story-result.png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Length': screenshot.length.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: screenshot.toString('base64'),
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error("Story Generation Error:", error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to generate story',
        details: error.message,
        stack: error.stack,
      }),
    };
  }
};