// 批量处理icon

import gulp from 'gulp'
import webpack from 'webpack'
import merge from 'webpack-merge'

import '../help/config'
import argv from '../help/argv'

gulp.task('icon', (cb) => {
    import('../pack/webpack.icon.config').then((iconConfig) => {
        const config = merge(iconConfig.default, {
            watch: !(argv._.indexOf('build') > -1),
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
