/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  webpack: (config) => {
    config.externals.push({ canvas: 'commonjs canvas' })

    return config
  },
}

module.exports = nextConfig
