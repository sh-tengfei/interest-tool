'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (ctx, next) {
  ctx.data = {
    requestId: '',
    responseTime: 0,
    error: null
  };
  await next();
  var data = {
    method: ctx.method,
    // type: 'request',
    ip: ctx.ip,
    host: ctx.host,
    url: ctx.path,
    query: ctx.querystring,
    status: ctx.status,
    ua: ctx.headers['user-agent'],
    // cookie: ctx.headers.cookie,
    responseTime: ctx.data.responseTime,
    error: ctx.data.error && {
      name: ctx.data.error.name,
      message: ctx.data.error.message,
      stack: ctx.data.error.stack
    }
  };
  (0, _logger2.default)(data);
};