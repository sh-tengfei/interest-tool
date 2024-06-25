'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoodsModel = require('../models/goods');
var CollectionModel = require('../models/collection');
var ShopCartModel = require('../models/shopCart');
var AddressManageModel = require('../models/addressManage');
var OrderManageModel = require('../models/orderManage');
var CommentModel = require('../models/comment');

var tools = require('../utils/tools');

var uActionService = function () {
  function uActionService() {
    _classCallCheck(this, uActionService);
  }

  _createClass(uActionService, [{
    key: 'collectionHandle',

    /**
     * 用户收藏、取消行为
     * @param {String} userId 用户 Id
     * @param {String} goodsId 商品 Id
     * @param {Number} collectionFlag 收藏行为标签 1：收藏, 2：取消
     */
    value: async function collectionHandle(userId, goodsId, collectionFlag) {
      try {
        switch (collectionFlag) {
          // 收藏
          case 1:
            var goodsDoc = await GoodsModel.findOne({ id: goodsId });
            if (!goodsDoc) return { code: 404, msg: '收藏失败，无该商品信息' };
            // 向收藏集合中添加一条数据
            var collectionDoc = await CollectionModel.create({
              userId: userId,
              goodsId: goodsId,
              goods_name: goodsDoc.name,
              image_path: goodsDoc.image_path,
              present_price: goodsDoc.present_price,
              createAt: +new Date()
            });
            return { code: 200, goodsId: collectionDoc.goodsId, msg: '收藏成功' };
          // 取消
          case 0:
            var collection = await CollectionModel.findOne({ userId: userId, goodsId: goodsId });
            if (!collection) return { code: 404, msg: '取消失败，无该商品信息' };
            // 向收藏集合中删除一条文档
            await CollectionModel.deleteOne({ userId: userId, goodsId: goodsId });
            return { code: 200, msg: '取消成功' };
        }
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 添加到购物车
     * @param {String} userId 用户 Id
     * @param {String} goodsId 商品 Id
     */

  }, {
    key: 'addToShopCart',
    value: async function addToShopCart(userId, goodsId) {
      try {
        var goodsDoc = await GoodsModel.findOne({ id: goodsId });
        if (!goodsDoc) return { code: 404, msg: '添加失败，无该商品信息' };

        var shopCartDoc = await ShopCartModel.findOne({ userId: userId, goodsId: goodsId });
        if (shopCartDoc) return { code: 1, msg: '该商品已存在购物车中' };

        // 向购物车集合中添加一条数据
        var cartDoc = await ShopCartModel.create({
          userId: userId,
          goodsId: goodsId,
          goods_name: goodsDoc.name,
          image_path: goodsDoc.image_path,
          present_price: goodsDoc.present_price,
          mall_price: goodsDoc.present_price,
          checked: false,
          buy_count: 1,
          createAt: +new Date()
        });
        return { code: 200, goodsId: cartDoc.goodsId, msg: '添加成功' };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 编辑商品数量
     * @param {String} userId 用户 id
     * @param {String} goodsId 商品 Id
     * @param {Number} buyCount 购买数量
     * @param {Number} mallPrice 总价
     */

  }, {
    key: 'editGoodsCount',
    value: async function editGoodsCount(userId, goodsId, buyCount, mallPrice) {
      try {
        await ShopCartModel.findOneAndUpdate({ userId: userId, goodsId: goodsId }, { $set: { buy_count: buyCount, mall_price: mallPrice } });
        return { goodsId: goodsId, code: 200, msg: '修改成功' };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 删除购物车商品
     * @param {String} userId 用户 id
     * @param {Array} delGoodsIds 需删除商品 ids
     */

  }, {
    key: 'delCartGoods',
    value: async function delCartGoods(userId, delGoodsIds) {
      try {
        await ShopCartModel.deleteMany({ userId: userId, goodsId: delGoodsIds });
        return { code: 200, msg: '删除成功' };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 编辑收货地址
     * @param {String} userId 用户 id
     * @param {Object} addressInfo 地址信息
     */

  }, {
    key: 'editAddress',
    value: async function editAddress(userId, addressInfo) {
      try {
        if (addressInfo.isDefault) {
          // 如果在修改默认地址，首先全改为 false
          await AddressManageModel.updateMany({ userId: userId, isDefault: true }, { $set: { isDefault: false } });
        }

        if (addressInfo.addressId) {
          // 若存在地址 id 则更新地址
          await AddressManageModel.updateOne({ userId: userId, _id: addressInfo.addressId }, addressInfo);
          return { code: 200, msg: '更新地址成功' };
        } else {
          // 加入用户 id 和 创建时间
          var newAddressInfo = Object.assign(addressInfo, { userId: userId, createAt: +new Date() });
          // 增加新的地址
          var addressDoc = await AddressManageModel.create(newAddressInfo);
          // 保存后查询一次
          var addressList = await AddressManageModel.find({ userId: userId });
          // 如果数据库只有 1 条，设置这一条为默认地址
          if (addressList.length === 1) {
            if (!addressList[0].isDefault) {
              await AddressManageModel.findOneAndUpdate({ userId: userId, _id: addressList[0]._id }, { $set: { isDefault: true } });
            }
          }
          return { code: 200, msg: '添加地址成功', id: addressDoc._id, address: addressDoc.address };
        }
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 删除单个地址
     * @param {String} userId 用户 id
     * @param {String} addressId 地址 id
     */

  }, {
    key: 'delAddress',
    value: async function delAddress(userId, addressId) {
      try {
        var addressDoc = await AddressManageModel.findOneAndDelete({ userId: userId, _id: addressId });
        return { code: 200, msg: '删除成功', addressId: addressDoc._id };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 设置默认地址
     * @param {String} userId 用户 id
     * @param {String} addressId 地址 id
     */

  }, {
    key: 'setDefAddress',
    value: async function setDefAddress(userId, addressId) {
      try {
        await AddressManageModel.updateMany({ userId: userId, isDefault: true }, { $set: { isDefault: false } });
        await AddressManageModel.findOneAndUpdate({ userId: userId, _id: addressId }, { $set: { isDefault: true } });
        return { code: 200, msg: '设置默认地址成功', addressId: addressId };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 提交订单处理
     * @param {String} userId 用户 id
     * @param {Object} orderInfo 订单信息
     */

  }, {
    key: 'submitOrderHandle',
    value: async function submitOrderHandle(userId, orderInfo) {
      var platform = '688'; // 定义平台码 | 用于订单号开头数字
      var randomNum_1 = Math.floor(Math.random() * 10);
      var randomNum_2 = Math.floor(Math.random() * 10);
      var sysTime = tools.getCurDate('YYYYMMDDHHmmss');
      var createAt = tools.getCurDate('YYYY-MM-DD HH:mm:ss'); // 创建订单时间

      var order_id = platform + randomNum_1 + sysTime + randomNum_2; // 创建订单号
      var order_list = []; // 订单列表

      for (var index in orderInfo.goodsIds) {
        if (orderInfo.isNowBuy) {
          // 是立即购买
          var goods = await GoodsModel.findOne({ id: orderInfo.goodsIds[index] });
          order_list[index] = {
            userId: userId,
            order_id: order_id,
            goodsId: goods.id,
            goods_name: goods.name,
            image_path: goods.image_path,
            present_price: goods.present_price,
            buy_count: orderInfo.nowBuyCount,
            mall_price: orderInfo.noweBuyMallPrice
          };
        } else {
          // 否则是购物车支付
          var item = await ShopCartModel.findOne({ userId: userId, goodsId: orderInfo.goodsIds[index] });
          order_list[index] = {
            userId: userId,
            order_id: order_id,
            goodsId: item.goodsId,
            goods_name: item.goods_name,
            image_path: item.image_path,
            present_price: item.present_price,
            buy_count: item.buy_count,
            mall_price: item.mall_price
          };
        }
      }
      // 计算订单总价
      var mall_price = order_list.reduce(function (total, curItem) {
        return parseFloat((total + curItem.mall_price).toFixed(2));
      }, 0);
      // 整合订单管理数据
      var orderManage = {
        userId: userId,
        order_id: order_id,
        mall_price: mall_price,
        order_list: order_list,
        createAt: createAt,
        status: 4,
        tel: orderInfo.tel,
        address: orderInfo.address
      };

      try {
        var orderManageDoc = await OrderManageModel.create(orderManage);
        // 清除已购买购物车中的商品
        if (!orderInfo.isNowBuy) await ShopCartModel.deleteMany({ userId: userId, goodsId: orderInfo.goodsIds });

        return { code: 200, order_id: orderManageDoc.order_id, msg: '\u5171\u652F\u4ED8 ' + mall_price + ' \u5143' };
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 提交订单处理
     * @param {String} userId 用户 id
     * @param {Object} commentArgs 评论信息
     */

  }, {
    key: 'commentGoods',
    value: async function commentGoods(userId, commentArgs) {
      var images = [];
      // 整合评论数据
      var commentData = {
        comment_user_id: userId,
        goodsId: commentArgs.goodsId,
        rate: commentArgs.rate,
        comment_time: tools.getCurDate('YYYY-MM-DD HH:mm:ss'),
        anonymous: commentArgs.anonymous,
        content: commentArgs.content,
        images: images
      };

      try {
        var commentEntity = new CommentModel(commentData);
        await commentEntity.save();
        // 查到对应的订单, 修改评论状态
        await OrderManageModel.findOneAndUpdate({
          userId: userId, // 用户 id
          order_id: commentArgs.orderNum, // 订单号 => order_id
          'order_list._id': commentArgs.order_id // mongoDB 中订单集合 order_list
        }, {
          $set: { 'order_list.$.is_comment': true }
        });

        return { code: 200, msg: '评论成功' };
      } catch (error) {
        console.log(error);
      }
    }
  }]);

  return uActionService;
}();

module.exports = new uActionService();