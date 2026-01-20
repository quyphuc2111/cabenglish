/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.edupia.vn',
      },
    ],
  },
  generateBuildId: async () => {
    // Use timestamp as build ID
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
