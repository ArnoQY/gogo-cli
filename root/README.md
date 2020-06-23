## 工作流使用说明

gogo-cli 是聚焦于静态打包的、简单的React脚手架

### 安装

```sh

```

### 初始化

gogo-cli 提供快速初始化项目的能力。

在新项目目录下执行 `gogo init`，即可初始化新项目 `gogo` 会自动完成依赖包安装。


### CLI

gogo-cli 的设计初衷是为了方便快速启动项目、快速输出静态稿。

因此总体设计上是基于【页面】来打包的，没有路由，不建议在生产环境使用。

所有命令由 `gogo` 开头，配置项是根目录的 `gogo.config.js`。

编译打包分为 `build` `start` 两种环境，`-m` `-p` 两种模式:

#### -m -s 模式

> `-m` 指定父目录，默认 `pages` > `-s`(可选) 指定后代目录，无视层级，后代即可。默认为 `/`，即所有后代。

该模式会遍历目录下的所有文件夹，每当文件夹下有 `index.js` 时，就将该文件夹作为一个页面来解析。

在不需要任何引用的情况下，该模式打包出的所有页面依赖 `view/less/_export.less` 中的样式，`_export` 最终输出为项目的主样式 `style.css`。

如果在 `js` 中单独引用了其他 `less` 文件，被引文件会被单独打包为一个新的 `css` 文件。

#### -p 模式

> `-p` 布尔值

该模式会读取 `gogo.config.js` 中的 `plusEntry` 属性，将该属性作为入口进行打包，等同于 `webpack.entry`。

为了扩展自由度，摆脱对主样式的依赖，`-p` 模式没有额外的样式依赖，如果需要引用样式，可以使用数组的方式编写：`['entry.js', '*.less']`

#### 举例

> 开发环境编译 `pages` 目录： `gogo start -m`
> 开发环境编译 `pages` 目录下的 `test` 子目录： `gogo start -m -s test`
> 开发环境编译 `custom` 目录下的 `test` 子目录： `gogo start -m custom -s test`

> 生产环境打包 `pages` 目录： `gogo build -m`
> 生产环境打包 `pages` 目录下的 `test` 子目录： `gogo build -m -s test`
> 生产环境打包 `custom` 目录下的 `test` 子目录： `gogo build -m custom -s test`

> 开发环境编译 `plusEntry`： `gogo start -p`
> 生产环境编译 `plusEntry`： `gogo build -p`

### Icon

gogo-cli 单独针对 icon 做了处理，目的是使 icon 更好管理、内部结构暴露可操作、可任意变色。

`view/images/icon/` 下的所有 svg 文件会被自动识别打成 `icon.bundle.js`。

该文件保留了 icon 的信息并作为 `components/Icon` 组件的前置依赖，在页面中应提前使用 `script` 加载 `icon.bundle.js`。

该功能会监听 `DOMContentLoaded` 事件，将 icon 以 `symbol` 的形式挂载到 `DOM` 上，`Icon` 组件再通过 `svg use` 去调用。

注意， `icon.bundle.js` 应与样式文件一同更新 `CDN`。

使用时流程如下：

1. 将 `icon` 的 `svg` 文件（最好已经轮廓化、`icon` 是标准的 32\*32 结构）放到 `view/images/icon/` 目录下。

2. 引入`components/Icon` 组件，并使用：

```jsx
import Icon from 'components/Icon'

<Icon type='test' color='[color]' size='[number]'>
```
