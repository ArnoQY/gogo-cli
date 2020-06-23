// 生产环境打包

import gulp from 'gulp'
import webpack from 'webpack'
import merge from 'webpack-merge'

import '../help/config'
import argv from '../help/argv'

import { initEntry, initHTML } from './base'

const proj = global.gogoConfig.proj
const outputPath = global.gogoConfig.outputPath

//优先获取自定义webpack.config，没有则使用默认的
gulp.task('build-pack', (cb) => {
    const pack = global.gogoConfig.pack
    import(pack && pack.build ? pack.build : '../pack/webpack.build.config').then((buildConfig) => {
        const config = merge(buildConfig.default, {
            entry: initEntry(),
            output: { path: outputPath },
            optimization: {
                splitChunks: {
                    // 主模式时，将不同chunk的所有样式拆到一个css中
                    cacheGroups: argv.main && {
                        style: {
                            name: `${proj.cssName}`,
                            test: /\.less/,
                            chunks: 'all',
                            enforce: true,
                        },
                    },
                },
            },
            plugins: [
                ...initHTML(),
                new webpack.DefinePlugin({
                    BUILD_MODE: 'production',
                    NAME: JSON.stringify(argv.sub || null),
                }),
            ],
        })

        //webpack的运行目录放到工作目录中去，即所有的loader来自于工作目录的node_module
        //在loader中的路径很容易依赖工作目录
        process.chdir(argv.root)

        webpack(config, (err, stats) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(
                stats.toString({
                    chunks: false, // 使构建过程更静默无输出
                    colors: true, // 在控制台展示颜色
                })
            )
            cb()
        })
    })
})
