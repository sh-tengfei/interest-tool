'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _json = require('./json');

var _json2 = _interopRequireDefault(_json);

var _responseTime = require('./responseTime');

var _responseTime2 = _interopRequireDefault(_responseTime);

var _koaBody = require('./koaBody');

var _koaBody2 = _interopRequireDefault(_koaBody);

var _cookie = require('./cookie');

var _cookie2 = _interopRequireDefault(_cookie);

var _axios = require('./axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  app.use(_logger2.default);
  app.use(_responseTime2.default);
  app.use(_json2.default);
  app.use((0, _koaBody2.default)());
  app.use(_cookie2.default);
  app.use(_axios2.default);
}
// import paged from './paged'