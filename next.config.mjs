/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // On ACTIVE le basePath pour que le CSS fonctionne sur GitHub Pages
  basePath: '/alhambra-web',
  assetPrefix: '/alhambra-web',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
