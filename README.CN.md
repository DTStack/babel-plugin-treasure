# babel-plugin-treasure

基于 babel-plugin-import 致力于实现统一库的 AST 优化要求，应对各种 AST 节点修改操作的诉求。目前用于统一式便捷解决任何组件库的按需加载需求

## 与 babel-plugin-import 的区别

### 优化点

- 无破坏性改动，兼容原本 babel-plugin-import 的所有 API
- 支持组件名或者方法名大小驼峰名称转换
- 支持以对象的形式输入自定义路径节点
- 支持导出入口是部分 default 属性的组件
- 支持 react17+ jsx 新转换

### 修复点

- 修复 babel-plugin-import 未对 switch 相关 AST 树进行转换的错误

## 安装

```javascript
// 使用 npm
npm i babel-plugin-treasure --save-dev

// 使用 yarn
yarn add babel-plugin-treasure -D
```

## 使用说明

可通过以下两种途径进行使用

- [babelrc](https://babeljs.io/docs/usage/babelrc/)
- [babel-loader](https://github.com/babel/babel-loader)

添加到 `.babelrc` 或 babel-loader.

```js
{
  "plugins": [["treasure", options]]
}
```

### 配置

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

### 按需加载库

当你在项目中单纯引入库时，你只需要添加如下配置即可。 例如配置 dt-react-component：

```javascript
  "plugins": [
    [
      "treasure",
      {
        "libraryName": "dt-react-component",
        "libraryDirectory": "lib",
        "camel2DashComponentName": "lower",
        "style": "css"
      }
    ]
  ]
```

注意：当你开发的项目中有多个库均需要使用按需加载，可以加一个别名已进行区分，例如 dt-react-component 与 antd 一起使用：

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
        "camel2DashComponentName": "lower",
        "style": "css"
      },
      "dt-react-component"
    ]
  ]
```

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

// 当 camel2DashComponentName: true
ChromeDownload → chrome-download

// 当 camel2DashComponentName: false
ChromeDownload → ChromeDownload // 不做改动

// 当 camel2DashComponentName: "lower"
ChromeDownload → chromeDownload // 转换小驼峰

// 当 camel2DashComponentName: "upper"
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

处理默认导入库的属性，默认为 true。你可以给予一个数组，在数组中的组件，最后不会以默认形式进行导出。  
如果你的库完全没有默认导入，请把选项设置为 false  
举例：

```js
// 设置 transformToDefaultImport:[ChromeDownload]
import { ChromeDownload, Circle } from 'dt-react-component'

      ↓ ↓ ↓ ↓ ↓ ↓

import _Circle from "dt-react-component/lib/circle";
import { ChromeDownload as _ChromeDownload } from "dt-react-component/lib/chromeDownload";
```

### customName

处理个别不统一规则的序列，支持函数，对象与路径导入

```js
// 函数形式
[
  'import',
  {
    libraryName: 'dt-react-component',
    customName: (name: string) => {
      if (name === 'go-back') {
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

var _button = require('antd/lib/go-back');
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

说明：当你使用函数时，函数形参是经过 styleLibraryDirectory 或 camel2DashComponentName 转换后的的名称，当你使用对象作为参数时，对象的 key 不会经过特殊转换，customStyleName 同理。  
除此之外，你还可以选择引用路径：

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

`customName.js`类似：

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

## 路线图

- 随着各类库的变革做出及时更新
- 支持更多的 AST 类型操作
- 根据 treasure IDE 动态配置 AST 操作功能类型

## 执照

MIT
