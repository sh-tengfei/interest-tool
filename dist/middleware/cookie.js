'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uuid = require('uuid');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _token = require('../utils/token');

var _user = require('../service/user');

var userSv = _interopRequireWildcard(_user);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (ctx, next) {
  var cToken = ctx.cookies.get('authtoken') || ctx.headers.authtoken || ctx.query.authtoken || '';
  console.log(cToken);
  // token 还能是个list
  if (Array.isArray(cToken)) {
    cToken = cToken[0];
  }

  var token = (0, _token.decode)(cToken);
  // 未登录的用户分配一个临时id
  // if (token.id === '') {
  //   token.id = `${Date.now().toString(36)}-${uuidv4()}`
  // }
  ctx.token = token;
  ctx.userAuthed = async function () {
    if (!_mongoose2.default.Types.ObjectId.isValid(token.id)) {
      return false;
    }
    var user = await userSv.findById(token.id);
    if (!user) {
      return false;
    }
    ctx.token = {
      id: user._id.toString(),
      uid: user.roles,
      time: Date.now()
    };
    ctx.user = user;
    return true;
  };

  await next();
  // 小程序 cookie无效
  // ctx.cookies.set('token', encode(ctx.token), {
  //   maxAge: 1000 * 60 * 60 * 12,
  //   signed: true,
  //   path: '/',
  //   secure: true,
  // })
};