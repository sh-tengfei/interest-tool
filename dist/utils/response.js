'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.success = success;
exports.error = error;
function success(data, msg) {
  return {
    code: 0,
    message: msg || '',
    data: data
  };
}

function error(data) {
  return _extends({
    code: 201
  }, data);
}