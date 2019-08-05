module.exports = {
    apps: [
        {
            name: 'tm-bot',
            script: './index.js',
            watch: true,
            env_production: {
                PORT: 443,
                NODE_ENV: 'production',
            },
        },
    ],
}
