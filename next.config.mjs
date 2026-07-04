/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Studio-generated apps are portable; keep the build strict but resilient.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  webpack(config) {
    // The `studio/` lane uses ESM-style `.js` import specifiers that resolve to
    // `.ts`/`.tsx` sources (matching `moduleResolution: bundler` in tsconfig
    // and vitest). Teach webpack the same mapping so the playground — which
    // imports the real registry — bundles cleanly.
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias ?? {}),
      ".js": [".ts", ".tsx", ".js", ".jsx"],
    };
    return config;
  },
};

export default nextConfig;
