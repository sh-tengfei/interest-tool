'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.md5 = md5;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(str) {
  // 以md5的格式创建一个哈希值
  var hash = _crypto2.default.createHash('md5');
  return hash.update(Buffer.from(str)).digest('hex');
}