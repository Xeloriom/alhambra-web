/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/alhambra-web',
  assetPrefix: '/alhambra-web',
  trailingSlash: true,
  // ESLint is now handled via the CLI or separate config in this Next.js version
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
