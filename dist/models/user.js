'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var User = new Schema({
  roles: { required: true, type: Number, default: 1 }, // 1家长 2机构
  phone: {
    dropDups: true,
    minlength: 11,
    maxlength: 11,
    type: String,
    index: true,
    unique: true
  }, // 手机号
  password: {
    type: String,
    select: false,
    minlength: 6
  },
  username: { type: String, default: null }, // 用户昵称
  gender: { type: String, default: null }, // 性别
  avatar: { type: String, default: 'http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280' }, // 头像
  openid: { type: String, unique: true, index: true },
  unionid: { type: String, unique: true }
}, {
  timestamps: true,
  versionKey: false,
  autoIndex: true
});

exports.default = _mongoose2.default.model('User', User);