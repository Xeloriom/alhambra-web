import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Configuration pour GitHub Pages à xeloriom.github.io/alhambra-web/
  basePath: '/alhambra-web',
  assetPrefix: '/alhambra-web', // Supprimé le slash final ici
};

export default nextConfig;
