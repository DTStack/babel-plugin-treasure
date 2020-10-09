"use strict";

require("dt-react-component/lib/circle/style/css");

var _circle = _interopRequireDefault(require("dt-react-component/lib/circle"));

require("dt-react-component/lib/go-back/style/css");

var _goBack = _interopRequireDefault(require("dt-react-component/lib/go-back"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

ReactDOM.render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_goBack["default"], {
  type: "running"
}, "\u8FD4\u56DE"), /*#__PURE__*/React.createElement(_circle["default"], null))), document.getElementById('react-container'));