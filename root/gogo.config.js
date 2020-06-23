const path = require('path')

module.exports = {
    proj: {
        //样式文件名
        cssName: 'style',
        //版本号
        version: '',
    },
    //输出路径
    outputPath: path.resolve(__dirname, 'dist'),
    //自定义开发/生产环境配置，为空则使用cli内置的config
    pack: {
        start: path.resolve(__dirname, 'pack/webpack.start.config.js'),
        build: path.resolve(__dirname, 'pack/webpack.build.config.js'),
    },
    //路径别名，在任务流使用，预置勿删，会直接赋给webpack.resolve.alias
    pathAlias: {
        root: path.resolve(__dirname),
        dist: path.resolve(__dirname, 'dist'),
        view: path.resolve(__dirname, 'view'),
        pages: path.resolve(__dirname, 'pages'),
        lib: path.resolve(__dirname, 'lib'),
        components: path.resolve(__dirname, 'components'),
        images: path.resolve(__dirname, 'view/images'),
    },
    //指定其他入口，每一项单独构建chunk
    //自定义模板支持string和array，遍历非文件路径来查找
    plusEntry: {
        home: path.resolve(__dirname, 'home'),
    },
    //开发环境webpack-dev-server配置
    dev: {
        compress: false,
        //inline使得更新的代码编译到bundle中
        //在不用build的情况下浏览器也能拿到文件
        inline: true,
        hot: true,
        //热更新对应接口，自动递增
        port: 3000,
        //browser-sync对应的接口，自动递增
        browserPort: 8000,
        //port和host使得node-sock API能够拿到热更新
        host: 'localhost',
        stats: {
            all: false,
            modules: true,
            maxModules: 0,
            errors: true,
            warnings: true,
            assets: true,
            moduleTrace: true,
            errorDetails: true,
            colors: true,
        },
        //webpack-dev-server强制编译到内存里，通过中间件webpack-dev-middleware的配置
        //使得所有文件强制编译到硬盘上，包括热更新文件
        //writeToDisk: true,
    },
}
