/*
 * 命令行参数配置
 */

import yargs from 'yargs'

export default yargs
    .options({
        main: {
            alias: 'm',
            describe: 'set father directory',
        },
        sub: {
            alias: 's',
            describe: 'set target directory',
        },
        root: {
            alias: 'r',
            describe: 'cwd',
        },
        plus: {
            alias: 'p',
            type: 'boolean',
            describe: '编译plusEntry',
        },
    })
    .help().argv