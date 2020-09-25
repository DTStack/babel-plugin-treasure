# babel-plugin-treasure

## 根源

为什么在有 tree-shaking 的现在我们还需要这个插件？  
此插件的作用在于帮你对你所引用的库进行 tree-shaking，关于项目内部的 tree-shaking 奥秘以及更多的奥秘请看文[你的 tree-shaking 其实并没什么软用](https://note.youdao.com/)

## 为什么取名 babel-plugin-treasure

致力于成为 babel-plugin 百宝箱，各种对 AST 节点修改操作的诉求，目前用于统一式便捷解决 dt-react-component 与 ant-design-dtinsight-theme 的按需加载需求

## 安装 babel-plugin-treasure

```javascript
// 使用npm
npm i babel-plugin-treasure --save-dev

// 使用yarn
yarn add babel-plugin-treasure -D
```

## 使用前注意事项

**删除应用入口处的 antd 或者 dt-react-component 的样式引入**，因为插件会帮你自动做。

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

### 属性

`options` 可以是一个对象.

```javascript
{
  "libraryName": "dt-react-component",
  "style": true,   // or 'css'
}
```

`options` 可以是一个数组,但不支持在 babel@7+ 环境中设置

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
        "transformToDefaultImport"": [
          "ContextMenu",
          "BreadcrumbRender",
          "Circle",
          "RenderFormItem",
          "FullScreenButton"
        ],
        "camel2DashComponentName": "lower",
        "customName": {
          "goBack": "dt-react-component/lib/go-back",
          "contextMenu": "dt-react-component/lib/context-menu",
          "easySelect": "dt-react-component/lib/easy-select",
          "spreadSheet": "dt-react-component/lib/spreadsheet",
          "markdownRender": "dt-react-component/lib/markdown-render",
          "breadcrumbRender": "dt-react-component/lib/breadcrumb",
          "keyEventListener": "dt-react-component/lib/keyCombiner/listener",
          "fullScreenButton": "dt-react-component/lib/fullscreen",
          "switchWindow": "dt-react-component/lib/window",
          "renderFormItem": "dt-react-component/lib/formComponent"
        }
      }
    ]
  ]
```

注意：当你开发的项目中有使用 antd 的时候，请注意由于 dt-react-component 依赖于 antd，所以需要两者都进行配置，实现协同按需加载

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
        "transformToDefaultImport"": [
          "ContextMenu",
          "BreadcrumbRender",
          "Circle",
          "RenderFormItem",
          "FullScreenButton"
        ],
        "camel2DashComponentName": "lower",
        "customName": {
          "goBack": "dt-react-component/lib/go-back",
          "contextMenu": "dt-react-component/lib/context-menu",
          "easySelect": "dt-react-component/lib/easy-select",
          "spreadSheet": "dt-react-component/lib/spreadsheet",
          "markdownRender": "dt-react-component/lib/markdown-render",
          "breadcrumbRender": "dt-react-component/lib/breadcrumb",
          "keyEventListener": "dt-react-component/lib/keyCombiner/listener",
          "fullScreenButton": "dt-react-component/lib/fullscreen",
          "switchWindow": "dt-react-component/lib/window",
          "renderFormItem": "dt-react-component/lib/formComponent"
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
- 支持导入没有 default 入口的组件

### 修复点

- 修复 babel-plugin-import 没有对 switch 节点进行转换的 Bug

## 插件 API 列表

### libraryName

需要按需引入 library 的名称，必填。

#### `{ "libraryName": "dt-react-component" }`

### libraryDirectory

制定 library 的包格式目录，一般有 lib, es, esm, umd 等，由包开发者制定。此选项默认值为 lib

#### `{ libraryDirectory: "lib" }`

### style

是否需要按需加载 css 文件，默认不开启  
Note : 当设置 style 为 true 的时候加载 css 预编译文件(less/scss)，设置为 css 时加载 css 文件.

加载 css 预编译文件：

#### `{ libraryDirectory: true }`

加载 css 文件：

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
// camel2DashComponentName: "upper"
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

处理默认导入，你可以给予一个数组，在数组中的组件，最后不会以默认形式进行导出。默认为 true， 如果你的组件完全没有默认导入，请把选项设置为 false

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

## 关于优化点的说明

### customName

虽然 customName 支持了以对象作为参数，但是相比函数作为参数有一个很明显的不足之处：当函数作为 customName 的 value 时，插件会返回组件当前的名称，你将在插件返回的组件名称的基础上进行修改，而对象的形式**你必须预测到组件被插件修改后的名称**，并给予转换后的路径。  
举个例子：如果你设置了"camel2DashComponentName": "lower"。并且在代码中导入了

```js
import { ChromeDownload } from 'dt-react-component';
```

```js
// bad, useless
[
    "treasure",
    {
        ...,
        "customName": {
            "ChromeDownload":"dt-react-component/lib/chrome-download"
        }
    }
]

```

```js
// good
// 由于你设置了lower，所以必须手动将key变成小驼峰的形式:chromeDownload
[
    "treasure",
    {
        ...,
        "customName": {
            "chromeDownload":"dt-react-component/lib/chrome-download"
        }
    }
]
```

其他支持以对象作为参数的属性同理。
