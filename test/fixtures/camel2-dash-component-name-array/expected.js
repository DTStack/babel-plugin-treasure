"use strict";

require("dt-react-component/lib/circle/style");

var _circle = require("dt-react-component/lib/circle");

ReactDOM.render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_circle.Circle, {
  type: "running"
}), "\xA0 \u8FD0\u884C\u4E2D"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_circle.Circle, {
  type: "finished",
  className: "status_finished"
}), "\xA0 \u6210\u529F")), document.getElementById('react-container'));