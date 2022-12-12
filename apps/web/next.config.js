/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
    "@minus/node-builder",
    "@minus/triggers",
    "@minus/client-nodes",
])

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
}

module.exports = withTM(nextConfig)
