import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "example.com",
      "res.cloudinary.com",
      "gskhyihpgshzslmpsuaj.supabase.co",
      "placehold.co",
      "cdn0-production-images-kly.akamaized.net",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
