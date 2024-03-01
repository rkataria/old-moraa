/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  webpack: (config) => {
    config.externals.push({ canvas: 'commonjs canvas' })

    return config
  },
}

module.exports = nextConfig
