/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push({ canvas: 'commonjs canvas' })

    return config
  },
}

module.exports = nextConfig
