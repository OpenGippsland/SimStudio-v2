/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure PostCSS for Tailwind CSS
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
