/** @type {import('next').NextConfig} */
const nextConfig = {}

const withMDX = require("@next/mdx")()

module.exports = withMDX({
  extension: /\.mdx?$/,
  experimental: {
    mdxRs: true,
  },
  // reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        // protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        // port: '',
        // pathname: '/account123/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ]
  },
})
