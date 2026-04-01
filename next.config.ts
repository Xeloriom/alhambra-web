import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ces lignes sont nécessaires pour le déploiement sur GitHub Pages si votre site est dans un sous-dossier
  // Remplacez '/alhambra-web' par le nom de votre dépôt GitHub si ce n'est pas 'alhambra-web'
  basePath: '/alhambra-web',
  assetPrefix: '/alhambra-web',
};

export default nextConfig;
