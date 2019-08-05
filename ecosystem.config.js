module.exports = {
    apps: [
        {
            name: 'tm-bot',
            script: './index.js',
            watch: true,
            env: {
                PORT: 80,
                NODE_ENV: 'development',
            },
            env_production: {
                PORT: 443,
                NODE_ENV: 'production',
            },
        },
    ],
}
