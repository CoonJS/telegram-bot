const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackRootPlugin = require('html-webpack-root-plugin')
module.exports = {
    devtool: 'eval-source-map',
    entry: path.resolve('./frontend/index.js'),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './client'),
        filename: '[name].[hash].js',
    },
    devServer: {
        hotOnly: true,
        compress: true,
        port: 9000,
        watchContentBase: true,
        progress: true,
        proxy: {
            '**': {
                target: 'http://localhost',
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            meta: {
                viewport:
                    'width=device-width, initial-scale=1, shrink-to-fit=no',
            },
        }),
        new HtmlWebpackRootPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif|ico|woff|ttf)$/,
                use: {
                    loader: 'file-loader',
                },
            },
        ],
    },
}
