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
          hostname: '95.85.125.44'
        }
      ]
    }

}

module.exports = nextConfig