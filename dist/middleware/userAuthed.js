'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async function userAuthed(ctx, next) {
  var isAuthed = await ctx.userAuthed();
  if (!isAuthed) {
    ctx.token = {
      uid: 0,
      id: null,
      time: Date.now()
    };
    return ctx.error({
      code: 401,
      message: '未认证或已过期！'
    }, 401);
  }
  await next();
};