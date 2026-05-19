/** @type {import('next').NextConfig} */

const isGithubPages = process.env.NEXT_EXPORT === 'true';
const isStaticExport = process.env.NEXT_STATIC === 'true' || isGithubPages;

const nextConfig = {
  output: isStaticExport ? 'export' : undefined,
  basePath:    isGithubPages ? '/alhambra-web' : '',
  assetPrefix: isGithubPages ? '/alhambra-web/' : '',
  trailingSlash: true,

  images: {
    unoptimized: true,
    formats:     ['image/avif', 'image/webp'] as ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],
    qualities:   [75, 80],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

module.exports = nextConfig;
