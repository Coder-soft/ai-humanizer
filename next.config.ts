import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Enables the App Router instead of the Pages Router.
   * @see https://nextjs.org/docs/app
   */
  experimental: {
    // Add experimental features here as needed
  },
  /**
   * Configure `path` aliases for TypeScript and JavaScript imports.
   * This allows importing modules using absolute paths relative to the `src` directory.
   * Example: '@/components/ui/button' instead of '../../../components/ui/button'
   */
  webpack: (config) => {
    config.resolve.alias['@'] = require('path').resolve(__dirname, './src');
    return config;
  },
};

export default nextConfig;
