/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Requis pour GitHub Pages si le projet n'est pas sur le domaine racine
  basePath: '/alhambra-web',
  assetPrefix: '/alhambra-web',
  trailingSlash: true,
};

export default nextConfig;
