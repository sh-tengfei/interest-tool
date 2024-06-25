'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RecommendModel = require('../models/recommend');
var GoodsModel = require('../models/goods');

var GoodsService = function () {
  function GoodsService() {
    _classCallCheck(this, GoodsService);
  }

  _createClass(GoodsService, [{
    key: 'getHome',

    // 查询首页数据
    value: async function getHome() {
      try {
        var homeData = await RecommendModel.find({});
        return homeData;
      } catch (error) {
        console.log(error);
      }
    }

    // 根据商品 id 查询相应商品信息

  }, {
    key: 'getGoodsDetails',
    value: async function getGoodsDetails(goodsId) {
      try {
        // findOne()：查询找到的第一个文档
        var goods = await GoodsModel.findOne({ id: goodsId });
        return goods;
      } catch (error) {
        console.log(error);
      }
    }

    // 根据子类 id 查询相关商品列表

  }, {
    key: 'getGoodsList',
    value: async function getGoodsList(categorySubId) {
      try {
        var goodsList = await GoodsModel.find({ sub_id: categorySubId });
        return goodsList;
      } catch (error) {
        console.log(error);
      }
    }

    // 搜索

  }, {
    key: 'search',
    value: async function search(_ref) {
      var keyword = _ref.keyword,
          page = _ref.page,
          pageSize = _ref.pageSize,
          skip = _ref.skip;

      try {
        var total = await GoodsModel.find({ name: { $regex: keyword } }).countDocuments();
        var goodsList = await GoodsModel.find({ name: { $regex: keyword } }).skip(skip).limit(pageSize);
        return { total: total, page: page, goodsList: goodsList };
      } catch (error) {
        console.log(error);
      }
    }
  }, {
    key: 'getAllGoods',
    value: async function getAllGoods() {
      try {
        var list = await GoodsModel.find({});
        return { list: list };
      } catch (error) {
        console.log(error);
      }
    }
  }]);

  return GoodsService;
}();

module.exports = new GoodsService();