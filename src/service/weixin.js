import axios from 'axios'
import { appId, wxSecret } from '../config'

const jscode2sessionUrl = 'https://api.weixin.qq.com/sns/jscode2session?'

export async function jscode2session(js_code) {
  return axios.get(`${jscode2sessionUrl}appid=${appId}&secret=${wxSecret}&js_code=${js_code}&grant_type=authorization_code`)
}
