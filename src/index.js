import assert from 'assert';
import Plugin from './Plugin';

export default function({ types }) {
  let plugins = null;

  /**
   * 用于单测初始化插件
   */
  global.__clearBabelTreasurePlugin = () => {
    plugins = null;
  };

  /**
   * 从类中继承方法与参数
   */
  function applyInstance(method, args, context) {
    // eslint-disable-next-line no-restricted-syntax
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  }

  /**
   * Program入口初始化数据结构
   * 出口删除处理完毕的标记节点
   */
  const Program = {
    enter(path, { opts = {} }) {
      assert(opts.libraryName, 'libraryName should be provided');
      plugins = [
        new Plugin(
          opts.libraryName,
          opts.libraryDirectory,
          opts.style,
          opts.styleLibraryDirectory,
          opts.customStyleName,
          opts.camel2DashComponentName,
          opts.camel2UnderlineComponentName,
          opts.fileName,
          opts.customName,
          opts.noDefaultComponentName,
          opts.transformToDefaultImport,
          types,
        ),
      ];
      // eslint-disable-next-line prefer-rest-params
      applyInstance('ProgramEnter', arguments, this);
    },
    exit() {
      applyInstance('ProgramExit', arguments, this);
    },
  };

  const methods = [
    'ImportDeclaration',
    'CallExpression',
    'MemberExpression',
    'ClassDeclaration',
    'ConditionalExpression',
    'ReturnStatement',
    'IfStatement',
    'BinaryExpression',
    'VariableDeclarator',
    'ArrayExpression',
    'NewExpression',
    'ExportDefaultDeclaration',
    'ExpressionStatement',
    'LogicalExpression',
    'SwitchStatement',
    'SwitchCase',
  ];

  const ret = {
    visitor: { Program }, //对整棵AST树的入口进行初始化操作
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const method of methods) {
    ret.visitor[method] = function() {
      // eslint-disable-next-line prefer-rest-params
      applyInstance(method, arguments, ret.visitor);
    };
  }

  return ret;
}
