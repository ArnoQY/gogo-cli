## 工作流使用说明

项目使用组内开发的脚手架 gogo-cli

### 安装

如果之前有安装过，建议 `uninstall` 以后重新安装，因为依赖较多，`update` 可能会残留之前的特性。

```sh
npm config set registry http://r.tnpm.oa.com
npm config set proxy http://127.0.0.1:12639
npm config set https-proxy http://127.0.0.1:12639
// 需要全局安装gulp
sudo npm install -g gulp
// 依赖构建需要开启npm的root权限
sudo npm install -g gogo-cli --unsafe-perm=true --allow-root
```

<br />

### 初始化 init

gogo-cli 提供快速初始化项目的能力。

确保 `npm` 已设置内网代理及源的前提下，在新项目目录下执行：

```sh
gogo init
```

即可初始化新项目，会自动完成依赖包安装。

在根目录的配置文件 `gogo.config.js` 中，可以指定需要依赖的 `webpack` 文件路径、项目名及版本号等。

未来开放的更多能力也将通过该文件进行配置。

<br />

### 编译打包 start build

gogo-cli 的设计初衷是为了方便【重构】快速启动项目、快速输出静态稿。

因此总体设计上是基于【页面】来打包的，没有路由，不建议前端同学在生产环境使用。

所有命令由 `gogo` 开头，配置项是根目录的 `gogo.config.js`。

编译打包分为 `build` `start` 两种环境，`-m` `-p` 两种模式:

打包出来的页面模板默认是 `view/template/template.html`，如果在指定目录下也有 `template.html` 的话，则使用指定目录的模板。

#### -m -s 模式

> `-m` 指定父目录，默认 `pages`
> `-s`(可选) 指定后代目录，无视层级，后代即可。默认为 `/`，即所有后代。

该模式会遍历目录下的所有文件夹，每当文件夹下有 `index.js` 时，就将该文件夹作为一个页面来解析。

该模式会将所有 `chunk` 中手动引入的 `less` 文件，以及 `view/less/_export.less` 文件打到一个文件中，最后输出一个 `css`。

#### -p 模式

> `-p` 布尔值

该模式会读取 `gogo.config.js` 中的 `plusEntry` 属性，将该属性作为入口进行打包，等同于 `webpack.entry`。

为了扩展自由度，摆脱对主样式的依赖，`-p` 模式没有额外的样式依赖。

如果需要引用样式，可以使用数组的方式编写：`['entry.js', '*.less']`，也可以在 `js` 中手动引入。

该模式会将针对每个 `chunk` 分别单独输出一份 `css`。

#### 举例

> 开发环境编译 `pages` 目录： `gogo start -m`
> 开发环境编译 `pages` 目录下的 `test` 子目录： `gogo start -m -s test`
> 开发环境编译 `custom` 目录下的 `test` 子目录： `gogo start -m custom -s test`

> 生产环境打包 `pages` 目录： `gogo build -m`
> 生产环境打包 `pages` 目录下的 `test` 子目录： `gogo build -m -s test`
> 生产环境打包 `custom` 目录下的 `test` 子目录： `gogo build -m custom -s test`

> 开发环境编译 `plusEntry`： `gogo start -p`
> 生产环境编译 `plusEntry`： `gogo build -p`

<br />

### Icon 处理

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

<Icon type='AMS' color='[color]' size='[number]'>
```

3. `build` 后，将 `icon.bundle.js` 发布至 `CDN`，并提醒前端同学前置引入。
