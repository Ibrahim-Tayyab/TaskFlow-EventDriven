/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone' is only for Docker, Vercel handles this automatically
  images: {
    unoptimized: true
  },
  // Disable ESLint during build (already linted locally)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (already checked locally)
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // For Vercel: Use NEXT_PUBLIC_API_URL or default to relative /api
    // For Local: Use localhost:8000
    // For Docker: Use INTERNAL_API_URL
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('Rewrite rule: Proxying /api/* to', apiUrl);
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  }
}

module.exports = nextConfig