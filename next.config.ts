import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Si vous déployez sur xeloriom.github.io/ALHAMBRA-WEB, décommentez les lignes ci-dessous :
  // basePath: '/alhambra-web',
  // assetPrefix: '/alhambra-web',
};

export default nextConfig;
