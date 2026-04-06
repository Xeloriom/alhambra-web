import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/alhambra-web' : '',
  // On désactive Turbopack pour le build de production afin d'éviter l'erreur lightningcss
  // qui survient dans l'environnement GitHub Actions (Linux x64).
};

export default nextConfig;
