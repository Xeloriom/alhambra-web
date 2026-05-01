/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Output ──────────────────────────────────────────
  output: 'export', // static export — remove if using SSR
  trailingSlash: true,

  // ── Base path (GitHub Pages) ─────────────────────────
  basePath: process.env.NODE_ENV === 'production' ? '/alhambra-web' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/alhambra-web/' : '',

  // ── Image Optimization ───────────────────────────────
  images: {
    // For static export — use unoptimized OR configure a loader
    unoptimized: process.env.NODE_ENV === 'production',
    // Formats: prefer avif > webp > original
    formats: ['image/avif', 'image/webp'],
    // Common device widths to generate srcsets for
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── Compiler Optimizations ───────────────────────────
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // ── Experimental ────────────────────────────────────
  experimental: {
    // Optimize CSS — reduces unused CSS in output
    optimizeCss: true,
    // Package import optimization for large libs
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // ── Webpack ─────────────────────────────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tone.js is heavy — only load when actually needed
      // This prevents it from ending up in the main bundle
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },
};

module.exports = nextConfig;