/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ai-assistant/components'],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
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

