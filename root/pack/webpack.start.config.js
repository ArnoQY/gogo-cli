// 开发环境 webpack配置

const webpack = require('webpack')
const merge = require('webpack-merge')
const WriteFilePlugin = require('write-file-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
    mode: 'development',
    output: {
        publicPath: '/',
    },
    resolve: {
        alias: {
            //启用React 16.6++基于@hot-🔥-loader的特性
            'react-dom': '@hot-loader/react-dom',
        },
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', 'less'],
    },
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: ['style-loader', 'happypack/loader?id=style'],
            },
            {
                test: /\.(png|gif|svg|jpe?g)$/,
                // happypack结合url-loader使用时会把图片编码，造成大于limit的图片也会输出为base64的问题
                // https://github.com/amireh/happypack/issues/240
                // use: ['happypack/loader?id=images'],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            //大于10KB的图片
                            limit: 10000,
                            useRelativePath: true,
                            name(resourcePath, resourceQuery) {
                                return `${resourcePath.split('view/')[1]}`
                            },
                        },
                    },
                ],
                exclude: /images\/icon\//,
            }
        ],
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            ISDEV: true,
        }),
        new WriteFilePlugin({
            test: /\.html$/,
        }),
        new BrowserSyncPlugin(
            {
                port: gogoConfig.dev.browserPort,
                host: 'localhost',
                proxy: `http://localhost:${gogoConfig.dev.port}/`,
            },
            {
                reload: false,
            }
        ),
    ],
})
