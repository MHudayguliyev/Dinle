/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './src/i18n.ts'
);
const nextConfig = {
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    }, 
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '95.85.125.44'
        }
      ]
    }
}

module.exports = withNextIntl(nextConfig)