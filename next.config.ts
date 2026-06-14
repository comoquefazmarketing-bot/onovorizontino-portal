import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: 'X-DNS-Prefetch-Control',  value: 'on' },
  { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'whoglnpvqjbaczgnebbn.supabase.co' },
      { protocol: 'https', hostname: 'www.gremionovorizontino.com.br' },
      { protocol: 'https', hostname: 'logodownload.org' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ];
  },

  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors:  true },
};

export default nextConfig;
