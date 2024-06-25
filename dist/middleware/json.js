'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _response = require('../utils/response');

exports.default = async function json(ctx, next) {
  ctx.success = function (data, msg) {
    var result = (0, _response.success)(data, msg);
    ctx.body = result;
  };
  ctx.error = function (data, status) {
    if (status) {
      ctx.throw(status, JSON.stringify(data));
      return;
    }
    var result = (0, _response.error)(data);
    ctx.body = result;
  };
  await next();
};