'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var jwt = require('../utils/jwt');

/**
 * 检查用户状态
 */
var checkUserStat = async function checkUserStat(ctx, next) {
  if (!ctx.header['authorization']) {
    // 设置响应状态码 403 Forbidden
    ctx.response.status = 403;
    ctx.body = { code: 403, msg: '未登录' };
    return;
  }
  // 获取 token
  var token = ctx.header['authorization'].split(' ')[1];
  // 验证 token 结果
  var result = jwt._verify(token);

  if (result) {
    switch (result.code) {
      case 401:
        // 设置响应状态码 401： Unauthorized
        ctx.response.status = 401;
        ctx.body = _extends({ msg: '登录状态已过期，请重新登录' }, result);
        break;
      case 400:
        // 客户端请求的语法错误 400：Bad Reques
        ctx.response.status = 400;
        ctx.body = _extends({ msg: 'Token 错误' }, result);
        break;
      case 200:
        ctx.userInfo = result.userInfo;
        await next();
        break;
    }
  }
};

module.exports = checkUserStat;