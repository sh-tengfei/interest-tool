'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._verify = exports._createToken = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 创建 Token
 */
var _createToken = exports._createToken = function _createToken(userInfo) {
  // JWT 格式 token | 有效时间 1 小时
  return _jsonwebtoken2.default.sign({ userInfo: userInfo }, _config.secret, { expiresIn: '1h' });
};

/**
 * 验证 token 结果 (验证 secret 和 检查有效期 exp)
 */
var _verify = exports._verify = function _verify(token) {
  return _jsonwebtoken2.default.verify(token, _config.secret, function (error, decoded) {
    if (error) {
      switch (error.name) {
        // token 过期 eg: { code: 401, name: 'TokenExpiredError', message: 'jwt expired' } | 401 token 过期
        case 'TokenExpiredError':
          return { code: 401, name: error.name, error_msg: error.message
            // token 错误
          };case 'JsonWebTokenError':
          return { code: 400, name: error.name, error_msg: error.message };
        default:
          return error;
      }
    } else {
      // 验证成功 eg：{ userId: '5cd7b5159ea7ac253029178d', iat: 1557640469, exp: 1557644069 } | iat（创建的时间戳），exp（到期时间戳）
      return _extends({ code: 200 }, decoded);
    }
  });
};