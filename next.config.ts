import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/alhambra-web' : '',
  assetPrefix: isProd ? '/alhambra-web' : '',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicitly disable Turbopack for the build
  // @ts-ignore - 'turbo' might not be in the NextConfig type yet, but it's a valid option for Next.js 16.
  turbo: false,
};

export default nextConfig;
