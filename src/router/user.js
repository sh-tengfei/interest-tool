import Router from'koa-router';
import { signupWx, signup, signin, updatePwd, findByOpenId, findById, findByPhone, updateUser } from '../service/user'
import { savePicCode, findPicCode, delPicCode } from '../service/picCode'
import { jscode2session } from '../service/weixin'
import userAuthed from '../middleware/userAuthed'
import { BASE_URL, picOutTime } from '../config'
import { createCaptcha, getWxEncrypted } from '../utils/tools';
import { encode, decode } from '../utils/token';
const userService = require('../service/user');

const router = new Router();
// 登录类型
const LoginTypes = {
  phone: 1,
  wx: 2
}

/**
 * 用户注册
 */
router.post('/register', async (ctx) => {
  const { password, prepassword, phone, picCode, codeToken, roles = 1 } = ctx.request.body || {};
  if (!password || !phone || !picCode || !codeToken) {
    return ctx.error({
      message: '请输入完整信息',
    })
  }
  if (String(phone).length !== 11) {
    return ctx.error({
      message: '请输入正确信息',
    })
  }
  const captcha = decode(codeToken)
  // 防止刷库
  if (!captcha.id) {
    return ctx.error({
      message: '验证码已过期',
    })
  }
  if (password !== prepassword) {
    return ctx.error({
      message: '两次密码不同',
    })
  }
  const session = await findPicCode(captcha.id)
  if (!session || Date.now() - session.time > picOutTime) {
    await delPicCode(captcha.id)
    return ctx.error({
      message: '验证码已过期',
      code: 202
    })
  }

  if (picCode.trim() !== session.code) {
    return ctx.error({ message: '验证码不正确' })
  }
  await delPicCode(captcha.id)
  const existPhone = await findByPhone(String(phone));
  if (existPhone) {
    return ctx.error({ message: '手机号已注册！' })
  }
  const user = await signup(String(password), String(phone), roles)
  ctx.success({
    token: encode({
      time: Date.now(),
      uid: user.roles,
      id: String(user._id),
    }),
    user
  }, '注册成功')
});

/**
 * 用户登录
 */
router.post('/login', async (ctx) => {
  let { phone, password, code, logintype = 1 } = ctx.request.body || {};
  let user = null
  if(logintype === LoginTypes.wx) {
    if (!code) return ctx.error({ message: '请输入完整信息' })
    const { data } = await jscode2session(code)
    if (data.errmsg) {
      return ctx.error({ message: data.errmsg })
    }
    let ret = await findByOpenId(data.openid)
    if (!ret) {
      user = await signupWx({ ...data , roles: 0 })
    } else {
      user = ret
    }
  }
  if (logintype === LoginTypes.phone) {
    if (!phone || !password) return ctx.error({ message: '请输入完整信息' })
    const result = await signin(String(phone), String(password))
    if (!result.isSignin || result.user === null) {
      return ctx.error({
        message: '用户不存在或密码错误',
      })
    }
    user = result.user
  }
  ctx.success({
    token: encode({
      time: Date.now(),
      uid: user.roles,
      id: String(user._id),
    }),
    user
  }, '登录成功')
});


/**
 * 获取用户信息
 */
router.get('/info', userAuthed, async (ctx) => {
  const user = ctx.user
  ctx.success(user)
});

/**
 * 忘记密码找回
 */
router.post('/resetPwd', async (ctx) => {
  let { phone, password, prePassword, picCode, codeToken } = ctx.request.body;
  if (!phone || !password || !picCode || !prePassword) return ctx.body = { code: 4020, msg: '请输入完整信息' };
  const captcha = decode(codeToken)
  // 防止刷库
  if (!captcha.id) return ctx.error({ message: '验证码不存在' })
  const session = await findPicCode(captcha.id)
  if (!session || Date.now() - session.time > picOutTime) return ctx.error({ message: '验证码已过期' })
  if (picCode.trim() !== session.code) return ctx.error({ message: '验证码不正确' })
  let user = await updatePwd(String(phone), String(password))
  let result = { phone: user.phone, id: user._id }
  ctx.success(result, '重置成功')
});

/**
 * 发送图片验证码
 */
router.get('/picCode', async (ctx) => {
  const { codeauth } = ctx.headers
  if (codeauth !== 'interest-tool') return ctx.error({ message: '非法请求' })
  const captcha = createCaptcha(4);
  // 将验证码保存入 cookie 中
  const code = captcha.value.toLocaleLowerCase()
  const time = Date.now()
  const uid = 0
  await savePicCode({ code, time, uid })
  console.log('图片验证码是：', code)
  ctx.success({
    token: encode({
      time,
      uid,
      id: code,
    }),
    image: captcha.image,
    code
  })
});

/**
 * 修改密码
 */
router.post('/changePwd', userAuthed, async (ctx) => {
  const { password, prePassword } = ctx.request.body;
  const { id } = ctx.user;
  if (password !== prePassword) return ctx.error({ message: '两次密码不同' })
  const user = await findById(ctx.user.id)
  if (!user || !user.phone) return ctx.error({ message: '用户不存在或不是账号登录' })
  const result = await updatePwd(user.phone, String(password))
  console.log(result, user)
  if (!user) return ctx.error({ message: '用户不存在' })
  ctx.success(user, '修改成功')
});

/**
 * 获取微信解密信息
 */
router.post('/getEncrypted', userAuthed, async (ctx) => {
  const { id } = ctx.user;
  const { code, encryptedData, iv } = ctx.request.body;
  const r = await getWxEncrypted(code, encryptedData, iv)
  if (!r.openId) {
    return ctx.error({ message: '解密失败' })
  }
  let user = await updateUser(id, {
    avatar: r.avatarUrl,
    city: r.city,
    country: r.country,
    gender: r.gender,
    language: r.language,
    username: r.nickName,
    province: r.province
  }); // 更新用户信息
  ctx.success(user, '更新成功')
});


/**
 * 更新用户信息
 */
router.post('/update', userAuthed, async (ctx) => {
  const { id } = ctx.user;
  const updateInfo = ctx.request.body;
  if (user) {
    if (updateInfo.phone) {
      updateInfo.phone = String(updateInfo.phone)
      let phoneUser = await findByPhone(updateInfo.phone);
      if (phoneUser) return ctx.error({  message: '该手机号已存在' })
    }
    user = await updateUser(id, updateInfo); // 更新用户信息
    ctx.success(user, '更新成功')
  } else {
    ctx.error({ message: '用户不存在' })
  }
});

/**
 * 发送短信验证码
 */
router.post('/sendSMSCode', async (ctx) => {
  let { mobilePhone } = ctx.request.body; // 手机号码
  const clientIp = ctx.req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    ctx.req.connection.remoteAddress || // 判断 connection 的远程 IP
    ctx.req.socket.remoteAddress || // 判断后端的 socket 的 IP
    ctx.req.connection.socket.remoteAddress || '';
  const curDate = tools.getCurDate(); // 当前时间
  // console.log('ip:', clientIp)
  // console.log('date:', curDate)
  let args = { mobilePhone, clientIp, curDate };

  try {
    let smsCodeData = await userService.dispatchSMSCode(args);
    // 将验证码保存入 session 中
    (smsCodeData.code === 200) && (ctx.session.smsCode = smsCodeData.smsCode);
    ctx.body = smsCodeData;
  } catch(error) {
    console.log(error);
  }
});

export const path = `${BASE_URL}/user`
export default router
