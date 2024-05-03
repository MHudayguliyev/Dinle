/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './src/i18n.ts'
);
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
      protocol: 'http',
      hostname: '95.85.125.44',
      port: '8790',
      pathname: '/images/**',
      }
    ]
  }
}

module.exports = withNextIntl(nextConfig)