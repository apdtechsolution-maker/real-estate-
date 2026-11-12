import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 85],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
  },
  poweredByHeader: false,
};

export default nextConfig;
