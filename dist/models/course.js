'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var courseTypes = {
  skidding: 1 // 轮滑
};

var Course = new Schema({
  userId: { required: true, type: _mongoose2.default.Types.ObjectId }, // 1家长 2机构
  courseType: { type: Number, required: true },
  courseName: { type: String, required: true }
}, {
  timestamps: true,
  versionKey: false,
  autoIndex: true
});

exports.default = _mongoose2.default.model('Course', Course);