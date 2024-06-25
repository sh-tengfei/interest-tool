'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaSession = require('koa-session');

var _koaSession2 = _interopRequireDefault(_koaSession);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONFIG = {
  key: _config.secret,
  maxAge: 60000, // cookie 的过期时间 60000ms => 60s => 1min
  overwrite: true, // 是否可以 overwrite (默认 default true)
  httpOnly: true, // true 表示只有服务器端可以获取 cookie
  signed: true, // 默认 签名
  rolling: false, // 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
  renew: false // 在每次请求时强行设置 session，这将重置 session 过期时间（默认：false）
};

exports.default = function (app) {
  return (0, _koaSession2.default)(CONFIG, app);
};