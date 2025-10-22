const nextConfig = {
    transpilePackages: ['@adespota/my-react-component'],
    //distDir: 'out', // Specifies the output folder as 'out'
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 's.alicdn.com',
                pathname: '/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        dangerouslyAllowSVG: true, // enables SVG image optimization
    },
    compiler: {
        // Rimuove i console.log dal progetto quando è in produzione
        removeConsole: process.env.NODE_ENV === "production"
    }
}

// Export the configuration
module.exports = nextConfig

