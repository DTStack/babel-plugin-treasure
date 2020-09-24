# babel-plugin-treasure

## 为什么取名 babel-plugin-treasure

致力于成为 babel-plugin 百宝箱，各种对 AST 节点修改操作的诉求，目前用于统一式便捷解决 dt-react-component 与 ant-design-dtinsight-theme 的按需加载需求

## 安装 babel-plugin-treasure

```javascript
// 使用npm
npm i babel-plugin-import --save-dev

// 使用yarn
yarn add babel-plugin-import -D
```

### 属性

`options` 可以是一个对象.

```javascript
{
  "libraryName": "dt-react-component",
  "style": true,   // or 'css'
}
```

`options` 可以是一个数组.~ 它不支持在 babel@7+ 环境中设置

```javascript
[
  {
    libraryName: 'dt-react-component',
    style: true, // or 'css'
  },
];
```

`options` 在 babel@7+环境中不能是数组,但是你可以给插件添加一个名字来支持复用.

比如:

```javascrit
// .babelrc
"plugins": [
  ["import", { "libraryName": "dt-react-component", "libraryDirectory": "lib"}, "dtcomponent"],
  ["import", { "libraryName": "lodash", "libraryDirectory": "lib"}, "lodash"]
]
```

## 使用前需要注意点

==**删除应用入口处的 antd 或者 dt-react-component 的样式引入**==，因为插件会帮你自动做。

```javascrit
// 不需要添加这些样式！
// import 'antd/dist/antd.css';
// import 'antd/dist/antd.less'
```

## 如何使用 babel-plugin-treasure

可通过以下两种途径进行使用

