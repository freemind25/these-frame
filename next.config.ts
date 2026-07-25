import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  serverExternalPackages: ["z-ai-web-dev-sdk", "@prisma/client", "@prisma/engines"],
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
}

export default nextConfig
