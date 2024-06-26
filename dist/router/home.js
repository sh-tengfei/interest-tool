'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.path = undefined;

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _mongodb = require('mongodb');

var mongodb = _interopRequireWildcard(_mongodb);

var _userAuthed = require('../middleware/userAuthed');

var _userAuthed2 = _interopRequireDefault(_userAuthed);

var _config = require('../config');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default();

/**
 * 用户注册
 */
router.get('/interest-list', _userAuthed2.default, async function (ctx) {

  ctx.success({ interestList: [] }, '');
});

var path = exports.path = _config.BASE_URL + '/home';
exports.default = router;