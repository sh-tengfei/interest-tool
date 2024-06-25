'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

// 手机号数据模型 （用于发送验证码）
var PhoneSchema = new Schema({
  phone: Number, // 手机号
  clientIp: String, // 客户端 ip
  sendCount: Number, // 发送次数
  curDate: String, // 当前日期
  sendTimestamp: { type: String, default: +new Date() } // 短信发送的时间戳
});

exports.default = _mongoose2.default.model('Phone', PhoneSchema);