import { withNextVideo } from "next-video/process";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.edupia.vn",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "data.bkt.net.vn",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "img3.thuthuatphanmem.vn",
        port: "",
        pathname: "/**"
      }
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    optimizeCss: false,
    serverExternalPackages: ['rimraf'],
    serverActions: {
      bodySizeLimit: "100mb"
    }
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // Add environment variables accessible on the client-side
  env: {
    NEXT_PUBLIC_BKT_ACCOUNT_API_URL: process.env.BKT_ACCOUNT_API_URL,
    NEXT_PUBLIC_BKT_APP_ID: process.env.BKT_APP_ID
  }
};

export default withNextVideo(bundleAnalyzer(nextConfig));