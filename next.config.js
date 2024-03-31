/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    }, 
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '216.250.12.114'
        }
      ]
    }

}

module.exports = nextConfig