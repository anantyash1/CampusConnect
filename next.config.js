/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Essential for Vercel deployment
  output: 'standalone',
  reactStrictMode: true,
  
  // ✅ Enable SWC minification for better performance
  swcMinify: true,
  
  // ✅ Image optimization configuration
  images: {
    // Allow images from various sources
    domains: [
      'localhost',
      '127.0.0.1',
      'lh3.googleusercontent.com', // For Google OAuth profile images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
    unoptimized: false,
  },

  // ✅ CORS headers for static files
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS, HEAD',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, Range',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Additional headers for API routes
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // ✅ Handle trailing slashes
  trailingSlash: false,

  // ✅ Enable experimental features if needed
  experimental: {
    // serverComponentsExternalPackages: ['mongoose'], // Uncomment if using Mongoose
  },

   api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase from default 1mb to 10mb
    },
    responseLimit: '10mb',
  },

};

module.exports = nextConfig;