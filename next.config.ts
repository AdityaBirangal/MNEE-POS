import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Use webpack for production builds to avoid Turbopack test file issues
  // Turbopack is used for dev mode (faster)
  webpack: (config, { isServer }) => {
    // Ignore test files that cause build issues
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    // Exclude test files from being processed
    config.module.rules.push({
      test: /\.test\.(ts|tsx|js|jsx)$/,
      use: 'ignore-loader',
    });
    
    return config;
  },
  // Add empty turbopack config to allow dev mode to work
  turbopack: {},
};

export default nextConfig;

