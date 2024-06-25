'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async function responseTime(ctx, next) {
  var now = Date.now();
  await next();
  ctx.data.responseTime = Date.now() - now;
  ctx.set('x-response-time', ctx.data.responseTime + 'ms');
};