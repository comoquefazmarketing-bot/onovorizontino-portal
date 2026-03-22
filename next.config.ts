import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'whoglnpvqjbaczgnebbn.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.gremionovorizontino.com.br',
      }
    ],
  },
  // Removemos o bloco de eslint que estava causando aviso no seu terminal
};

export default nextConfig;
