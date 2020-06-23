/*
 * @Description: 生成gogo项目
 */
import fs from 'fs'
import gulp from 'gulp'
import path from 'path'
import { spawn } from 'child_process'

import argv from '../help/argv'

gulp.task('init', (cb) => {
    gulp.src(path.resolve(__dirname, '../root/**/*')).pipe(gulp.dest(path.resolve(argv.root)), { allowEmpty: true })
    gulp.src(path.resolve(__dirname, '../root/.prettierrc')).pipe(gulp.dest(path.resolve(argv.root)), {
        allowEmpty: true,
    })

    const ignoreTxt = `npm-debug.log\r\nyarn-error.log\r\nnode_modules/\r\n*/node_modules/\r\n.DS_Store\r\n*/.DS_Store\r\n# TODO: Will build all to /dist in the feature\r\nstatic/\r\ndist/\r\n*/dist\r\n*/static\r\n`
    fs.writeFile(path.resolve(argv.root) + '/.gitignore', new Buffer(ignoreTxt), function (err) {
        if (err) {
            console.error('.gitignore文件生成失败')
        } else {
            console.log('.gitignore文件成功生成')
        }
    })

    const npm = spawn('npm', ['install'], {
        cwd: argv.root,
        stdio: 'inherit',
        shell: true,
    })
    npm.on('close', () => {
        cb()
    })
})