- [babelrc](https://babeljs.io/docs/usage/babelrc/)
- [babel-loader](https://github.com/babel/babel-loader)

添加到 `.babelrc` 或 babel-loader.

```js
{
  "plugins": [["treasure", options]]
}
```

### 按需加载 dt-react-component

当你在项目中单纯引入 dt-react-component 的时候，您只需如下配置:

```javascript
  "plugins": [
    [
      "treasure",
      {
        "libraryName": "dt-react-component",
        "libraryDirectory": "lib",
        "style": "css",
        "camel2DashComponentName": "lower",
        "customName": {
          "GoBack": "dt-react-component/lib/go-back",
          "ContextMenu": "dt-react-component/lib/context-menu",
          "EasySelect": "dt-react-component/lib/easy-select",
          "SpreadSheet": "dt-react-component/lib/spreadsheet",
          "MarkdownRender": "dt-react-component/lib/markdown-render",
          "BreadcrumbRender": "dt-react-component/lib/breadcrumb",
          "KeyEventListener": "dt-react-component/lib/keyCombiner/listener",
          "FullScreenButton": "dt-react-component/lib/fullscreen",
          "SwitchWindow": "dt-react-component/lib/window",
          "RenderFormItem": "dt-react-component/lib/formComponent"
        }
      }
    ]
  ]
```

注意：当你开发的项目中有使用 antd 的时候，请注意由于 dt-react-component 依赖于 antd，所以==需要两者都进行配置==，实现协同按需加载

```javascript
  "plugins": [
    [
      "treasure",
      {
        "libraryName": "antd",
        "libraryDirectory": "lib",
        "style": "css"
      },
      "antd"
    ],
    [
      "treasure",
      {
        "libraryName": "dt-react-component",
        "libraryDirectory": "lib",
        "style": "css",
        "camel2DashComponentName": "lower",
        "customName": {
          "GoBack": "dt-react-component/lib/go-back",
          "ContextMenu": "dt-react-component/lib/context-menu",
          "EasySelect": "dt-react-component/lib/easy-select",
          "SpreadSheet": "dt-react-component/lib/spreadsheet",
          "MarkdownRender": "dt-react-component/lib/markdown-render",
          "BreadcrumbRender": "dt-react-component/lib/breadcrumb",
          "KeyEventListener": "dt-react-component/lib/keyCombiner/listener",
          "FullScreenButton": "dt-react-component/lib/fullscreen",
          "SwitchWindow": "dt-react-component/lib/window",
          "RenderFormItem": "dt-react-component/lib/formComponent"
        }
      },
      "dt-react-component"
    ]
  ]
```

## 与 babel-plugin-import 的区别

### 优化点

- 无破坏性改动，兼容原本 babel-plugin-import 的所有 API
- 支持组件名或者方法名大小驼峰名称转换
- 支持以对象的形式输入自定义路径节点，API：customName: { 别名/组件名: 路径 }，如果没有取别名以组件名命名即可

### 修复点

- 修复 babel-plugin-import 没有对 switch 节点进行转换的 Bug

## 插件 API 列表

### libraryName

需要按需引入 library 的名称，必填。

#### `{ "libraryName": "dt-react-component" }`

### libraryDirectory

制定 library 的包格式目录，一般有 lib, es, esm, umd 等此选项默认值为 lib

#### `{ libraryDirectory: "lib" }`

### style

是否需要按需加载 css 文件，默认不开启  
Note : 当设置 style 为 true 的时候加载 css 预编译文件(less/scss)，设置为 css 时加载 css 文件.

加载 css 预编译文件：

#### `{ libraryDirectory: true }`

加载 css 译文件：

#### `{ libraryDirectory: "css" }`

### styleLibraryDirectory

制定 css 文件的 library 的包，一般不需要写

#### `{ styleLibraryDirectory: "lib" }`

### camel2DashComponentName

制定组件名的转换，参数有四种，默认为 true。转换规则如下所示：

```js
import { ChromeDownload  } from 'dt-react-component'

      ↓ ↓ ↓ ↓ ↓ ↓
```

```js
// camel2DashComponentName: true
ChromeDownload → chrome-download
```

```js
// camel2DashComponentName: false
ChromeDownload → ChromeDownload // 不做改动
```

```js
// camel2DashComponentName: "lower"
ChromeDownload → chromeDownload // 转换小驼峰
```

```js
// camel2DashComponentName: "lower"
ChromeDownload → ChromeDownload // 转换大驼峰
```

### camel2UnderlineComponentName

处理多词构成的组件以\_进行单词分割

```js
import { ChromeDownload } from 'dt-react-component'

      ↓ ↓ ↓ ↓ ↓ ↓
ChromeDownload → chrome_download
```

### transformToDefaultImport

处理默认导入，默认为 true, 如果没有默认导入，请把选项设置为 false

### customName

处理个别不统一规则的序列，支持函数，对象与路径导入

```js
// 函数形式
[
  'import',
  {
    libraryName: 'dt-react-component',
    customName: (name: string) => {
      if (name === 'GoBack') {
        return 'antd/lib/go-back';
      }
      return `antd/lib/${name}`;
    },
  },
];
```

通过处理后，会变成这样

```js
import { GoBack } from "antd"
↓ ↓ ↓ ↓ ↓ ↓
var _button = require('dt-react-component/lib/go-back');
```

```js
// 对象形式
[
  'import',
  {
    libraryName: 'dt-react-component',
    customName: {
      GoBack: 'dt-react-component/lib/go-back',
    },
  },
];
```

最后你可以选择引用一个路径：

```js
// 引用路径
[
  'import',
  {
    libraryName: 'dt-react-component',
    customName: {
      GoBack: require('path').resolve(__dirname, './customName.js'),
    },
  },
];
```

`customName.js`是这样的：

```js
module.exports = function customName(name) {
  return `dt-react-component/lib/${name}`;
};
```

#### customStyleName

与 customName 同理，只是用于处理 style 文件路径

#### fileName

处理链接到具体的文件，例如：

```js
// 对象形式
[
  "import",
    {
      "libraryName": "dt-react-component",
      "fileName": "example"
      "customName": {
         "GoBack": "dt-react-component/lib/go-back",
      }
    }
]
```

转换后结果如下：

```js
import { ChromeDownload } from 'dt-react-component'
↓ ↓ ↓ ↓ ↓ ↓
import 'dt-react-component/lib/chrome-download/exmaple'
```
