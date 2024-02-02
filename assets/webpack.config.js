const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'entry.js'), // 主入口文件
        vendors: path.resolve(__dirname, 'vendors.js'), // 第三方库入口文件
    },
    output: {
        path: path.resolve(__dirname, 'build'), // 打包输出的目录
        chunkFilename: '[name].[hash].chunk.js', // 非入口 chunk 的名称
        filename: '[name].[hash].js', // 入口文件的输出名称
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: false,
            template: path.resolve(__dirname, '../template/head.ejs'), // 模板文件位置
            filename: path.resolve(__dirname, '../_includes/head.html'), // 输出文件位置
            inject: false // 不自动注入资源文件，因为我们设置了 inject: false
        }),
        new CleanWebpackPlugin(), // 清理 /build 文件夹
    ],
    module: {
        rules: [
            {
                test: /\.scss$/, // 检测 .scss 文件
                use: [
                    'style-loader', // 将 JS 字符串生成为 style 节点
                    'css-loader', // 将 CSS 转化成 CommonJS 模块
                    {
                        loader: 'sass-loader', // 将 Sass 编译成 CSS
                        options: {
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, 'css')], // 包含的路径
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/, // 检测 .css 文件
                use: ['style-loader', 'css-loader'], // 应用对应的 loader
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, // 检测字体和图片文件
                type: 'asset/resource', // 使用资源模块类型
                generator: {
                    filename: 'font/[name][ext]', // 文件输出路径
                    publicPath: '/assets/build/',
                },
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'async', // 优化所有类型的 chunk
            minSize: 30000, // 形成一个新代码块最小的体积
            maxSize: 30000, // 代码块最大的体积
            minChunks: 1, // 在分割之前，这个代码块最小应该被引用的次数（默认为1）
            maxAsyncRequests: 5, // 按需加载时的最大并行请求数
            maxInitialRequests: 3, // 一个入口的最大并行请求数
            automaticNameDelimiter: '~', // 默认的命名规则（使用~进行连接）
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/, // 检测是否在 node_modules 目录下
                    priority: -10, // 优先级
                    name(module, chunks, cacheGroupKey) {
                        const moduleFileName = module
                            .identifier()
                            .split('/')
                            .reduceRight((item) => item)
                            .replace(/\.[^/.]+$/, '');
                        const allChunksNames = chunks.map((item) => item.name).join('~');
                        return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                    },
                },
                default: {
                    minChunks: 2, // 最小 chunk 引用次数
                    priority: -20, // 优先级
                    reuseExistingChunk: true, // 如果当前 chunk 包含已经从主 bundle 中分离出的模块，则会重用它，而不是生成新的模块
                },
            },
        },
    },
};
