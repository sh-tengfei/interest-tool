'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sd = require('silly-datetime');
var svgCaptcha = require('svg-captcha'); // 生成 svg 格式的验证码
var request = require('request');
var querystring = require('querystring');
var base64Captcha = require('@bestdon/nodejs-captcha');

/**
 * 工具封装
 */

var Tools = function () {
  function Tools() {
    _classCallCheck(this, Tools);
  }

  _createClass(Tools, [{
    key: 'getCurDate',

    // 格式化当前日期
    value: function getCurDate() {
      var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'YYYYMMDD';

      // 默认返回格式：20190925
      return sd.format(new Date(), format);
    }

    // 生成 svg base64 格式的验证码

  }, {
    key: 'createCaptcha',
    value: function createCaptcha(length) {
      var opt = {
        length: 4,
        noise: 1,
        // fontSize: 40,
        width: 160,
        height: 100,
        background: '#bc51e6'
        // const captcha = svgCaptcha.create(opt);
      };var captcha = base64Captcha(opt);
      return captcha;
    }

    // ip 定位城市 | 使用百度地图 API

  }, {
    key: 'ipLocation',
    value: function ipLocation(clientIp) {
      var basicuri = 'http://api.map.baidu.com/location/ip?';

      var baiduMapParams = {
        ip: clientIp,
        ak: 'aTETpT7NGwDnUrTf7bROng6SttoQEv6O'
      };
      var queryData = querystring.stringify(baiduMapParams);

      var queryUrl = basicuri + queryData;

      return new Promise(function (resolve, reject) {
        request(queryUrl, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            // 解析接口返回的JSON内容
            var newBody = JSON.parse(body);
            resolve(newBody);
          } else {
            reject({ code: -1, err_msg: 'ip 定位请求异常' });
          }
        });
      });
    }
  }]);

  return Tools;
}();

module.exports = new Tools();