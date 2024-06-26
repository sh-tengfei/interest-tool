'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCaptcha = undefined;
exports.getWxEncrypted = getWxEncrypted;

var _config = require('../config');

var _WXBizDataCrypt = require('../lib/WXBizDataCrypt');

var _WXBizDataCrypt2 = _interopRequireDefault(_WXBizDataCrypt);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sd = require('silly-datetime');
var request = require('request');
var querystring = require('querystring');
var base64Captcha = require('@bestdon/nodejs-captcha');

/**
 * 工具封装
 */
// class Tools {
//   // 格式化当前日期
//   getCurDate(format = 'YYYYMMDD') {
//     // 默认返回格式：20190925
//     return sd.format(new Date(), format);
//   }

//   // 生成 svg base64 格式的验证码


//   // ip 定位城市 | 使用百度地图 API
//   ipLocation(clientIp) {
//     let basicuri = 'http://api.map.baidu.com/location/ip?';

//     const baiduMapParams = {
//       ip: clientIp,
//       ak: 'aTETpT7NGwDnUrTf7bROng6SttoQEv6O'
//     };
//     let queryData = querystring.stringify(baiduMapParams);

//     let queryUrl = basicuri + queryData;

//     return new Promise((resolve, reject) => {
//       request(queryUrl, function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//           // 解析接口返回的JSON内容
//           let newBody = JSON.parse(body);
//           resolve(newBody);
//         } else {
//           reject({ code: -1, err_msg: 'ip 定位请求异常' });
//         }
//       });
//     });
//   }
// }
async function getWxEncrypted(code, encryptedData, iv) {
  var _ref = await _axios2.default.get('https://api.weixin.qq.com/sns/jscode2session?appid=' + _config.appId + '&secret=' + _config.wxSecret + '&js_code=' + code + '&grant_type=authorization_code'),
      data = _ref.data;

  var session_key = data.session_key;

  var pc = new _WXBizDataCrypt2.default(_config.appId, session_key);
  var result = pc.decryptData(encryptedData, iv);
  return result;
}

var createCaptcha = exports.createCaptcha = function createCaptcha() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

  var opt = {
    length: length,
    noise: 1,
    // fontSize: 60,
    width: 160,
    height: 100,
    background: '#bc51e6'
    // const captcha = svgCaptcha.create(opt);
  };var captcha = base64Captcha(opt);
  return captcha;
};