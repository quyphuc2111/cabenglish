import { withSentryConfig } from "@sentry/nextjs";
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
    optimizeCss: false
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

export default withSentryConfig(withNextVideo(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "bkt-hi",
  project: "smartkidweb",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
});
