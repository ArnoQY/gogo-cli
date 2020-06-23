// 清除项生产环境文件夹

import del from 'del'
import gulp from 'gulp'

import '../help/config'

const outputPath = global.gogoConfig.outputPath

gulp.task('clean', (cb) => {
    del([`${outputPath}`], { force: true })
    cb()
})
