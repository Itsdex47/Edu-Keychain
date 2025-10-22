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

    // Handle non-JS files from libSQL packages
    config.module.rules.push({
      test: /\.(md|txt|LICENSE)$/,
      type: 'asset/source',
    });

    // Ignore problematic files from libSQL packages
    config.module.rules.push({
      test: /node_modules\/@libsql\/.*\.(md|txt|LICENSE)$/,
      type: 'asset/source',
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure proper output for Vercel
  output: process.env.NODE_ENV === 'production' && process.env.VERCEL ? 'standalone' : undefined,
};

export default nextConfig;
