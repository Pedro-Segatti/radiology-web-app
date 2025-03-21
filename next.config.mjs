/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: '/*/**',
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                port: "",
                pathname: '/*/**',
            },
        ],
    },

    async redirects() {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
