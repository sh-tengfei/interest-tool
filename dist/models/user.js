'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var User = new Schema({
  roles: { required: true, type: Number, default: 1 }, // 1家长 2机构
  phone: {
    dropDups: true,
    minlength: 11,
    maxlength: 11,
    type: String,
    index: true
  }, // 手机号
  password: {
    type: String,
    select: false,
    minlength: 6
  },

  // 微信信息
  city: { type: String },
  country: { type: String },
  gender: { type: String }, // 性别
  language: { type: String },
  province: { type: String },
  username: { type: String }, // 用户昵称
  avatar: { type: String, default: _config.defaultAvatar }, // 头像
  openid: { type: String, index: true, dropDups: true },
  unionid: { type: String }
}, {
  timestamps: true,
  versionKey: false,
  autoIndex: true
});

exports.default = _mongoose2.default.model('User', User);