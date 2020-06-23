// 生产环境 webapck配置
import path from 'path'

const proj = global.gogoConfig.proj
const pathAlias = global.gogoConfig.pathAlias
const outputPath = global.gogoConfig.outputPath

export default {
    mode: 'production',
    entry: {
        icon: path.resolve(pathAlias.components, 'Icon/_dynamic.js'),
    },
    output: {
        path: outputPath,
        filename: `js/[name]${proj.version && proj.version.length !== 0 ? '-' + proj.version : ''}.js`,
        library: 'GOGO_ICON',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                parser: {
                    requireContext: true,
                },
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: 'gogoIcon-[name]',
                            esMoudle: true,
                        },
                    },
                    'svg-transform-loader',
                    'svgo-loader',
                ],
                //windows的斜杠是反斜杠= =
                exclude: /images[\/|\\](?!icon[\/|\\])/,
                include: /images[\/|\\]icon[\/|\\]/,
            },
        ],
    },
    resolve: {
        alias: pathAlias,
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
    },
    externals: {
        jquery: 'jQuery',
        lodash: '_',
        react: 'React',
        'react-dom': 'ReactDOM',
    },
}
