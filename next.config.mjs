import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["static.edupia.vn"]
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/",
  //       permanent: true
  //     }
  //   ];
  // }
};

export default withNextVideo(nextConfig);
