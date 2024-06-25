'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _home = require('./home');

var _home2 = _interopRequireDefault(_home);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default();
router.use(_user.path, _user2.default.routes());
router.use(_home.path, _home2.default.routes());

function init(app) {
  app.use(router.routes());
}