import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/$/, "");
const frontendApiUrl = process.env.NEXT_PUBLIC_API_URL;
if (frontendApiUrl === "/" && !apiProxyTarget) {
  throw new Error("API_PROXY_TARGET is required when NEXT_PUBLIC_API_URL is set to '/'.");
}
if (apiProxyTarget) {
  const target = new URL(apiProxyTarget);
  if (!["http:", "https:"].includes(target.protocol) || target.username || target.password || target.pathname !== "/" || target.search || target.hash) {
    throw new Error("API_PROXY_TARGET must be an HTTP(S) origin without credentials, path, query, or fragment.");
  }
}

const nextConfig: NextConfig = {
  async rewrites() {
    return apiProxyTarget
      ? [{ source: "/api/:path*", destination: `${apiProxyTarget}/api/:path*` }]
      : [];
  },
  async redirects() {
    return [
      { source: "/admin", destination: "/dashboard", permanent: true },
      { source: "/admin/:path*", destination: "/dashboard/:path*", permanent: true },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
