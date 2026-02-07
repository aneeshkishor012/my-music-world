import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Use remotePatterns instead of the deprecated `domains` list.
    // This protects against malicious hosts by explicitly allowing only these origins.
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'c.saavncdn.com' },
      { protocol: 'https', hostname: 'www.jiosaavn.com' },
      { protocol: 'https', hostname: 'static.saavncdn.com' },
      { protocol: 'https', hostname: 'pli.saavncdn.com' },
      { protocol: "https", hostname: "r4.wallpaperflare.com" },
    ],
  },
};

export default nextConfig;

