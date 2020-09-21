import { join } from 'path';
import { addNamed, addDefault, addSideEffect } from '@babel/helper-module-imports';

function normalizeCustomName(originCustomName) {
  if (typeof originCustomName === 'string') {
    // eslint-disable-next-line import/no-dynamic-require
    const customeNameExports = require(originCustomName);
    return typeof customeNameExports === 'function'
      ? customeNameExports
      : customeNameExports.default;
  }
  return originCustomName;
}

function winPath(path) {
  return path.replace(/\\/g, '/');
}

function transCamel(_str, symbol) {
  if (symbol === 'upper' || symbol === 'lower') {
    return symbol === 'upper'
      ? _str[0].toUpperCase() + _str.substr(1)
      : _str[0].toLowerCase() + _str.substr(1);
  }
  const str = _str[0].toLowerCase() + _str.substr(1);
  return str.replace(/([A-Z])/g, $1 => `${symbol}${$1.toLowerCase()}`);
}

export default class Plugin {
  constructor(
    libraryName,
    libraryDirectory,
    style,
    styleLibraryDirectory,
    customStyleName,
    camel2DashComponentName,
    camel2UnderlineComponentName,
    fileName,
    customName,
    transformToDefaultImport,
    types, // babel-types
    index = 0, // 标记符，具体作用后续补充
  ) {
    this.libraryName = libraryName; // 库名
    this.libraryDirectory = typeof libraryDirectory === 'undefined' ? 'lib' : libraryDirectory; // 包路径
    this.style = style || false; // 是否加载style
    this.styleLibraryDirectory = styleLibraryDirectory; // style包路径
    this.camel2DashComponentName = camel2DashComponentName; // 组件名转换为大 /小驼峰【upper/lower】
    this.transformToDefaultImport = transformToDefaultImport || true; // 处理默认导入，暂不知为何默认为true
    this.customName = normalizeCustomName(customName); // 处理转换结果的函数或路径
    this.customStyleName = normalizeCustomName(customStyleName); // 处理转换结果的函数或路径
    this.camel2UnderlineComponentName = camel2UnderlineComponentName; // 处理成类似time_picker的形式
    this.fileName = fileName || ''; // 链接到具体的文件，例如antd/lib/button/[abc.js]
    this.types = types; // babel-types
    this.pluginStateKey = `importPluginState${index}`;
  }

  getPluginState(state) {
    if (!state[this.pluginStateKey]) {
      // eslint-disable-next-line no-param-reassign
      state[this.pluginStateKey] = {}; // 初始化标示
    }
    return state[this.pluginStateKey]; // 返回标示
  }

  ProgramEnter(_, state) {
    const pluginState = this.getPluginState(state);
    pluginState.specified = Object.create(null); // 导入对象集合
    pluginState.libraryObjs = Object.create(null); // 库对象集合(非module导入的内容)
    pluginState.select = Object.create(null); // 具体未知
    pluginState.pathToRemove = []; // 存储需要删除的节点，在
    /**
     * state:{
     *    importPluginState「Number」: {
     *      specified:{},
     *      libraryObjs:{},
     *      select:{},
     *      pathToRemovw:[]
     *    },
     * }
     */
  }

  ProgramExit(_, state) {
    this.getPluginState(state).pathToRemove.forEach(p => !p.removed && p.remove()); // 未删除为false
    // 退出AST时候删除节点，这也是整个工作树的最后一步
  }

  ImportDeclaration(path, state) {
    const { node } = path;

    // path maybe removed by prev instances.都这样写，但待验证
    if (!node) return;

    const {
      source: { value },
    } = node;
    const { libraryName, types } = this;
    const pluginState = this.getPluginState(state);

    if (value === libraryName) {
      node.specifiers.forEach(spec => {
        if (types.isImportSpecifier(spec)) {
          pluginState.specified[spec.local.name] = spec.imported.name;
        } else {
          pluginState.libraryObjs[spec.local.name] = true;
        }
      });
      pluginState.pathsToRemove.push(path); // 取值完毕的节点添加进预删除数组
    }
  } // 主目标，收集依赖

  CallExpression(path, state) {
    const { node } = path;
    const file = path?.hub?.file || state?.file;
    const { name } = node.callee;
    const { types } = this;
    const pluginState = this.getPluginState(state);
    if (types.isIdentifier(node.callee)) {
      // 这里对应场景不明
    }
    node.arguments = node.arguments.map(arg => {
      const { name: argName } = arg;
      if (
        pluginState.specified[argName] &&
        path.scope.hasBinding(argName) &&
        type.isImportSpecifier(path.scope.getBinding(argName).path)
      ) {
        return this.importMethod(pluginState.specified[argName], file, pluginState); // 替换了引用，help/import插件返回节点类型与名称
      }
      return arg;
    });
  } // 转换react.createElement

