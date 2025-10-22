import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }

    // Exclude README, LICENSE, and other non-JS files from libSQL packages
    config.module.rules.push({
      test: /\.(md|txt|LICENSE)$/,
      type: 'asset/source',
    });

    // Mark libSQL packages as external for server-side builds
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          '@libsql/client': 'commonjs @libsql/client',
          '@prisma/adapter-libsql': 'commonjs @prisma/adapter-libsql',
        });
      }
    }

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure proper output for Vercel
  output: process.env.NODE_ENV === 'production' && process.env.VERCEL ? 'standalone' : undefined,
  // Exclude libSQL packages from serverComponentsExternalPackages
  serverExternalPackages: ['@libsql/client', '@prisma/adapter-libsql'],
};

export default nextConfig;
