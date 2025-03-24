import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// module.exports = {
//   images: {
//     domains: ['localhost'], // เพิ่ม localhost เข้าไปใน domains
//   },
// };

export default nextConfig;