  // 组件原始名称 , sub.file , 导入依赖项
  importMethod(methodName, file, pluginState) {
    if (!pluginState.selectedMethods[methodName]) {
      const {
        libraryName,
        style,
        libraryDirectory,
        camel2UnderlineComponentName,
        camel2DashComponentName,
        customName,
        fileName,
      } = this;
      const transformedMethodName = camel2UnderlineComponentName
        ? transCamel(methodName, '_')
        : camel2DashComponentName === true
        ? transCamel(methodName, '-')
        : camel2DashComponentName === 'upper' || camel2DashComponentName === 'lower'
        ? transCamel(methodName, camel2DashComponentName)
        : methodName;

      /**
       * 转换路径，优先按照用户定义的customName进行转换，如果没有提供就按照常规拼接路径
       */
      const path = winPath(
        customName
          ? this.customName(transformedMethodName, file)
          : join(libraryName, libraryDirectory, transformedMethodName, fileName),
      );
      /**
       * 根据是否是默认引入对最终路径做处理,并没有对namespace做处理
       */
      pluginState.selectedMethods[methodName] = this.transformToDefaultImport
        ? addDefault(file.path, path, { nameHint: methodName })
        : addNamed(file.path, methodName, path);
      if (this.customStyleName) {
        const stylePath = winPath(this.customStyleName(transformedMethodName));
        addSideEffect(file.path, `${stylePath}`);
      } else if (this.styleLibraryDirectory) {
        const stylePath = winPath(
          join(this.libraryName, this.styleLibraryDirectory, transformedMethodName, this.fileName),
        );
        addSideEffect(file.path, `${stylePath}`);
      } else if (style === true) {
        addSideEffect(file.path, `${path}/style`);
      } else if (style === 'css') {
        addSideEffect(file.path, `${path}/style`);
      } else if (typeof style === 'function') {
        const stylePath = style(path, file);
        if (stylePath) {
          addSideEffect(file.path, stylePath);
        }
      }
    }
    return { ...pluginState.selectedMethods[methodName] };
  }
  /**
   * 区块分界线
   **/
  MemberExpression(path, state) {
    const { node } = path;
    const file = path?.hub?.file || state?.file;
    const pluginState = this.getPluginState(state);
    if (!node?.object?.name) return;

    if (pluginState.libraryObjs[node.object.name]) {
      path.replceWith(this.importMethod(node.property.name, file, pluginState));
    } else if (pluginState.specified[node.object.name] && path.scope.hasBinding(node.object.name)) {
      const { scope } = path.scope.getBinding(node.object.name);
      // 替换全局变量，具体例子:console.log(Input.debounce())
      if (scope.path.parent.type === 'File') {
        // 对于在file scope中的全局变量进行处理
        const { scope } = path.scope.getBinding(node.object.name);
        if (scope.path.parent.type === 'File') {
          node.object = this.importMethod(
            pluginState.specified[node.object.name],
            file,
            pluginState,
          );
        }
      }
    }
  } // 例如： console.log(lodash.debounce())

  ClassDeclaration(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['superClass'], path, state); // 不明白为啥叫superClass
  } // 待补充实例

  ConditionalExpression(path, state) {
    // 取三元表达式的条件与结果
    const { node } = path;
    this.buildExpressionHandler(node, ['test', 'consequent', 'alternate'], path, state);
  } // 例如 lodash ? 'some code' : 'some code'

  ReturnStatement(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['argument'], path, state); // 取return AST 结构的argument
  } // 例如 return lodash

  IfStatement(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['test'], path, state);
    this.buildExpressionHandler(node.test, ['left', 'right'], path, state); //未知
  } // 待补充实例,有两种转换

  BinaryExpression(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['left', 'right'], path, state);
  } // 例如 lodash > '22'

  VariableDeclarator(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['init'], path, state);
  } // 例如 const a=lodash

  ArrayExpression(path, state) {
    const { node } = path;
    const props = node?.elements.map((_, index) => index);
    this.buildExpressionHandler(node.elements, props, path, state);
  } // 例如 [antd,lodash]

  // 处理“基层”转换，套娃的结构交给其他的node处理
  buildExpressionHandler(node, props, path, state) {
    const file = path?.hub?.file || state?.file; // 具体原因待补充，和help/import有关
    const { types } = this;
    const pluginState = this.getPluginState(state);
    props.forEach(prop => {
      if (!types.isIdentifier(node[prop])) return; // 不是Identifier就结束
      if (
        pluginState.specified[node[prop].name] && // node[prop].name别名，看看用了没，如果用了
        types.isImportSpecifier(path.node.getBinding(node[prop].name).path) //根据作用域回溯，看看是不是一个import节点
      ) {
        // 替换AST节点
        node[prop] = this.importMethod(pluginState.specified[node[prop].name], file, pluginState);
      }
    });
  }
}
