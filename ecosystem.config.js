module.exports = {
    apps: [
        {
            name: 'tm-bot',
            script: './index.js',
            watch: true,
            env: {
                PORT: 8080,
                NODE_ENV: 'development',
            },
            env_production: {
                error_file: 'err.log',
                out_file: 'out.log',
                log_file: 'combined.log',
                time: true,
                PORT: 8443,
                NODE_ENV: 'production',
            },
        },
    ],
}
