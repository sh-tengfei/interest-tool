'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.path = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _user = require('../service/user');

var _picCode = require('../service/picCode');

var _weixin = require('../service/weixin');

var _userAuthed = require('../middleware/userAuthed');

var _userAuthed2 = _interopRequireDefault(_userAuthed);

var _config = require('../config');

var _tools = require('../utils/tools');

var _token = require('../utils/token');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userService = require('../service/user');

var router = new _koaRouter2.default();
// 登录类型
var LoginTypes = {
  phone: 1,
  wx: 2

  /**
   * 用户注册
   */
};router.post('/register', async function (ctx) {
  var _ref = ctx.request.body || {},
      password = _ref.password,
      prepassword = _ref.prepassword,
      phone = _ref.phone,
      picCode = _ref.picCode,
      codeToken = _ref.codeToken,
      _ref$roles = _ref.roles,
      roles = _ref$roles === undefined ? 1 : _ref$roles;

  if (!password || !phone || !picCode || !codeToken) {
    return ctx.error({
      message: '请输入完整信息'
    });
  }
  if (String(phone).length !== 11) {
    return ctx.error({
      message: '请输入正确信息'
    });
  }
  var captcha = (0, _token.decode)(codeToken);
  // 防止刷库
  if (!captcha.id) {
    return ctx.error({
      message: '验证码已过期'
    });
  }
  if (password !== prepassword) {
    return ctx.error({
      message: '两次密码不同'
    });
  }
  var session = await (0, _picCode.findPicCode)(captcha.id);
  if (!session || Date.now() - session.time > _config.picOutTime) {
    await (0, _picCode.delPicCode)(captcha.id);
    return ctx.error({
      message: '验证码已过期',
      code: 202
    });
  }

  if (picCode.trim() !== session.code) {
    return ctx.error({ message: '验证码不正确' });
  }
  await (0, _picCode.delPicCode)(captcha.id);
  var existPhone = await (0, _user.findByPhone)(String(phone));
  if (existPhone) {
    return ctx.error({ message: '手机号已注册！' });
  }
  var user = await (0, _user.signup)(String(password), String(phone), roles);
  ctx.success({
    token: (0, _token.encode)({
      time: Date.now(),
      uid: user.roles,
      id: String(user._id)
    }),
    user: user
  }, '注册成功');
});

/**
 * 用户登录
 */
router.post('/login', async function (ctx) {
  var _ref2 = ctx.request.body || {},
      phone = _ref2.phone,
      password = _ref2.password,
      code = _ref2.code,
      _ref2$logintype = _ref2.logintype,
      logintype = _ref2$logintype === undefined ? 1 : _ref2$logintype;

  var user = null;
  if (logintype === LoginTypes.wx) {
    if (!code) return ctx.error({ message: '请输入完整信息' });

    var _ref3 = await (0, _weixin.jscode2session)(code),
        data = _ref3.data;

    if (data.errmsg) {
      return ctx.error({ message: data.errmsg });
    }
    var ret = await (0, _user.findByOpenId)(data.openid);
    if (!ret) {
      user = await (0, _user.signupWx)(_extends({}, data, { roles: 0 }));
    } else {
      user = ret;
    }
  }
  if (logintype === LoginTypes.phone) {
    if (!phone || !password) return ctx.error({ message: '请输入完整信息' });
    var result = await (0, _user.signin)(String(phone), String(password));
    if (!result.isSignin || result.user === null) {
      return ctx.error({
        message: '用户不存在或密码错误'
      });
    }
    user = result.user;
  }
  ctx.success({
    token: (0, _token.encode)({
      time: Date.now(),
      uid: user.roles,
      id: String(user._id)
    }),
    user: user
  }, '登录成功');
});

/**
 * 获取用户信息
 */
router.get('/info', _userAuthed2.default, async function (ctx) {
  var user = ctx.user;
  ctx.success(user);
});

/**
 * 忘记密码找回
 */
router.post('/resetPwd', async function (ctx) {
  var _ctx$request$body = ctx.request.body,
      phone = _ctx$request$body.phone,
      password = _ctx$request$body.password,
      prePassword = _ctx$request$body.prePassword,
      picCode = _ctx$request$body.picCode,
      codeToken = _ctx$request$body.codeToken;

  if (!phone || !password || !picCode || !prePassword) return ctx.body = { code: 4020, msg: '请输入完整信息' };
  var captcha = (0, _token.decode)(codeToken);
  // 防止刷库
  if (!captcha.id) return ctx.error({ message: '验证码不存在' });
  var session = await (0, _picCode.findPicCode)(captcha.id);
  if (!session || Date.now() - session.time > _config.picOutTime) return ctx.error({ message: '验证码已过期' });
  if (picCode.trim() !== session.code) return ctx.error({ message: '验证码不正确' });
  var user = await (0, _user.updatePwd)(String(phone), String(password));
  var result = { phone: user.phone, id: user._id };
  ctx.success(result, '重置成功');
});

