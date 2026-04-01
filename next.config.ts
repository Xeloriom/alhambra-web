import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Correct configuration for GitHub Pages at xeloriom.github.io/alhambra-web/
  basePath: '/alhambra-web',
  assetPrefix: '/alhambra-web/',
};

export default nextConfig;
