/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Studio-generated apps are portable; keep the build strict but resilient.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
