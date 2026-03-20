import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.gremionovorizontino.com.br" },
      { protocol: "https", hostname: "onovorizontino.com.br" },
      { protocol: "https", hostname: "whoglnpvqjbaczgnebbn.supabase.co" }
    ],
  },
};

export default nextConfig;