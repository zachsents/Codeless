/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
    "@minus/client-nodes", "@minus/graph-util",
])

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    // productionBrowserSourceMaps: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true,
            },
        ]
    },
}

module.exports = withTM(nextConfig)
