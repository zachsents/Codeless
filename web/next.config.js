/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    productionBrowserSourceMaps: true,
    transpilePackages: ["@minus/client-nodes"],
    // async redirects() {
    //     return [
    //         {
    //             source: '/',
    //             destination: '/dashboard',
    //             permanent: true,
    //         },
    //     ]
    // },
}

module.exports = nextConfig
