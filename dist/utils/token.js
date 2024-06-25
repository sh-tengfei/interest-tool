'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = encode;
exports.decode = decode;

var _cryptoJs = require('crypto-js');

var _config = require('../config');

// @ts-ignore
function encode(token) {
  var tokenStr = [token.uid, token.id, token.time].join(',');
  return _cryptoJs.AES.encrypt(tokenStr, _config.secret).toString();
}

function decode(token) {
  try {
    var bytes = _cryptoJs.AES.decrypt(token.toString(), _config.secret);
    var tokenStr = bytes.toString(_cryptoJs.enc.Utf8);
    var tokenArr = tokenStr.split(',');
    return {
      uid: tokenArr[0] || 0,
      id: tokenArr[1] || '',
      time: parseInt(tokenArr[2], 10) || Date.now()
    };
  } catch (error) {
    return {
      uid: -1, // 临时用户
      id: '',
      time: 0
    };
  }
}