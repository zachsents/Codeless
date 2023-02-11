/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
    "@minus/client-nodes",
])

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    // productionBrowserSourceMaps: true,
}

module.exports = withTM(nextConfig)
