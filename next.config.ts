import type { NextConfig } from "next";
import { buffer } from "stream/consumers";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    })

    return config;
  },
  images: {
    domains: [
      "utfs.io"
    ]
  },
  typescript: {
    ignoreBuildErrors: true, // Disables TypeScript type checking during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
};

export default nextConfig;
