const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpeg|jpg)$/,
                use: [
                    'file-loader'
                ],
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: [
                    'babel-loader'
                ], 
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: { 
            'pixi.js': path.resolve(__dirname, 'node_modules', 'pixi.js'),
            // 'skia-canvas': path.resolve(__dirname, 'node_modules', 'skia-canvas'), 
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, './dist')
        },
        port: 8000,
        hot: true
    }
};
