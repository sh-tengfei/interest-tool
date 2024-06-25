'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.path = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _mongodb = require('mongodb');

var mongodb = _interopRequireWildcard(_mongodb);

var _user2 = require('../service/user');

var _config = require('../config');

var _picCode = require('../service/picCode');

var _weixin = require('../service/weixin');

var _userAuthed = require('../middleware/userAuthed');

var _userAuthed2 = _interopRequireDefault(_userAuthed);

var _checkUserStat = require('../middleware/checkUserStat');

var _checkUserStat2 = _interopRequireDefault(_checkUserStat);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tools = require('../utils/tools');

var _require = require('../utils/token'),
    encode = _require.encode,
    decode = _require.decode;

var userService = require('../service/user');

var router = new _koaRouter2.default();
var fiveMinutes = 1000 * 60 * 5;
// 登录类型
var LoginTypes = {
  phone: 1,
  wx: 2

  /**
   * 用户注册
   */
};router.post('/register', async function (ctx) {
  var _ref = ctx.request.body || {},
      username = _ref.username,
      password = _ref.password,
      prepassword = _ref.prepassword,
      phone = _ref.phone,
      picCode = _ref.picCode,
      codeToken = _ref.codeToken,
      _ref$roles = _ref.roles,
      roles = _ref$roles === undefined ? 1 : _ref$roles;

  if (!username || !password || !phone || !picCode || !codeToken) {
    return ctx.error({
      message: '请输入完整信息'
    });
  }
  var captcha = decode(codeToken);
  // 防止刷库
  if (!captcha.id) {
    return ctx.error({
      message: '验证码不存在'
    });
  }
  var session = await (0, _picCode.findPicCode)(captcha.id);
  if (!session || Date.now() - session.time > fiveMinutes) {
    return ctx.error({
      message: '验证码已过期'
    });
  }

  if (picCode.trim() !== session.code) {
    return ctx.error({
      message: '验证码不正确'
    });
  }
  if (password !== prepassword) {
    return ctx.error({
      message: '两次密码不同'
    });
  }
  try {
    var _user = await (0, _user2.signup)(String(username), String(password), String(phone), roles);
    ctx.token = {
      time: Date.now(),
      uid: _user.roles,
      id: String(_user._id)
    };
    ctx.success(_user, '注册成功');
  } catch (e) {
    if (e instanceof mongodb.MongoServerError && e.code === _config.errorCode.exists) {
      var errors = Object.keys(e.keyValue).map(function (key) {
        return {
          field: key,
          msg: 'exists'
        };
      });
      return ctx.error({ data: errors, message: '手机号已注册！' });
    } else {
      console.log(e, 'etf e');
    }
  }
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
    var ret = await (0, _user2.findByOpenId)(data.openid);
    if (!ret) {
      user = await (0, _user2.signupWX)(_extends({}, data, { roles: 0 }));
    } else {
      user = ret;
    }
  }
  if (logintype === LoginTypes.phone) {
    if (!phone || !password) return ctx.error({ message: '请输入完整信息' });
    var result = await (0, _user2.signin)(String(phone), String(password));
    if (!result.isSignin || result.user === null) {
      return ctx.error({
        message: '用户不存在或密码错误'
      });
    }
    user = result.user;
  }
  ctx.token = {
    time: Date.now(),
    uid: user.roles,
    id: String(user._id)
  };

  ctx.success({
    token: encode(ctx.token)
  });
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
  var captcha = decode(codeToken);
  // 防止刷库
  if (!captcha.id) return ctx.error({ message: '验证码不存在' });
  var session = await (0, _picCode.findPicCode)(captcha.id);
  if (!session || Date.now() - session.time > fiveMinutes) return ctx.error({ message: '验证码已过期' });
  if (picCode.trim() !== session.code) return ctx.error({ message: '验证码不正确' });
  var user = await (0, _user2.updatePwd)(String(phone), String(password));
  var result = { phone: user.phone, id: user._id };
  ctx.success(result, '重置成功');
});

/**
 * 修改密码
 */
router.post('/changePwd', _userAuthed2.default, async function (ctx) {
  var _ctx$request$body2 = ctx.request.body,
      password = _ctx$request$body2.password,
      prePassword = _ctx$request$body2.prePassword;

  if (password !== prePassword) return ctx.error({ message: '两次密码不同' });
  var user = await (0, _user2.updatePwd)(String(ctx.user.phone), String(password));
  ctx.success(user, '修改成功');
});

