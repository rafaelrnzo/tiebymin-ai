// Helper function to decode and fix malformed URLs
export const decodeUrl = (url: string): string => {
  try {
    // Decode twice to handle double encoding
    let decoded = decodeURIComponent(url);
    if (decoded.includes("%")) {
      decoded = decodeURIComponent(decoded);
    }

    // Handle case where URL has duplicate base URL with credentials
    // Extract the correct URL from malformed double-encoded URLs
    // Pattern matches: baseURL + "/" + baseURL + "/path"
    const baseUrlPattern =
      /https:\/\/[^\/]+\/[^\/]+:[^\/]+\/[^\/]+\/(https:\/\/[^\/]+\/[^\/]+:[^\/]+\/[^\/]+\/.+)/;
    let httpsMatches = decoded.match(baseUrlPattern);

    if (httpsMatches && httpsMatches[1]) {
      // Use the second base URL with path
      decoded = httpsMatches[1];
      console.log("🔧 decodeUrl: Fixed duplicate base URL pattern");
    } else {
      // Fallback to original pattern for other cases
      httpsMatches = decoded.match(/https:\/\/[^\/]+\/(https:\/\/[^\/]+\/.+)/);
      if (httpsMatches && httpsMatches[1]) {
        decoded = httpsMatches[1];
        console.log("🔧 decodeUrl: Fixed generic duplicate https pattern");
      }
    }

    return decoded;
  } catch (error) {
    console.warn("⚠️ decodeUrl: Failed to decode URL:", url, error);
    return url;
  }
};