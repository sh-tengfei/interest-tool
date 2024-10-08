let sd = require('silly-datetime');
let request = require('request');
let querystring = require('querystring');
let base64Captcha = require('@bestdon/nodejs-captcha');

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
import { appId, wxSecret } from '../config'
import WXBizDataCrypt from '../lib/WXBizDataCrypt'
import axios from 'axios'

export async function getWxEncrypted (code, encryptedData, iv) {
  const { data } = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${wxSecret}&js_code=${code}&grant_type=authorization_code`)
  const { session_key } = data
  let pc = new WXBizDataCrypt(appId, session_key)
  let result = pc.decryptData(encryptedData, iv)
  return result
}

export const createCaptcha = (length = 4) => {
  const opt = {
    length,
    noise: 1,
    // fontSize: 60,
    width: 160,
    height: 100,
    background: '#bc51e6'
  }
  // const captcha = svgCaptcha.create(opt);
  const captcha = base64Captcha(opt);
  return captcha
}

