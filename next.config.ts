import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/alhambra-web' : '',
  // Pour Next.js 15+, turbo est à la racine, mais si TS râle encore, 
  // on peut essayer de s'en passer si l'erreur lightningcss persiste en CI.
  // @ts-ignore - Turbopack configuration
  turbo: {
    rules: {
      '*.css': {
        loaders: ['postcss-loader'],
        as: 'style',
      },
    },
  },
};

export default nextConfig;
