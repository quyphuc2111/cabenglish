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
      }
    ],
    minimumCacheTTL: 60
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