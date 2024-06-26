const mobilePhoneModel = require('../models/mobilePhone');
import UserModel from '../models/user';
const mongoose = require('mongoose');
// const sendSMSCode = require('../utils/sms');
import { md5 } from '../utils/share'
import { PROJECTION } from '../config/projection'

export function signupWX({ openid, unionid, roles }) {
  const newUser = new UserModel({
    openid,
    unionid,
    roles,
  })
  return newUser.save()
}

export function signup(pwd, phone, roles) {
  const newUser = new UserModel({
    password: md5(pwd),
    roles,
    phone,
  })
  return newUser.save()
}

export async function findById(id) {
  const user = await UserModel.findById(id).select('+roles +createdAt')
  return user
}

export async function findByOpenId(openid) {
  const user = await UserModel.findOne({ openid }).select('+roles +createdAt')
  return user
}

export async function findByPhone(phone) {
  const user = await UserModel.findOne({ phone }).select('+roles +createdAt')
  return user
}

export async function signin(phone, password) {
  const user = await UserModel.findOne({ phone }).select('password salt')
  if (!user || md5(password) !== user.password) {
    return {
      isSignin: false,
      user: null,
    }
  }
  return {
    isSignin: true,
    user: await findById(user._id),
  }
}


export async function updatePwd(phone, pwd) {
  const password = md5(pwd)
  const user = await UserModel.findOneAndUpdate({ phone }, { $set: { password } }, { returnDocument: 'after' })
  return user
}

/**
 * 更新用户信息
 * @param {String} phone 用户手机号
 * @param {Object} updateInfo 需要更新的信息
 */
export async function updateUser(_id, updateOpt) {
  delete updateOpt.password
  delete updateOpt.id
  await UserModel.updateOne({ _id }, updateOpt); // 更新用户信息
  const ret = await UserModel.findById({ _id }, PROJECTION.user); // 查询用户信息并返回所需数据
  return ret;
}


