# babel-plugin-treasure

## 为什么取名 babel-plugin-treasure

致力于成为 babel-plugin 百宝箱，满足企业内部 AST 的各种需求，目前用于统一式便捷解决 dt-react-component 与 ant-design-dtinsight-theme 的按需加载需求

## 如何使用 babel-plugin-treasure

- [babelrc](https://babeljs.io/docs/usage/babelrc/)
- [babel-loader](https://github.com/babel/babel-loader)

## 事例

#### `{ "libraryName": "antd" }`

```javascript
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('antd/lib/button');
ReactDOM.render(<_button>xxxx</_button>);
```

#### `{ "libraryName": "antd", style: "css" }`

```javascript
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('antd/lib/button');
require('antd/lib/button/style/css');
ReactDOM.render(<_button>xxxx</_button>);
```

#### `{ "libraryName": "antd", style: true }`

```javascript
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('antd/lib/button');
require('antd/lib/button/style');
ReactDOM.render(<_button>xxxx</_button>);
```

Note : 当设置 style 为 true 的时候加载 css 预编译文件，设置为 css 时加载 css 文件.

## 使用说明

```bash
npm install babel-plugin-import --save-dev
```

添加到 `.babelrc` 或 babel-loader.

```js
{
  "plugins": [["import", options]]
}
```

### 属性

`options` 可以是一个对象.

```javascript
{
  "libraryName": "antd",
  "style": true,   // or 'css'
}
```

```javascript
{
  "libraryName": "lodash",
  "libraryDirectory": "",
  "camel2DashComponentName": false,  // default: true
}
```

```javascript
{
  "libraryName": "@material-ui/core",
  "libraryDirectory": "components",  // default: lib
  "camel2DashComponentName": false,  // default: true
}
```

~`options` 可以是一个数组.~ 它不支持在 babel@7+ 环境中设置

举例如下:

```javascript
[
  {
    libraryName: 'antd',
    libraryDirectory: 'lib', // default: lib
    style: true,
  },
  {
    libraryName: 'antd-mobile',
  },
];
```

`Options` 在 babel@7+环境中不能是数组, 但是你可以给插件添加一个名字来支持复用.

For Example:

```javascrit
// .babelrc
"plugins": [
  ["import", { "libraryName": "antd", "libraryDirectory": "lib"}, "antd"],
  ["import", { "libraryName": "antd-mobile", "libraryDirectory": "lib"}, "antd-mobile"]
]
```

#### style

- `["import", { "libraryName": "antd" }]`: import js modularly
- `["import", { "libraryName": "antd", "style": true }]`: import js and css modularly (LESS/Sass source files)
- `["import", { "libraryName": "antd", "style": "css" }]`: import js and css modularly (css built files)
