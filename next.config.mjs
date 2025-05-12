/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure we're using the App Router properly
  experimental: {
    // Remove any experimental features that might be causing issues
    serverComponentsExternalPackages: ['bcrypt']
  },
  // Explicitly set the output mode
  output: 'standalone',
  // Transpile specific packages that might need it
  transpilePackages: [],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
