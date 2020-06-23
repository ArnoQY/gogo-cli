// 开发环境编译

import gulp from 'gulp'
import webpack from 'webpack'
import merge from 'webpack-merge'
import WebpackDevServer from 'webpack-dev-server'
import ProgressPlugin from 'webpack/lib/ProgressPlugin'

import '../help/config'
import argv from '../help/argv'

import { initEntry, initHTML } from './base'

const outputPath = global.gogoConfig.outputPath

gulp.task('start-pack', (cb) => {
    const pack = global.gogoConfig.pack
    const devServer = global.gogoConfig.dev
    const pathAlias = global.gogoConfig.pathAlias

    import(pack && pack.start ? pack.start : '../pack/webpack.start.config').then((startConfig) => {
        const config = merge(startConfig.default, {
            entry: initEntry(),
            output: { path: outputPath },
            plugins: [
                ...initHTML(),
                new webpack.DefinePlugin({
                    BUILD_MODE: 'production',
                    DIR: JSON.stringify(argv.dir || null),
                }),
            ],
        })

        //webpack的运行目录放到工作目录中去，即所有的loader来自于工作目录的node_module
        //在loader中的路径很容易依赖工作目录
        process.chdir(argv.root)

        //NodeAPI需要调用该方法生成hot-updata的entries
        WebpackDevServer.addDevServerEntrypoints(config, devServer)

        const compiler = webpack(config)

        compiler.apply(
            new ProgressPlugin(function (percentage, msg, current, active, modulepath) {
                if (process.stdout.isTTY && percentage < 1) {
                    process.stdout.cursorTo(0)
                    modulepath = modulepath ? ' …' + modulepath.substr(modulepath.length - 30) : ''
                    current = current ? ' ' + current : ''
                    active = active ? ' ' + active : ''
                    process.stdout.write(
                        (percentage * 100).toFixed(0) + '% ' + msg + current + active + modulepath + ' '
                    )
                    process.stdout.clearLine(1)
                } else if (percentage === 1) {
                    process.stdout.write('\n')
                    console.log('webpack: done.')
                }
            })
        )

        new WebpackDevServer(compiler, {
            compress: devServer.compress,
            inline: devServer.inline,
            hot: devServer.hot,
            port: devServer.port,
            host: devServer.host,
            stats: devServer.stats,
            contentBase: pathAlias.dist,
            writeToDisk: (filePath) => {
                return /\.html$/.test(filePath)
            },
            stats: {
                colors: true,
            },
        }).listen(devServer.port, 'localhost', (err) => {
            if (err) console.error(err)
            cb()
        })
    })
})
