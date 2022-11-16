/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")(["node-builder", "math-nodes", "primitive-nodes", "utility-nodes"])

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withTM(nextConfig)
