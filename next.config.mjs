/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Spotify CDN domains
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com',
        port: '',
        pathname: '/image/*',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
        port: '',
        pathname: '/image/*',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/*',
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
        port: '',
        pathname: '/**',
      },
      // External site favicons and images (for SiteCard)
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains for site favicons
      },
      {
        protocol: 'http',
        hostname: '**', // Allow all HTTP domains for site favicons
      },
    ],
  },
};

export default nextConfig;
