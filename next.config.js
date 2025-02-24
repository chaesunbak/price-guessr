/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.coupangcdn.com",
      },
    ],
  },
};

module.exports = nextConfig;
