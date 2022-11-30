const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {};

module.exports = withPWA(nextConfig);
