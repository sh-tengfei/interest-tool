'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jscode2session = jscode2session;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const RecommendModel = require('../models/recommend');
// const GoodsModel = require('../models/goods');
var jscode2sessionUrl = 'https://api.weixin.qq.com/sns/jscode2session?';

async function jscode2session(js_code) {
  return _axios2.default.get(jscode2sessionUrl + 'appid=' + _config.appId + '&secret=' + _config.wxSecret + '&js_code=' + js_code + '&grant_type=authorization_code');
}