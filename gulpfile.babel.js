import { src, dest, series } from 'gulp';
import plugin from './src/index';
import { join } from 'path';
import through from 'through2';
import rename from 'gulp-rename';
import babel from 'gulp-babel';

function outputExpectedTask() {
  return src('test/fixtures/**/*/actual.js')
    .pipe(
      through.obj(function(file, _, callback) {
        const pathName = file.relative.match(/[A-Za-z-1-9]+(?=\/)/)[0];
        this.push(pathName);
        callback();
      }),
    )
    .on('data', data => {
      babelForCss(data);
    });
}

function babelForCss(data) {
  return src(`test/fixtures/${data}/actual.js`)
    .pipe(rename('expected.js'))
    .pipe(babel(getConfig(data)))
    .pipe(dest(`test/fixtures/${data}`));
}
function getConfig(caseName) {
  let pluginWithOpts = [];
  if (caseName === 'import-css') {
    pluginWithOpts = [plugin, { libraryName: 'antd', style: true }];
  } else if (caseName === 'material-ui') {
    pluginWithOpts = [
      plugin,
      { libraryName: 'material-ui', libraryDirectory: '', camel2DashComponentName: false },
    ];
  } else if (caseName === 'keep-named-import') {
    pluginWithOpts = [plugin, { libraryName: 'stream', transformToDefaultImport: false }];
  } else if (caseName === 'react-toolbox') {
    pluginWithOpts = [plugin, { libraryName: 'react-toolbox', camel2UnderlineComponentName: true }];
  } else if (caseName === 'use-multiple-times') {
    pluginWithOpts = [plugin, { libraryName: 'antd-mobile' }];
  } else if (caseName === 'file-name') {
    pluginWithOpts = [
      plugin,
      {
        libraryName: 'antd-mobile-fake-2.0',
        fileName: 'index.native',
      },
    ];
  } else if (caseName === 'custom-name') {
    pluginWithOpts = [
      plugin,
      {
        libraryName: 'plat/antd',
        customName: name => `antd/lib/${name}`,
      },
    ];
  } else if (caseName === 'custom-name-source-file') {
    pluginWithOpts = [
      plugin,
      {
        libraryName: 'plat/antd',
        customName: join(__dirname, 'test/fixtures', 'custom-name-source-file', 'customName.js'),
      },
    ];
  } else if (caseName === 'custom-style-path') {
    pluginWithOpts = [
      plugin,
      {
        libraryName: 'antd',
        style: name => `${name}/style/2x`,
      },
    ];
  } else if (caseName === 'custom-style-path-ignore') {
    pluginWithOpts = [
      plugin,
      {
        libraryName: 'antd',
        style: name => {
          if (name === 'antd/lib/animation') {
            return false;
          }
          return `${name}/style/2x`;
        },
      },
    ];
  } else if (caseName === 'style-library-name') {
    pluginWithOpts = [
      plugin,
      {
        libraryName: 'element-ui',
        styleLibraryDirectory: 'lib/theme-chalk',
      },
    ];
  } else if (caseName === 'custom-style-name') {
    pluginWithOpts = [
      plugin,
      {
        libraryName: 'element-ui',
        customStyleName: name => `element-ui/lib/theme-light/${name}`,
      },
    ];
  } else {
    pluginWithOpts = [plugin, { libraryName: 'antd' }];
  }
  if (caseName === 'modules-false') {
    return {
      presets: [['@babel/preset-env']],
      plugins: [[plugin, { libraryName: 'antd', style: true }]],
    };
  } else if (caseName === 'multiple-libraries') {
    return {
      presets: ['@babel/preset-react'],
      plugins: [
        [plugin, { libraryName: 'antd' }, 'antd'],
        [plugin, { libraryName: 'antd-mobile' }, 'antd-mobile'],
      ],
    };
  } else if (caseName === 'multiple-libraries-hilojs') {
    return {
      presets: ['@babel/preset-react'],
      plugins: [
        [plugin, { libraryName: 'antd' }, 'antd'],
        [
          plugin,
          {
            libraryName: 'hilojs',
            customName(name) {
              switch (name) {
                case 'class':
                  return `hilojs/core/${name}`;
                default:
                  return `hilojs/${name}`;
              }
            },
          },
          'hilojs',
        ],
      ],
    };
  } else if (caseName === 'super-class') {
    return {
      plugins: [[plugin, { libraryName: 'antd' }]],
      babelrc: false,
    };
  } else if (caseName === 'variable-declaration') {
    return {
      presets: ['@babel/preset-react'],
      plugins: [plugin],
    };
  } else if (caseName === 'transform-to-default-import-array') {
    return {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        [
          plugin,
          {
            libraryName: 'dt-react-component',
            transformToDefaultImport: ['Circle'],
            camel2DashComponentName: 'upper',
            style: true,
          },
        ],
      ],
    };
  } else if (caseName === 'camel2-dash-name-lower') {
    return {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        [
          plugin,
          {
            libraryName: 'dt-react-component',
            style: 'css',
            camel2DashComponentName: 'lower',
            customName: {
              GoBack: 'dt-react-component/lib/go-back',
            },
          },
        ],
      ],
    };
  } else {
    return {
      presets: ['@babel/preset-react'],
      plugins: [pluginWithOpts || plugin],
    };
  }
}

exports.default = series(outputExpectedTask);