/**
 * 发送图片验证码
 */
router.get('/picCode', async function (ctx) {
  var codeauth = ctx.headers.codeauth;

  if (codeauth !== 'interest-tool') return ctx.error({ message: '非法请求' });
  var captcha = (0, _tools.createCaptcha)(4);
  // 将验证码保存入 cookie 中
  var code = captcha.value.toLocaleLowerCase();
  var time = Date.now();
  var uid = 0;
  await (0, _picCode.savePicCode)({ code: code, time: time, uid: uid });
  console.log('图片验证码是：', code);
  ctx.success({
    token: (0, _token.encode)({
      time: time,
      uid: uid,
      id: code
    }),
    image: captcha.image,
    code: code
  });
});

/**
 * 修改密码
 */
router.post('/changePwd', _userAuthed2.default, async function (ctx) {
  var _ctx$request$body2 = ctx.request.body,
      password = _ctx$request$body2.password,
      prePassword = _ctx$request$body2.prePassword;
  var id = ctx.user.id;

  if (password !== prePassword) return ctx.error({ message: '两次密码不同' });
  var user = await (0, _user.findById)(ctx.user.id);
  if (!user || !user.phone) return ctx.error({ message: '用户不存在或不是账号登录' });
  var result = await (0, _user.updatePwd)(user.phone, String(password));
  console.log(result, user);
  if (!user) return ctx.error({ message: '用户不存在' });
  ctx.success(user, '修改成功');
});

/**
 * 获取微信解密信息
 */
router.post('/getEncrypted', _userAuthed2.default, async function (ctx) {
  var id = ctx.user.id;
  var _ctx$request$body3 = ctx.request.body,
      code = _ctx$request$body3.code,
      encryptedData = _ctx$request$body3.encryptedData,
      iv = _ctx$request$body3.iv;

  var r = await (0, _tools.getWxEncrypted)(code, encryptedData, iv);
  if (!r.openId) {
    return ctx.error({ message: '解密失败' });
  }
  var user = await (0, _user.updateUser)(id, {
    avatar: r.avatarUrl,
    city: r.city,
    country: r.country,
    gender: r.gender,
    language: r.language,
    username: r.nickName,
    province: r.province
  }); // 更新用户信息
  ctx.success(user, '更新成功');
});

/**
 * 更新用户信息
 */
router.post('/update', _userAuthed2.default, async function (ctx) {
  var id = ctx.user.id;

  var updateInfo = ctx.request.body;
  if (user) {
    if (updateInfo.phone) {
      updateInfo.phone = String(updateInfo.phone);
      var phoneUser = await (0, _user.findByPhone)(updateInfo.phone);
      if (phoneUser) return ctx.error({ message: '该手机号已存在' });
    }
    user = await (0, _user.updateUser)(id, updateInfo); // 更新用户信息
    ctx.success(user, '更新成功');
  } else {
    ctx.error({ message: '用户不存在' });
  }
});

/**
 * 发送短信验证码
 */
router.post('/sendSMSCode', async function (ctx) {
  var mobilePhone = ctx.request.body.mobilePhone; // 手机号码

  var clientIp = ctx.req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
  ctx.req.connection.remoteAddress || // 判断 connection 的远程 IP
  ctx.req.socket.remoteAddress || // 判断后端的 socket 的 IP
  ctx.req.connection.socket.remoteAddress || '';
  var curDate = tools.getCurDate(); // 当前时间
  // console.log('ip:', clientIp)
  // console.log('date:', curDate)
  var args = { mobilePhone: mobilePhone, clientIp: clientIp, curDate: curDate };

  try {
    var smsCodeData = await userService.dispatchSMSCode(args);
    // 将验证码保存入 session 中
    smsCodeData.code === 200 && (ctx.session.smsCode = smsCodeData.smsCode);
    ctx.body = smsCodeData;
  } catch (error) {
    console.log(error);
  }
});

var path = exports.path = _config.BASE_URL + '/user';
exports.default = router;