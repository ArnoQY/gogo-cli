// 生产环境 webapck配置

import merge from 'webpack-merge'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import baseConfig from './webpack.base.config'

const proj = global.gogoConfig.proj

export default merge(baseConfig, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=style'],
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
                            // CSS相对路径
                            publicPath: '../',
                        },
                    },
                ],
                exclude: /images\/icon\//,
            },
        ],
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            //[hash] || [name] || [id]，默认添加id
            filename: `css/[name]${proj.version.length ? '-' + proj.version : ''}.css`,
            //样式跟随组件走，不同页面引入顺序不一致时，出来的样式也不一致，这是样式分散的既有风险
            //写得好的样式应该做到不同less文件间不会有顺序依赖，因此关掉这个提示
            ignoreOrder: true,
        }),
        // new MiniCssExtractPluginCleanup([
        //     new RegExp(`${proj.cssName}\.bundle\.js$`),
        // ]),
    ],
})
