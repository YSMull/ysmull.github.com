const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const webpack = require('webpack');

module.exports = {
    entry: {
        index: __dirname + '/entry.js',
        vendors: __dirname + '/vendors.js',
    },
    output: {
        path: __dirname + '/build',
        chunkFilename: '[name].[hash].chunk.js',
        filename: '[name].[hash].js'
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: __dirname + '/../template/head.ejs',
            filename: __dirname + '/../_includes/head.html',
            inject: false
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader", // compiles Sass to CSS
                    options: {
                        includePaths: [__dirname + '/css']
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '/font',
                        publicPath: (url, resourcePath, context) => {
                            return `/assets/build/font/${url}`;
                        }
                    }

                }],

            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};
