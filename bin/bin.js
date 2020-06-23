#!/usr/bin/env node

// 命令行封装

const path = require('path')
const yargs = require('yargs')
const spawn = require('child_process').spawn

yargs
    .command(
        'init',
        'init gogo structure',
        {
            root: {
                alias: 'r',
                describe: '设置根目录',
            },
        },
        function (argv) {
            spawn(
                'gulp',
                ['init', '--r', process.cwd(), '--color', '--gulpfile', path.join(__dirname, '../', 'gulpfile.js')],
                {
                    stdio: 'inherit',
                    shell: true,
                }
            )
        }
    )
    .command(
        'start',
        'start development',
        {
            main: {
                alias: 'm',
                describe: '设置父目录，默认为pages',
            },
            sub: {
                alias: 's',
                describe: '设置编译目录',
            },
            root: {
                alias: 'r',
                describe: '设置根目录',
            },
            plus: {
                alias: 'p',
                type: 'boolean',
                describe: '编译plusEntry',
            },
        },
        function (argv) {
            let mainCMD = argv.main
                ? [
                      '-m',
                      typeof argv.main === 'string' ? argv.main : 'pages',
                      '-s',
                      typeof argv.sub === 'string' ? argv.sub : '/',
                  ]
                : []
            let plusCMD = argv.plus ? ['-p'] : []
            spawn(
                'gulp',
                [
                    'start',
                    '-r',
                    process.cwd(),
                    ...mainCMD,
                    ...plusCMD,
                    '--color',
                    '--gulpfile',
                    path.join(__dirname, '../', 'gulpfile.js'),
                ],
                {
                    stdio: 'inherit',
                    shell: true,
                }
            )
        }
    )
    .command(
        'build',
        'build production',
        {
            main: {
                alias: 'm',
                describe: '设置父目录，默认为pages',
            },
            sub: {
                alias: 's',
                describe: '设置编译目录',
            },
            root: {
                alias: 'r',
                describe: '设置根目录',
            },
            plus: {
                alias: 'p',
                type: 'boolean',
                describe: '编译plusEntry',
            },
        },
        function (argv) {
            let mainCMD = argv.main
                ? [
                      '-m',
                      typeof argv.main === 'string' ? argv.main : 'pages',
                      '-s',
                      typeof argv.sub === 'string' ? argv.sub : '/',
                  ]
                : []
            let plusCMD = argv.plus ? ['-p'] : []
            spawn(
                'gulp',
                [
                    'build',
                    '-r',
                    process.cwd(),
                    ...mainCMD,
                    ...plusCMD,
                    '--color',
                    '--gulpfile',
                    path.join(__dirname, '../', 'gulpfile.js'),
                ],
                {
                    cwd: process.cwd(),
                    stdio: 'inherit',
                    shell: true,
                }
            )
        }
    )
    .help().argv
