/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
    "node-builder",
    "triggers",
    "@zachsents/display-nodes",
])

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
}

module.exports = withTM(nextConfig)
