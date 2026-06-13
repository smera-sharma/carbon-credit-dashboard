/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "*.replit.dev",
    "*.pike.replit.dev",
    "*.replit.app",
    "*.repl.co",
  ],
}

export default nextConfig
