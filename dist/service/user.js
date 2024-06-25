'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.signupWX = signupWX;
exports.signup = signup;
exports.findById = findById;
exports.findByOpenId = findByOpenId;
exports.findByPhone = findByPhone;
exports.signin = signin;
exports.updatePwd = updatePwd;
exports.getWxEncryptedData = getWxEncryptedData;
exports.updateUser = updateUser;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _share = require('../utils/share');

var _projection = require('../config/projection');

var _config = require('../config');

var _WXBizDataCrypt = require('../lib/WXBizDataCrypt');

var _WXBizDataCrypt2 = _interopRequireDefault(_WXBizDataCrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mobilePhoneModel = require('../models/mobilePhone');

var mongoose = require('mongoose');
// const sendSMSCode = require('../utils/sms');
function signupWX(_ref) {
  var openid = _ref.openid,
      unionid = _ref.unionid,
      roles = _ref.roles;

  var newUser = new _user2.default({
    openid: openid,
    unionid: unionid,
    roles: roles
  });
  return newUser.save();
}

function signup(username, pwd, phone, roles) {
  var newUser = new _user2.default({
    username: username,
    password: (0, _share.md5)(pwd),
    roles: roles,
    phone: phone
  });
  return newUser.save();
}

async function findById(id) {
  var user = await _user2.default.findById(id).select('+roles +createdAt');
  return user;
}

async function findByOpenId(openid) {
  var user = await _user2.default.findOne({ openid: openid }).select('+roles +createdAt');
  return user;
}

async function findByPhone(phone) {
  var user = await _user2.default.findOne({ phone: phone }).select('+roles +createdAt');
  return user;
}

async function signin(phone, password) {
  var user = await _user2.default.findOne({ phone: phone }).select('password salt');
  if (!user || (0, _share.md5)(password) !== user.password) {
    return {
      isSignin: false,
      user: null
    };
  }
  return {
    isSignin: true,
    user: await findById(user._id)
  };
}

async function updatePwd(phone, pwd) {
  var password = (0, _share.md5)(pwd);
  var user = await _user2.default.findOneAndUpdate({ phone: phone }, { $set: { password: password } }, { returnDocument: 'after' });
  return user;
}

async function getWxEncryptedData(code, encryptedData, iv) {
  var result = await _axios2.default.get('https://api.weixin.qq.com/sns/jscode2session?appid=' + _config.appId + '&secret=' + _config.wxSecret + '&js_code=' + code + '&grant_type=authorization_code');
  console.log(code, 111, encryptedData, 222, iv, result);
  // .then((e, r, b)=>{
  // let sessionKey = b.sessionKey
  // let pc = new WXBizDataCrypt(appId, sessionKey)
  // let data = pc.decryptData(encryptedData , iv)
  // console.log('解密后 data: ', data)
  // })
  // 解密后的数据为
  //
  // data = {
  //   "nickName": "Band",
  //   "gender": 1,
  //   "language": "zh_CN",
  //   "city": "Guangzhou",
  //   "province": "Guangdong",
  //   "country": "CN",
  //   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
  //   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
  //   "watermark": {
  //     "timestamp": 1477314187,
  //     "appid": "wx4f4bc4dec97d474b"
  //   }
  // }
}

/**
 * 更新用户信息
 * @param {String} phone 用户手机号
 * @param {Object} updateInfo 需要更新的信息
 */
async function updateUser(_id, updateOpt) {
  delete updateOpt.password;
  delete updateOpt.id;
  await _user2.default.updateOne({ _id: _id }, updateOpt); // 更新用户信息
  var ret = await _user2.default.findById({ _id: _id }, _projection.PROJECTION.user); // 查询用户信息并返回所需数据
  return ret;
}

var userService = function () {
  function userService() {
    _classCallCheck(this, userService);
  }

  _createClass(userService, [{
    key: 'dispatchSMSCode',

    /**
     * 发送短信验证码
     *
     * 同一个 ip，一天只能向手机号码发送 10 次
     */
    value: async function dispatchSMSCode(_ref2) {
      var mobilePhone = _ref2.mobilePhone,
          clientIp = _ref2.clientIp,
          curDate = _ref2.curDate;

      // console.log('服务:', mobilePhone, clientIp, curDate)
      var smsSendMax = 6; // 设定短信发送限制数
      var ipCountMax = 10; // 设定 ip 数限制数
      var smsCode = ''; // 随机短信验证码
      var smsCodeLen = 6; // 随机短信验证码长度
      for (var i = 0; i < smsCodeLen; i++) {
        smsCode += Math.floor(Math.random() * 10);
      }
      console.log('random:', smsCode);

      try {
        // 根据当前日期查询到相应文档
        var mobilePhoneDoc = await mobilePhoneModel.findOne({ curDate: curDate });
        // 同一天，同一个 ip 文档条数
        var clientIpCount = await mobilePhoneModel.find({ clientIp: clientIp, curDate: curDate }).countDocuments();

        if (mobilePhoneDoc) {
          // 60 秒之后可再次发送 | 限制 60 秒内无法再发送 sms APi
          if (+new Date() / 1000 - mobilePhoneDoc.sendTimestamp / 1000 < 60) {
            return {
              code: 4010,
              time: 60 - Math.floor(+new Date() / 1000 - mobilePhoneDoc.sendTimestamp / 1000),
              msg: '限制 60 秒内无法再发送短信验证码'
            };
          }

          // 说明次数未到到限制，可继续发送
          if (mobilePhoneDoc.sendCount < smsSendMax && clientIpCount < ipCountMax) {
            var sendCount = mobilePhoneDoc.sendCount + 1;
            // 更新单个文档
            await mobilePhoneDoc.updateOne({ _id: mobilePhoneDoc._id }, { sendCount: sendCount, sendTimestamp: +new Date() });
            // 执行发送短信验证码
            // const data = sendSMSCode(mobilePhone, smsCode);
            switch (data.error_code) {
              case 0:
                return { smsCode: smsCode, code: 200, msg: '验证码发送成功' };
              case 10012:
                return { smsCode: smsCode, code: 5000, msg: '没有免费短信了' };
              default:
                return { smsCode: smsCode, code: 4000, msg: '未知错误' };
            }
          } else {
            return { code: 4020, msg: '当前手机号码发送次数达到上限，明天重试' };
          }
        } else {
          return { smsCode: smsCode, code: 200, msg: '验证码发送成功' };
          // 执行发送短信验证码
          // const data = sendSMSCode(mobilePhone, smsCode);
          switch (data.error_code) {
            case 0:
              // 创建新文档 | 新增数据
              var mPdoc = await MobilePhoneModel.create({ mobilePhone: mobilePhone, clientIp: clientIp, curDate: curDate, sendCount: 1 });
              console.log(mPdoc);
              return { smsCode: smsCode, code: 200, msg: '验证码发送成功' };
            case 10012:
              return { smsCode: smsCode, code: 5000, msg: '没有免费短信了' };
            default:
              return { smsCode: smsCode, code: 4000, msg: '未知错误' };
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 查询商品是否已收藏
     * @param {String} userId 用户 Id
     * @param {String} goodsId 商品 Id
     */

  }, {
    key: 'queryCollection',
    value: async function queryCollection(userId, goodsId) {
      try {
        var collectionDoc = await CollectionModel.findOne({ userId: userId, goodsId: goodsId });
        return !collectionDoc ? { goodsId: goodsId, status: 0, msg: '未收藏' } : { goodsId: goodsId, status: 1, msg: '已收藏' };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 获取用户已收藏的商品列表
     * @param {String} userId 用户 Id
     * @param {Number} page 页数
     * @param {Number} pageSize 一页取几条数据
     * @param {String} skip 跳过的数据条数
     */

  }, {
    key: 'getCollectionList',
    value: async function getCollectionList(_ref3) {
      var userId = _ref3.userId,
          page = _ref3.page,
          pageSize = _ref3.pageSize,
          skip = _ref3.skip;

      var total = await CollectionModel.find({ userId: userId }).countDocuments();
      var collectionList = await CollectionModel.find({ userId: userId }).sort({ createAt: -1 }).skip(skip).limit(pageSize);
      return { total: total, collectionList: collectionList, page: page, code: 200 };
    }

    /**
     * 查询购物车数据
     * @param {String} userId 用户 Id
     */

  }, {
    key: 'checkShopCart',
    value: async function checkShopCart(userId) {
      try {
        var shopCartList = await ShopCartModel.find({ userId: userId }).sort({ createAt: -1 });
        if (!shopCartList) return { code: 0, msg: '购物车暂无商品' };
        return { shopCartList: shopCartList, code: 200 };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 获取地址列表
     * @param {String} userId 用户 Id
     */

  }, {
    key: 'getAddressList',
    value: async function getAddressList(userId) {
      try {
        var addressList = await AddressManageModel.find({ userId: userId });
        return { addressList: addressList, code: 200 };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 获取默认地址
     * @param {String} userId 用户 Id
     */

  }, {
    key: 'getDefAddress',
    value: async function getDefAddress(userId) {
      try {
        var defAddress = await AddressManageModel.findOne({ userId: userId, isDefault: true });
        if (!defAddress) return { code: 404, msg: '暂无收货地址' };
        return { code: 200, msg: '获取默认地址成功', defAddress: defAddress };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 获取订单列表
     * @param {String} userId 用户 Id
     */

  }, {
    key: 'getOrderList',
    value: async function getOrderList(userId) {
      try {
        var orderList = await OrderManageModel.find({ userId: userId });
        return { code: 200, msg: '获取订单列表成功', orderList: orderList.reverse() };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 获取订单对应处理数量
     * @param {String} userId 用户 Id
     */

  }, {
    key: 'getOrderNum',
    value: async function getOrderNum(userId) {
      try {
        var orderList = await OrderManageModel.find({ userId: userId });
        var orderNum = []; // 相应订单数
        var waitPay = []; // 待付款
        var waitSend = []; // 待发货
        var waitTake = []; // 待收货
        var waitComment = []; // 待评论
        orderList.forEach(function (item) {
          switch (item.status) {
            case 1:
              waitPay.push(item);
              break;
            case 2:
              waitSend.push(item);
              break;
            case 3:
              waitTake.push(item);
              break;
            case 4:
              item.order_list.forEach(function (value) {
                if (!value.is_comment) waitComment.push(value);
              });
              break;
          }
        });
        orderNum.push(waitPay.length, waitSend.length, waitTake.length, 0, waitComment.length);
        return orderNum;
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 查询待评论商品列表
     * @param {String} userId 用户 Id
     */

  }, {
    key: 'queryWaitCommentList',
    value: async function queryWaitCommentList(userId) {
      var status = 4; // 订单已完成状态
      var waitCommentList = []; // 待评论商品列表
      try {
        var waitCommentOrderList = await OrderManageModel.find({ userId: userId, status: status, 'order_list.is_comment': false });
        waitCommentOrderList.forEach(function (item) {
          // 查找未评论商品
          item.order_list.forEach(function (value) {
            if (!value.is_comment) waitCommentList.push(value);
          });
        });
        return waitCommentList;
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 查询已评论商品列表
     * @param {String} userId 用户 Id
     */

  }, {
    key: 'queryAlreadyCommentList',
    value: async function queryAlreadyCommentList(userId) {
      try {
        // 聚合管道 $lookup 连接操作符 | 用于连接同一个数据库中另一个集合，并获取指定的文档
        var alreadyCommentList = await CommentModel.aggregate([{
          $lookup: { from: 'goods', localField: 'goodsId', foreignField: 'id', as: 'goods' }
        }, {
          $match: { comment_user_id: mongoose.Types.ObjectId(userId) }
        }, {
          $sort: { comment_time: -1 }
        }]);
        return alreadyCommentList;
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 查询评价详情
     * @param {String} commentId 评价 _id
     */

  }, {
    key: 'queryCommentDetails',
    value: async function queryCommentDetails(commentId) {
      try {
        var commentList = await CommentModel.aggregate([{
          $lookup: { from: 'goods', localField: 'goodsId', foreignField: 'id', as: 'goods' }
        }, {
          $lookup: { from: 'users', localField: 'comment_user_id', foreignField: '_id', as: 'user' }
        }, {
          $match: { _id: mongoose.Types.ObjectId(commentId) }
        }]);

        return commentList[0];
      } catch (error) {
        console.log(error);
      }
    }
  }]);

  return userService;
}();

exports.default = new userService();