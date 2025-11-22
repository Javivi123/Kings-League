/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimizaciones de rendimiento
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Optimizar compilación
  // experimental: {
  //   optimizeCss: true, // Deshabilitado temporalmente por problemas de build
  // },
}

module.exports = nextConfig

