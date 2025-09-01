import url from "@/lib/url";

export function secureUrl(endpoint: string): string {
  let fullUrl = endpoint.startsWith("http") ? endpoint : `${url}${endpoint}`;
  if (process.env.NODE_ENV === "production" && fullUrl.startsWith("http://")) {
    fullUrl = fullUrl.replace("http://", "https://");
  }
  return fullUrl;
}

