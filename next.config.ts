import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }


    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Standard output for Vercel serverless functions
  output: 'standalone',
};

export default nextConfig;
