import session from 'koa-session';
import { secret } from '../config'
const CONFIG = {
  key: secret,
  maxAge: 60000, // cookie 的过期时间 60000ms => 60s => 1min
  overwrite: true, // 是否可以 overwrite (默认 default true)
  httpOnly: true, // true 表示只有服务器端可以获取 cookie
  signed: true, // 默认 签名
  rolling: false, // 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
  renew: false, // 在每次请求时强行设置 session，这将重置 session 过期时间（默认：false）
};

export default (app) => {
  return session(CONFIG, app)
}
