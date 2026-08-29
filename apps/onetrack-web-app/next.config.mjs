/** @type {import('next').NextConfig} */
const nextConfig = {
    cacheComponents: true,
    transpilePackages: ["@repo/ui"],
};

export default nextConfig;
