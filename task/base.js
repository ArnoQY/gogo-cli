/*
 * gulp: 生成入口/样式列表，构建所需要的打包信息
 */

import os from 'os'
import fs from 'fs'
import path from 'path'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackExcludeAssetsPlugin from 'html-webpack-exclude-assets-plugin'

import '../help/config'
import argv from '../help/argv'

const proj = global.gogoConfig.proj
const pathAlias = global.gogoConfig.pathAlias

//兼容windows的目录写法
const dirSplitStr = os.platform().indexOf('win32') >= 0 ? '\\' : '/'

let dirPath
let entries = []
let style = []

/**
 * @description: main依赖，递归并找到目标路径，赋值给dirPath
 * @param {base: 目标目录名}
 */
const findDir = (base) => {
    //直接编译base
    if (argv.sub === '/') return (dirPath = base)
    fs.readdirSync(base).forEach((item) => {
        const currentDir = path.resolve(base, item)
        //退出点：找到目录
        if (item === argv.sub) return (dirPath = currentDir)
        //退出点：非文件夹
        if (!fs.lstatSync(currentDir).isDirectory()) return
        //向下递归
        if (item !== '.DS_Store' && !item.startsWith('_')) return findDir(currentDir)
        return
    })
}

/**
 * @description: main依赖，递归处理入口/样式队列，保存至entries/style
 * @param {base: 目标目录}
 */
const findFiles = (base) => {
    fs.readdirSync(base).forEach((item) => {
        const currentDir = path.resolve(base, item)
        if (item === 'index.js') {
            
            const baseArr = base.split(dirSplitStr)
            const name = baseArr[baseArr.length - 1]
            baseArr.splice(baseArr.length - 1, 1)
            const path = baseArr.join(dirSplitStr)
            return entries.push({ name, path })
        }
        if (path.extname(item) === '.less') {
            return style.push({
                name: item,
                path: base,
            })
        }
        //退出点：非文件夹
        if (!fs.lstatSync(currentDir).isDirectory()) return
        //向下递归
        if (item !== '.DS_Store' && !item.startsWith('_')) return findFiles(currentDir)
        return
    })
}

/**
 * @description: 生成webpack的entry对象
 * @return: {chunks}
 */
const initEntry = () => {
    let result = {}

    //main命令时，添加自动chunk
    if (argv.main) {
        const defaultEntry = entries.reduce((last, item, i) => {
            const rela = path.relative(path.resolve(pathAlias.root, argv.main), item.path)
            //chunk名直接使用“-”连接的目录名
            let entryName =
                rela.length !== 0 ? (rela.replace('/\\/g', '/') + '/' + item.name).split('/').join('-') : item.name
            //为每个chunk都注入样式依赖
            last[entryName] = [path.resolve(pathAlias.view, 'less/_export.less'), path.resolve(item.path, item.name)]
            return last
        }, {})

        result = Object.assign({}, result, defaultEntry)
    }

    //plus命令时，输出plus chunk
    if (argv.plus) {
        const plusEntry = global.gogoConfig.plusEntry || {}
        result = Object.assign({}, result, plusEntry)
    }

    return result
}

/**
 * @description: 生成htmlWebpackPlugin的构建实例
 * @return: {chunks}
 */
const initHTML = () => {
    let result = []

    //main命令时，输出自动chunk
    if (argv.main) {
        const defaultHTML = entries.reduce((last, item, i) => {
            // 主目录到目标的相对路径
            const rela = path.relative(path.resolve(pathAlias.root, argv.main), item.path)
            // 模板路径
            const tempPath = path.resolve(pathAlias.root, argv.main, item.path, item.name, 'template.html')
            // 直接使用“-”连接的chunk名
            let entryName =
                rela.length !== 0 ? (rela.replace('/\\/g', '/') + '/' + item.name).split('/').join('-') : item.name
            last.push(
                new HtmlWebpackPlugin({
                    // filename: `html/${rela + '/' + item.name}.html`,
                    //平摊到一级目录下
                    filename: `html/${entryName}.html`,
                    title: item.name + '-重构稿',
                    //优先使用目录下制定的模板
                    template: fs.existsSync(tempPath)
                        ? tempPath
                        : path.resolve(pathAlias.view, 'template', 'template.html'),
                    // 非异步的splitchnk一定要引入，否则不会运行
                    chunks: [entryName, proj.cssName, 'sprite'],
                    version: proj.version
                    // excludeAssets: [new RegExp(global.gogoConfig.proj.cssName + '.*.js')],
                })
            )
            return last
        }, [])

        result = result.concat(defaultHTML)
    }

    //plus命令时，输出plus chunk
    if (argv.plus) {
        let tempPath = undefined
        const plusEntry = global.gogoConfig.plusEntry || {}
        const plusHTML = Object.keys(plusEntry).reduce((last, item, i) => {
            const entry = plusEntry[item]
            //如果入口是数组
            if (Array.isArray(entry)) {
                entry.forEach((inItem) => {
                    const itemPath = path.resolve(inItem)
                    //如果是文件夹
                    if (fs.lstatSync(itemPath).isDirectory()) {
                        if (fs.existsSync(path.resolve(itemPath, 'template.html')))
                            tempPath = path.resolve(itemPath, 'template.html')
                    }
                })
            }
            //如果入口是字符串
            if (typeof entry === 'string') {
                //如果是文件夹
                if (fs.lstatSync(entry).isDirectory()) {
                    if (fs.existsSync(path.resolve(entry, 'template.html')))
                        tempPath = path.resolve(entry, 'template.html')
                }
            }

            last.push(
                new HtmlWebpackPlugin({
                    filename: `html/${item}.html`,
                    title: item + '-重构稿',
                    template: fs.existsSync(tempPath)
                        ? tempPath
                        : path.resolve(pathAlias.view, 'template', 'template.html'),
                    chunks: [item, 'sprite'],
                    baseUrl: '',
                })
            )
            return last
        }, [])
        result = result.concat(plusHTML)
    }

    return result.concat([new HtmlWebpackExcludeAssetsPlugin()])
}

//指定main时，搜索文件
;(() => {
    if (argv.main) {
        try {
            findDir(path.resolve(argv.root, argv.main))
            findFiles(dirPath)
        } catch (err) {
            console.error(err)
            throw new Error('当前目录非gogo预期的工作目录')
        }
    }
})()

export { dirPath, entries, style, initEntry, initHTML }
