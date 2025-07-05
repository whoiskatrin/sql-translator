/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages configuration
  output: 'export',
  trailingSlash: true,
  distDir: 'dist',
  
  // Image optimization compatibility
  images: {
    unoptimized: true,
  },
  
  
  // API routes detected - consider using Cloudflare Workers for API
  // Note: API routes in pages/api/ won't work with static export
  // Consider migrating to Cloudflare Workers or removing API routes
  
};

module.exports = nextConfig;
