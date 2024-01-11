/** @type {import('next').NextConfig} */

// Path: next.config.js
const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'silver-casual-duck-945.mypinata.cloud',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig
