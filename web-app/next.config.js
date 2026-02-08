/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Docker deployment
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
    // Use INTERNAL_API_URL for server-side requests (Docker network)
    // For local development, use localhost:8000
    // For Docker/K8s, set INTERNAL_API_URL=http://todo-backend:8000
    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:8000';
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