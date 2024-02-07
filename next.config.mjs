/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'iis.bsuir.by'
            },
            {
                hostname: 'img.icons8.com'
            }
        ]
    }
};

export default nextConfig;
