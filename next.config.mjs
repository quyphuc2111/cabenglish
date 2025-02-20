import { withNextVideo } from "next-video/process";
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["static.edupia.vn"],
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true // Enable CSS optimization
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimizer.push(
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default', {
              discardComments: { removeAll: true },
              cssDeclarationSorter: true,
              reduceIdents: true, // Enable class name hashing
              normalizeWhitespace: true,
              minifySelectors: true,
            }],
          },
        })
      );
    }
    return config;
  }
};

export default withNextVideo(nextConfig);
