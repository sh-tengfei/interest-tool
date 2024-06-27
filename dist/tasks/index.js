"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeCron = require("node-cron");

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _picCode = require("./picCode");

var _picCode2 = _interopRequireDefault(_picCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_nodeCron2.default.schedule(_picCode2.default.interval, _picCode2.default.task, _picCode2.default.cronOptions);
if (_picCode2.default.immediate) _picCode2.default.task();

exports.default = _nodeCron2.default;