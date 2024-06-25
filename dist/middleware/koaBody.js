'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaBody = require('koa-body');

var _koaBody2 = _interopRequireDefault(_koaBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  return (0, _koaBody2.default)({ multipart: true });
};