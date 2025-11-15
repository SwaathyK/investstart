/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export configuration for fully client-side app
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig

