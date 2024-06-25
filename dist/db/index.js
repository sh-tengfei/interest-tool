'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectDb;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connectDb() {
  _mongoose2.default.connect(_config.dbUrl);
  // 记录数据库连接的次数
  var maxConnectTimes = 0;

  return new Promise(function (resolve, reject) {
    // 连接成功操作
    _mongoose2.default.connection.once('open', function () {
      console.log('Mongodb 数据库连接成功.');
      resolve();
    });
    // 连接断开操作
    _mongoose2.default.connection.on('disconnected', function () {
      console.log('*********** 数据库断开 ***********');
      if (maxConnectTimes < 3) {
        maxConnectTimes++;
        _mongoose2.default.connect(_config.dbUrl);
      } else {
        reject(new Error('数据库连接失败'));
        throw new Error('数据库连接失败');
      }
    });
    // 连接失败操作
    _mongoose2.default.connection.on('error', function (error) {
      console.log('*********** 数据库错误 ***********');
      if (maxConnectTimes < 3) {
        maxConnectTimes++;
        _mongoose2.default.connect(_config.dbUrl);
      } else {
        reject(error);
        throw new Error('数据库连接失败');
      }
    });
  });
}