/**
 * 获取微信解密信息
 */
router.post('/getWxPhone', async function (ctx) {
  var _ctx$request$body3 = ctx.request.body,
      code = _ctx$request$body3.code,
      encryptedData = _ctx$request$body3.encryptedData,
      iv = _ctx$request$body3.iv;

  var user = await (0, _user2.getWxEncryptedData)(code, encryptedData, iv);
  ctx.token = {
    time: Date.now(),
    uid: user.roles,
    id: String(user._id)
  };
  ctx.success(user, '重置成功');
});

/**
 * 发送图片验证码
 */
router.get('/picCode', async function (ctx) {
  var captcha = tools.createCaptcha(4);
  // 将验证码保存入 cookie 中
  var code = captcha.value.toLocaleLowerCase();
  var time = Date.now();
  var uid = 0;
  await (0, _picCode.savePicCode)({ code: code, time: time, uid: uid });
  console.log('图片验证码是：', code);
  ctx.success({
    token: encode({
      time: time,
      uid: uid,
      id: code
    }),
    image: captcha.image
  });
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
      var phoneUser = await (0, _user2.findByPhone)(updateInfo.phone);
      if (phoneUser) return ctx.error({ message: '该手机号已存在' });
    }
    user = await (0, _user2.updateUser)(id, updateInfo); // 更新用户信息
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

/**
 * 查询商品是否已收藏
 */
router.post('/queryCollection', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var userId = ctx.userInfo._id; // 取用户 id
    var goodsId = ctx.request.body.goodsId;

    try {
      var queryResut = await userService.queryCollection(userId, goodsId);
      ctx.body = _extends({ code: 200 }, queryResut);
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 获取用户已收藏的商品列表
 */
router.get('/collectionList', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var userId = ctx.userInfo._id; // 取用户 id
    var page = parseInt(ctx.request.query.page) || 1;
    var pageSize = 10; // 数据条数
    var skip = (page - 1) * pageSize; // 跳过的数据条数 (分页的公式)
    var options = { userId: userId, page: page, pageSize: pageSize, skip: skip }; // 整合选项

    try {
      var result = await userService.getCollectionList(options);
      ctx.body = result;
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 查询购物车数据
 */
router.get('/checkShopCart', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var userId = ctx.userInfo._id; // 取用户 id
    try {
      var result = await userService.checkShopCart(userId);
      ctx.body = result;
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 获取地址列表
 */
router.get('/addressList', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var userId = ctx.userInfo._id; // 取用户 id
    try {
      var result = await userService.getAddressList(userId);
      ctx.body = result;
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 获取默认地址
 */
router.get('/defAddress', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var userId = ctx.userInfo._id; // 取用户 id
    try {
      var result = await userService.getDefAddress(userId);
      ctx.body = result;
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 获取订单列表
 */
router.get('/orderList', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var userId = ctx.userInfo._id; // 取用户 id
    try {
      var result = await userService.getOrderList(userId);
      ctx.body = result;
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 获取订单对应处理数量
 */
router.get('/orderNum', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var userId = ctx.userInfo._id; // 取用户 id

    try {
      var result = await userService.getOrderNum(userId);
      ctx.body = {
        code: 200,
        orderNum: result
      };
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 查询待评论商品列表
 */
router.get('/waitCommentList', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var userId = ctx.userInfo._id; // 取用户 id

    try {
      var result = await userService.queryWaitCommentList(userId);
      ctx.body = { code: 200, waitCommentList: result };
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 查询已评论商品列表
 */
router.get('/alreadyCommentList', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var userId = ctx.userInfo._id; // 取用户 id

    try {
      var result = await userService.queryAlreadyCommentList(userId);
      ctx.body = { code: 200, alreadyCommentList: result };
    } catch (error) {
      console.log(error);
    }
  }
});

/**
 * 查询评价详情
 */
router.post('/commentDetails', _checkUserStat2.default, async function (ctx) {
  if (ctx.userInfo) {
    var commentId = ctx.request.body.commentId;


    try {
      var result = await userService.queryCommentDetails(commentId);
      ctx.body = { code: 200, commentDetails: result };
    } catch (error) {
      console.log(error);
    }
  }
});

var path = exports.path = '/user';
exports.default = router;