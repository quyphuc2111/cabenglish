import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['static.edupia.vn']
    },
    output: "standalone"
};

export default withNextVideo(nextConfig);