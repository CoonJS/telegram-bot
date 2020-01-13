module.exports = {
    apps: [
        {
            name: 'tm-bot',
            script: 'npm',
            args: 'run build:app',
            watch: true,
            env: {
                PORT: 80,
                NODE_ENV: 'development',
            },
            env_production: {
                error_file: 'err.log',
                out_file: 'out.log',
                log_file: 'combined.log',
                time: true,
                PORT: 443,
                NODE_ENV: 'production',
            },
        },
    ],
}
