import Router from'koa-router';
import * as mongodb from 'mongodb'
import { signup, signin, updatePwd, findById, findByPhone, updateUser, getWxEncryptedData } from '../service/user'
import { errorCode } from '../config'
import userAuthed from '../middleware/userAuthed'
const checkUserStat = require('../middleware/checkUserStat');
const tools = require('../utils/tools');
const { encode, decode } = require('../utils/token');
const userService = require('../service/user');

const router = new Router();

/**
 * 用户注册
 */
router.post('/register', async (ctx) => {
  const { userName, password, prepassword, phone, picCode, roles = 1 } = ctx.request.body || {};
  if (!userName || !password || !phone || !picCode) return ctx.body = { code: 4020, msg: '请输入完整信息' };
  console.log(ctx.captcha, 4)
  if (!ctx.session.picCode) return ctx.body = { code: 5010, msg: '验证码已过期' };
  if (ctx.session.picCode !== picCode.toLocaleLowerCase()) return ctx.body = { code: 5020, msg: '验证码不正确' };
  if (password !== prepassword) {
    return ctx.error({
      message: '两次密码不同',
    })
  }
  try {
    const user = await signup(String(userName), String(password), String(phone), roles)
    ctx.token = {
      time: Date.now(),
      uid: user.roles,
      id: String(user._id),
    }
    ctx.success(user, '注册成功')
  } catch (e) {
    if (e instanceof mongodb.MongoServerError && e.code === errorCode.exists) {
      const errors = Object.keys(e.keyValue).map((key) => {
        return {
          field: key,
          msg: 'exists',
        }
      })
      return ctx.error({ data: errors, message: '手机号已注册！' })
    }
  }
});

/**
 * 用户登录
 */
router.post('/login', async (ctx) => {
  let { phone, password } = ctx.request.body || {};

  const result = await signin(String(phone), String(password))
  if (!result.isSignin || result.user === null) {
    return ctx.error({
      message: '用户不存在或密码错误',
    })
  }

  ctx.token = {
    time: Date.now(),
    uid: result.user.roles,
    id: String(result.user._id),
  }

  ctx.success({
    token: encode(ctx.token),
  })
});

/**
 * 获取用户信息
 */
router.get('/info', userAuthed, async (ctx) => {
  const user = ctx.user
  ctx.success({
    user,
    token: encode({
      time: Date.now(),
      uid: user.roles,
      id: String(user._id),
    }),
  })
});

/**
 * 忘记密码找回
 */
router.post('/resetPwd', async (ctx) => {
  let { phone, password, prePassword, picCode } = ctx.request.body;
  if (!phone || !password || !phone || !picCode || !prePassword) return ctx.body = { code: 4020, msg: '请输入完整信息' };
  if (!ctx.session.picCode) return ctx.body = { code: 5010, msg: '验证码已过期' };
  if (ctx.session.picCode !== picCode.toLocaleLowerCase()) return ctx.body = { code: 5020, msg: '验证码不正确' };
  let user = await updatePwd(String(phone), String(password));
  ctx.token = {
    time: Date.now(),
    uid: user.roles,
    id: String(user._id),
  }
  ctx.success(user, '重置成功')
});

/**
 * 忘记密码找回
 */
router.post('/getWxPhone', async (ctx) => {
  let { code, encryptedData, iv } = ctx.request.body;
  let user = await getWxEncryptedData(code, encryptedData, iv)
  ctx.token = {
    time: Date.now(),
    uid: user.roles,
    id: String(user._id),
  }
  ctx.success(user, '重置成功')
});

/**
 * 发送图片验证码
 */
router.get('/picCode', async (ctx) => {
  let captcha = tools.createCaptcha(4);
  // 将验证码保存入 cookie 中
  const code = captcha.value.toLocaleLowerCase()
  ctx.captcha = {
    time: Date.now(),
    code: code,
  }
  ctx.success(captcha.image)
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

/**
 * 查询商品是否已收藏
 */
router.post('/queryCollection', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const userId = ctx.userInfo._id; // 取用户 id
    const { goodsId } = ctx.request.body;
    try {
      let queryResut = await userService.queryCollection(userId, goodsId);
      ctx.body = { code: 200, ...queryResut };
    } catch(error) {
      console.log(error);
    }
  }
});

/**
 * 获取用户已收藏的商品列表
 */
router.get('/collectionList', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const userId = ctx.userInfo._id; // 取用户 id
    const page = parseInt(ctx.request.query.page) || 1;
    let pageSize = 10; // 数据条数
    let skip = (page - 1) * pageSize; // 跳过的数据条数 (分页的公式)
    let options = { userId, page, pageSize, skip }; // 整合选项

    try {
      let result = await userService.getCollectionList(options);
      ctx.body = result;
    } catch(error) {
      console.log(error);
    }
  }
});

/**
 * 查询购物车数据
 */
router.get('/checkShopCart', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const userId = ctx.userInfo._id; // 取用户 id
    try {
      const result = await userService.checkShopCart(userId);
      ctx.body = result;
    } catch(error) {
      console.log(error);
    }
  }
});

/**
 * 获取地址列表
 */
router.get('/addressList', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const userId = ctx.userInfo._id; // 取用户 id
    try {
      const result = await userService.getAddressList(userId);
      ctx.body = result;
    } catch(error) {
      console.log(error);
    }
  }
});

/**
 * 获取默认地址
 */
router.get('/defAddress', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const userId = ctx.userInfo._id; // 取用户 id
    try {
      const result = await userService.getDefAddress(userId);
      ctx.body = result;
    } catch(error) {
      console.log(error);
    }
  }
});

/**
 * 获取订单列表
 */
router.get('/orderList', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const userId = ctx.userInfo._id; // 取用户 id
    try {
      const result = await userService.getOrderList(userId);
      ctx.body = result;
    } catch(error) {
      console.log(error);
    }
  }
});

/**
 * 获取订单对应处理数量
 */
router.get('/orderNum', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const userId = ctx.userInfo._id; // 取用户 id

    try {
      const result = await userService.getOrderNum(userId);
      ctx.body = {
        code: 200,
        orderNum: result
      }
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 查询待评论商品列表
 */
router.get('/waitCommentList', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const userId = ctx.userInfo._id; // 取用户 id

    try {
      const result = await userService.queryWaitCommentList(userId);
      ctx.body = { code: 200, waitCommentList: result };
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 查询已评论商品列表
 */
router.get('/alreadyCommentList', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const userId = ctx.userInfo._id; // 取用户 id

    try {
      const result = await userService.queryAlreadyCommentList(userId);
      ctx.body = { code: 200, alreadyCommentList: result };
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 查询评价详情
 */
router.post('/commentDetails', checkUserStat, async (ctx) => {
  if (ctx.userInfo) {
    const { commentId } = ctx.request.body;

    try {
      const result = await userService.queryCommentDetails(commentId);
      ctx.body = { code: 200, commentDetails: result };
    } catch (error) {
      console.log(error);
    }
  }
});

export const path = '/user'
export default router
