const nextConfig = {
  // Your existing config
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add these optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'react-icons',
      'date-fns',
      'lucide-react',
      '@radix-ui/react-icons',
      'lodash'
    ],
  },
  
  // Improve code splitting
  webpack: (config, { isServer }) => {
    // Only apply to client-side bundles
    if (!isServer) {
      // Create smaller chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 60000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = match ? match[1] : 'unknown';
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      };
    }
    return config;
  },
}

export default nextConfig;
