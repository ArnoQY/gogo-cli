// webpack基础配置

const path = require('path')
const HappyPack = require('happypack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

const pathAlias = require('../gogo.config').pathAlias
const happyThreadPool = HappyPack.ThreadPool({ size: 10 })

module.exports = {
    stats: 'minimal',
    resolve: {
        alias: pathAlias,
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
    },
    output: {
        filename: 'js/[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['happypack/loader?id=babel'],
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: 'gogoIcon-[name]',
                            extract: true,
                            esMoudle: false,
                            publicPath: 'images/icon/',
                        },
                    },
                    'svg-transform-loader',
                    'svgo-loader',
                ],
                exclude: /images\/(?!icon\/)/,
                include: /images\/icon\//,
            },
        ],
    },
    plugins: [
        new SpriteLoaderPlugin({ plainSprite: true }),
        new CopyWebpackPlugin([
            {
                from: pathAlias.images,
                to: 'images/',
                ignore: ['icon/*.svg'],
            },
            {
                from: pathAlias.lib,
                to: 'lib/',
            },
        ]),
        
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            loaders: ['babel-loader'],
        }),

        new HappyPack({
            id: 'style',
            threadPool: happyThreadPool,
            loaders: [
                {
                    loader: 'css-loader',
                    options: {
                        url: true,
                    },
                },
                'postcss-loader',
                'less-loader',
                {
                    loader: 'style-resources-loader',
                    options: {
                        patterns: path.resolve(pathAlias.view, 'less/pre/_export.less'),
                    },
                },
            ],
        }),
    ],
    externals: {
        jquery: 'jQuery',
        lodash: '_',
        react: 'React',
        'react-dom': 'ReactDOM',
    },
}
