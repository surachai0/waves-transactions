const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist/min'),
        filename: 'waves-transactions.min.js',
        library: 'WavesTransactions',
        libraryTarget: 'umd'
    },
    plugins: [
        new BundleAnalyzerPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                parallel: true
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    },
                ],
            },
        ]
    },
};

