const nextConfig = {
    transpilePackages: [
        '@adespota/my-react-component',
        '@tuoorg/domain-lib'
    ],
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
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Selezioniamo tutti i pacchetti esterni che devono essere forniti dal contesto
            // principale del consumer, non inclusi nei bundle della libreria.
            config.externals = [
                ...config.externals,
                'react-redux',
                '@reduxjs/toolkit',
                'lodash',
            ];
        }
        return config;
    },
}

// Export the configuration
module.exports = nextConfig

