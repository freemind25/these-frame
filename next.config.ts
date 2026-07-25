import type { NextConfig} from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "z-ai-web-dev-sdk"],
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
}

export default nextConfig
