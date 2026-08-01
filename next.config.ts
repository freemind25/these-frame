import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  serverExternalPackages: ["z-ai-web-dev-sdk"],
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  allowedDevOrigins: ["127.0.0.1", "21.0.8.195"],
}

export default nextConfig
