import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-demo.algolia.com",
      },
    ],
  },
};

export default nextConfig;
