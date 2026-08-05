import type { NextConfig } from "next"

const allowedDevOrigins: string[] = ["127.0.0.1"]
if (process.env.ALLOWED_DEV_ORIGIN) {
  allowedDevOrigins.push(
    ...process.env.ALLOWED_DEV_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
  )
}

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["z-ai-web-dev-sdk"],
  reactStrictMode: true,
  allowedDevOrigins,
  // Vercel build: skip tsc type-check (SWC/Turbopack handles compilation).
  // Required because mini-services/ has external deps (hono) not in package.json.
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
