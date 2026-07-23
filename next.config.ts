import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "z-ai-web-dev-sdk",
    "sharp",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
