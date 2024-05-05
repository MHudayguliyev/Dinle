const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
},
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

 
module.exports = withNextIntl(nextConfig);