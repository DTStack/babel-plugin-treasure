# babel-plugin-treasure

![NPM version](https://img.shields.io/badge/npm-v0.9.0-blue) ![Build Status](https://img.shields.io/badge/build-passing-orange) ![Coverage Status](https://img.shields.io/badge/coverage-97%25-brightgreen) ![License Status](https://img.shields.io/badge/license-MIT-lightgrey)  
Based on babel-plugin-import, we are committed to realizing the AST optimization requirements of the unified library and responding to the requirements of various AST node modification operations. Currently used in a unified and convenient way to solve the on-demand loading requirements of any component library

---

- [English Instruction](./README.md)
- [中文说明](./README.CN.md)

## Difference with babel-plugin-import

### Optimization points

- No destructive changes, compatible with all APIs of the original babel-plugin-import
- Support component name or method name size conversion
- Support inputting custom path nodes in the form of objects
- Support exporting components whose entry is part of the default attribute
- Support react17+ jsx new conversion

### Fix point

- Fixed the bug that babel-plugin-import did not convert the switch related AST tree

## Install

```javascript
// use npm
npm i babel-plugin-treasure --save-dev

// use yarn
yarn add babel-plugin-treasure -D
```

## Usage

Can be used in the following two ways

- [babelrc](https://babeljs.io/docs/usage/babelrc/)
- [babel-loader](https://github.com/babel/babel-loader)

Add to `.babelrc` or babel-loader.

```js
{
  "plugins": [["treasure", options]]
}
```

### Configuration

ʻOptions` can be an object.

```javascript
{
  "libraryName": "dt-react-component",
  "style": true, // or'css'
}
```

ʻOptions` can be an array, but it does not support setting in the babel@7+ environment

```javascript
[
  {
    libraryName: 'dt-react-component',
    style: true, // or'css'
  },
];
```

ʻOptions` cannot be an array in the babel@7+ environment, but you can add a name to the plugin to support reuse.

such as:

```javascrit
// .babelrc
"plugins": [
  ["import", {"libraryName": "dt-react-component", "libraryDirectory": "lib"}, "dtcomponent"],
  ["import", {"libraryName": "lodash", "libraryDirectory": "lib"}, "lodash"]
]
```

### Load libraries on demand

When you simply import the library in the project, you only need to add the following configuration. For example, configure dt-react-component:

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

Note: When you have multiple libraries in your development project that need to be loaded on demand, you can add an alias to distinguish it, for example, dt-react-component is used with antd:

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

## API

### libraryName

The name of the library needs to be imported as required, which is required.

#### `{ "libraryName": "dt-react-component" }`

### libraryDirectory

Formulate the package format directory of the library, generally lib, es, esm, umd, etc., which are determined by the package developer. The default value of this option is lib

#### `{ libraryDirectory: "lib" }`

### style

Do you need to load css files on demand, not enabled by default Note: Load the css precompiled file (less/scss) when the style is set to true, and load the css file when it is set to css.

Load the css precompiled file:

#### `{ libraryDirectory: true }`

Load the css file:

#### `{ libraryDirectory: "css" }`

### styleLibraryDirectory

The library package for making css files, generally does not need to be written

#### `{ styleLibraryDirectory: "lib" }`

### camel2DashComponentName

There are four parameters for the conversion of the component name, and the default is true. The conversion rules are as follows:

```js
import {ChromeDownload} from'dt-react-component'

      ↓ ↓ ↓ ↓ ↓ ↓

// When camel2DashComponentName: true
ChromeDownload → chrome-download

// When camel2DashComponentName: false
ChromeDownload → ChromeDownload // No changes

// When camel2DashComponentName: "lower"
ChromeDownload → chromeDownload // convert lower camel

// When camel2DashComponentName: "upper"
ChromeDownload → ChromeDownload // convert upper camel
```

### camel2UnderlineComponentName

Handle multi-word components with \_ for word segmentation

```js
import { ChromeDownload } from'dt-react-component'

      ↓ ↓ ↓ ↓ ↓ ↓

ChromeDownload → chrome_download
```

### transformToDefaultImport

Process the attributes of the default import library, the default is true. You can give an array, and the components in the array will not be exported in the default form. If your library is not imported by default at all, please set the option to false For example:

```js
// Set transformToDefaultImport: [ChromeDownload]
import { ChromeDownload, Circle } from'dt-react-component'

      ↓ ↓ ↓ ↓ ↓ ↓

import _Circle from "dt-react-component/lib/circle";
import { ChromeDownload as _ChromeDownload } from "dt-react-component/lib/chromeDownload";
```

### customName

Handle individual sequences with irregular rules, support function, object and path import

```js
// Function form
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

After processing, it will become like this

```js
import {GoBack} from "antd"

↓ ↓ ↓ ↓ ↓ ↓

var _button = require('antd/lib/go-back');
```

```js
// Object form
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

Note: When you use a function, the function parameter is the name converted by styleLibraryDirectory or camel2DashComponentName. When you use an object as a parameter, the key of the object will not undergo a special conversion. The same is true for customStyleName. In addition, you can also choose the reference path:

```js
// reference path
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

`customName.js` is similar:

```js
module.exports = function customName(name) {
  return `dt-react-component/lib/${name}`;
};
```

#### customStyleName

Same as customName, but used to process the style file path

#### fileName

Process links to specific files, such as:

```js
// Object form
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

The result after conversion is as follows:

```js
import {ChromeDownload} from'dt-react-component'

↓ ↓ ↓ ↓ ↓ ↓

import'dt-react-component/lib/chrome-download/exmaple'
```

## Roadmap

- Make timely updates with changes in various libraries
- Support more AST type operations
- Dynamic configuration of AST operation function type according to treasure IDE

## License

[MIT](./LICENSE)
