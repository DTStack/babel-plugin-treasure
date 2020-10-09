"use strict";

require("dt-react-component/lib/Circle/style");

var _Circle2 = require("dt-react-component/lib/Circle");

ReactDOM.render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Circle2.Circle, {
  type: "running"
}), " \u8FD0\u884C\u4E2D"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Circle2.Circle, {
  type: "finished",
  className: "status_finished"
}), " \u6210\u529F")), document.getElementById('react-container'));