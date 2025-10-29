/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ai-assistant/components'],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Allow cross-origin requests in development from common network IPs
  allowedDevOrigins: [
    '192.168.8.100',
    '192.168.1.100',
    'localhost',
    '127.0.0.1',
  ],
  // Enable HTTPS for development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

