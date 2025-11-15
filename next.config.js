/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Disable static optimization to avoid build errors with Client Components
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig

