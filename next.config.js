/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages compatibility
  // Remove standalone output for Cloudflare Pages deployment
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig

