/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
    productionBrowserSourceMaps: true,
    transpilePackages: ["@minus/client-nodes", "@minus/ui"],
    // async redirects() {
    //     return [
    //         {
    //             source: '/',
    //             destination: '/apps',
    //             permanent: true,
    //         },
    //     ]
    // },
}

module.exports = nextConfig
