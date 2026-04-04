import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.BACKEND_HOST ?? "localhost"],
  },
  output: "standalone",
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/v1/:path*",
          destination: `${process.env.BACKEND_URL}/api/v1/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
