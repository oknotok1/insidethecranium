/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Spotify CDN domains
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
        port: "",
        pathname: "/image/*",
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
        port: "",
        pathname: "/image/*",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/image/*",
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
        port: "",
        pathname: "/**",
      },
      // External site favicons and images (for SiteCard)
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS domains for site favicons
      },
      {
        protocol: "http",
        hostname: "**", // Allow all HTTP domains for site favicons
      },
    ],
    // Image optimization settings
    formats: ["image/avif", "image/webp"], // Use modern formats (AVIF first, WebP fallback)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Optimized device sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Optimized image sizes
    minimumCacheTTL: 2592000, // Cache images for 30 days
    dangerouslyAllowSVG: false, // Disable SVG for security
  },
  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"], // Remove console.log in production, keep errors/warnings
          }
        : false,
  },
  // Bundle analyzer (optional, commented out)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.optimization.splitChunks.cacheGroups = {
  //       ...config.optimization.splitChunks.cacheGroups,
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
