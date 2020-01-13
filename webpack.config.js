const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin')
module.exports = {
    entry: path.resolve('./frontend/index.js'),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './client'),
        filename: 'main.js',
    },
    devServer: {
        hotOnly: true,
        compress: true,
        port: 9000,
        watchContentBase: true,
        progress: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: 'favicon.ico',
        }),
        new HtmlWebpackRootPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                use: ['file-loader'],
            },
        ],
    },
}
