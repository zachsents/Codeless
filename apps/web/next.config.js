/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
    "node-builder",
    "triggers",
    "math-nodes",
    "primitive-nodes",
    "utility-nodes",
    "mail-nodes",
    "list-nodes",
])

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = withTM(nextConfig)
