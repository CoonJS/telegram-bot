module.exports = {
    apps: [
        {
            name: 'tm-bot',
            script: './index.js',
            watch: true,
            error_file: 'err.log',
            out_file: 'out.log',
            log_file: 'combined.log',
            time: true,
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                PORT: 443,
                NODE_ENV: 'production',
            },
        },
    ],
}
