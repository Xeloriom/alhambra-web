/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // On ne met le basePath que si on est en production sur GitHub Pages
  // basePath: process.env.NODE_ENV === 'production' ? '/alhambra-web' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/alhambra-web' : '',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
