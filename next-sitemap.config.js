
module.exports = {
    siteUrl: 'https://seolo.net',
    exclude: ['/dashboardAdmin', '/dashboard', '/recuperaPassword*'],
    generateRobotsTxt: true, // Genera robots.txt
    additionalPaths: async () => {
        const paths = [
            '/',
            '/contatti',
            '/prices',
            '/faq',
            '/login',
        ];
        return paths.map((url) => ({
            loc: url,
            changefreq: 'daily',
            priority: 0.7,
        }));
    },
};
