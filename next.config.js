/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './src/i18n.ts'
);
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    SHARE_URL: process.env.SHARE_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'dinle.com.tm',
        port: '8790',
        pathname: '/images/**',
      }
    ]
  }
}

module.exports = withNextIntl(nextConfig)