class userService {
  /**
   * 发送短信验证码
   *
   * 同一个 ip，一天只能向手机号码发送 10 次
   */
  async dispatchSMSCode({ mobilePhone, clientIp, curDate }) {
    // console.log('服务:', mobilePhone, clientIp, curDate)
    let smsSendMax = 6; // 设定短信发送限制数
    let ipCountMax = 10; // 设定 ip 数限制数
    let smsCode = ''; // 随机短信验证码
    let smsCodeLen = 6; // 随机短信验证码长度
    for (let i = 0; i < smsCodeLen; i++) {
      smsCode += Math.floor(Math.random() * 10);
    }
    console.log('random:', smsCode)

    try {
      // 根据当前日期查询到相应文档
      let mobilePhoneDoc = await mobilePhoneModel.findOne({ curDate });
      // 同一天，同一个 ip 文档条数
      let clientIpCount = await mobilePhoneModel.find({ clientIp, curDate }).countDocuments();

      if (mobilePhoneDoc) {
        // 60 秒之后可再次发送 | 限制 60 秒内无法再发送 sms APi
        if (((+new Date() / 1000) - mobilePhoneDoc.sendTimestamp / 1000) < 60) {
          return {
            code: 4010,
            time: 60 - Math.floor(((+new Date() / 1000) - mobilePhoneDoc.sendTimestamp / 1000)),
            msg: '限制 60 秒内无法再发送短信验证码'
          }
        }

        // 说明次数未到到限制，可继续发送
        if (mobilePhoneDoc.sendCount < smsSendMax && clientIpCount < ipCountMax) {
          let sendCount = mobilePhoneDoc.sendCount + 1;
          // 更新单个文档
          await mobilePhoneDoc.updateOne({ _id: mobilePhoneDoc._id }, { sendCount, sendTimestamp: +new Date() });
          // 执行发送短信验证码
          // const data = sendSMSCode(mobilePhone, smsCode);
          switch (data.error_code) {
            case 0:
              return { smsCode, code: 200, msg: '验证码发送成功' };
            case 10012:
              return { smsCode, code: 5000, msg: '没有免费短信了' };
            default:
              return { smsCode, code: 4000, msg: '未知错误' };
          }
        } else {
          return { code: 4020, msg: '当前手机号码发送次数达到上限，明天重试' };
        }

      } else {
        return { smsCode, code: 200, msg: '验证码发送成功' };
        // 执行发送短信验证码
        // const data = sendSMSCode(mobilePhone, smsCode);
        switch (data.error_code) {
          case 0:
            // 创建新文档 | 新增数据
            let mPdoc = await MobilePhoneModel.create({ mobilePhone, clientIp, curDate, sendCount: 1 });
            console.log(mPdoc)
            return { smsCode, code: 200, msg: '验证码发送成功' };
          case 10012:
            return { smsCode, code: 5000, msg: '没有免费短信了' };
          default:
            return { smsCode, code: 4000, msg: '未知错误' };
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
  async queryCollection(userId, goodsId) {
    try {
      const collectionDoc = await CollectionModel.findOne({ userId, goodsId });
      return (!collectionDoc) ? { goodsId, status: 0, msg: '未收藏' } : { goodsId, status: 1, msg: '已收藏' };
    } catch(error) {
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
  async getCollectionList({ userId, page, pageSize, skip }) {
    const total = await CollectionModel.find({ userId }).countDocuments();
    const collectionList = await CollectionModel.find({ userId }).sort({ createAt: -1 }).skip(skip).limit(pageSize);
    return { total, collectionList, page, code: 200 }
  }

  /**
   * 查询购物车数据
   * @param {String} userId 用户 Id
   */
  async checkShopCart(userId) {
    try {
      const shopCartList = await ShopCartModel.find({ userId }).sort({ createAt: -1 });
      if (!shopCartList) return { code: 0, msg: '购物车暂无商品' };
      return { shopCartList, code: 200 };
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * 获取地址列表
   * @param {String} userId 用户 Id
   */
  async getAddressList(userId) {
    try {
      const addressList = await AddressManageModel.find({ userId });
      return { addressList, code: 200 };
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * 获取默认地址
   * @param {String} userId 用户 Id
   */
  async getDefAddress(userId) {
    try {
      const defAddress = await AddressManageModel.findOne({ userId, isDefault: true });
      if (!defAddress) return { code: 404, msg: '暂无收货地址' };
      return { code: 200, msg: '获取默认地址成功', defAddress };
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * 获取订单列表
   * @param {String} userId 用户 Id
   */
  async getOrderList(userId) {
    try {
      const orderList = await OrderManageModel.find({ userId });
      return { code: 200, msg: '获取订单列表成功', orderList: orderList.reverse() };
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * 获取订单对应处理数量
   * @param {String} userId 用户 Id
   */
  async getOrderNum(userId) {
    try {
      const orderList = await OrderManageModel.find({ userId });
      let orderNum = []; // 相应订单数
      let waitPay = []; // 待付款
      let waitSend = []; // 待发货
      let waitTake = []; // 待收货
      let waitComment = []; // 待评论
      orderList.forEach(item => {
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
            item.order_list.forEach(value => {
              if (!value.is_comment) waitComment.push(value);
            });
            break;
        }
      });
      orderNum.push(waitPay.length, waitSend.length, waitTake.length, 0, waitComment.length);
      return orderNum;
    } catch(error) {
      console.log(error);
    }
  }

  /**
   * 查询待评论商品列表
   * @param {String} userId 用户 Id
   */
  async queryWaitCommentList(userId) {
    const status = 4; // 订单已完成状态
    const waitCommentList = []; // 待评论商品列表
    try {
      const waitCommentOrderList = await OrderManageModel.find({ userId, status, 'order_list.is_comment': false });
      waitCommentOrderList.forEach(item => {
        // 查找未评论商品
        item.order_list.forEach(value => {
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
  async queryAlreadyCommentList(userId) {
    try {
      // 聚合管道 $lookup 连接操作符 | 用于连接同一个数据库中另一个集合，并获取指定的文档
      const alreadyCommentList = await CommentModel.aggregate([
        {
          $lookup: { from: 'goods', localField: 'goodsId', foreignField: 'id', as: 'goods'}
        }, {
          $match: { comment_user_id: mongoose.Types.ObjectId(userId) }
        }, {
          $sort: { comment_time: -1 }
        }
      ]);
      return alreadyCommentList;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 查询评价详情
   * @param {String} commentId 评价 _id
   */
  async queryCommentDetails(commentId) {
    try {
      const commentList = await CommentModel.aggregate([
        {
          $lookup: { from: 'goods', localField: 'goodsId', foreignField: 'id', as: 'goods'}
        }, {
          $lookup: { from: 'users', localField: 'comment_user_id', foreignField: '_id', as: 'user'}
        }, {
          $match: { _id: mongoose.Types.ObjectId(commentId) }
        }
      ]);

      return commentList[0];
    } catch (error) {
      console.log(error);
    }
  }
}

export default new userService();
