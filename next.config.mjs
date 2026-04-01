/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Utilise le préfixe uniquement en production pour GitHub Pages
  basePath: isProd ? '/alhambra-web' : '',
  assetPrefix: isProd ? '/alhambra-web' : '',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
