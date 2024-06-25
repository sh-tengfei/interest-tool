'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

// 图片验证
var PicCodeSchema = new Schema({
  code: {
    required: true,
    dropDups: true,
    type: String,
    index: true,
    unique: true
  }, // 验证码
  time: {
    required: true,
    type: Date
  },
  uid: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false,
  autoIndex: true
});

exports.default = _mongoose2.default.model('PicCode', PicCodeSchema);