'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var fs = require('fs');
var GoodsModel = require('../models/goods');
var RecommendModel = require('../models/recommend');

var InitDataService = function () {
  function InitDataService() {
    _classCallCheck(this, InitDataService);
  }

  _createClass(InitDataService, [{
    key: 'index',
    value: async function index() {
      var goodsResult = await GoodsModel.find({}); // 查询 goods 集合所以文档
      var recommendResult = await RecommendModel.find({}); // 查询 recommend 集合所以文档

      if (!goodsResult.length && !recommendResult.length) {
        var goodsFlag = void 0; // 用于导入 goods 数据成功 或 失败标识
        var recommendFlag = void 0; // 用于导入 recommend 数据成功 或 失败标识
        var goodsCount = 0; // goods 数据计数
        var recommendCount = 0; // recommend 数据计数

        var tasks_1 = new Promise(function (resolve, reject) {
          // 导入商品数据 到 数据库
          fs.readFile(path.resolve(__dirname, '../resource/goods2.json'), 'utf8', async function (err, data) {
            if (!err) {
              data = JSON.parse(data); // parse() 用于将一个字符串解析成一个 json 对象
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var item = _step.value;

                  var goodsEntity = new GoodsModel(item);
                  try {
                    await goodsEntity.save();
                    goodsCount++;
                    goodsFlag = true;
                    console.log('Goods \u6570\u636E\u6210\u529F\u5BFC\u5165\u7B2C: ' + goodsCount + ' \u6761');
                  } catch (error) {
                    goodsFlag = false;
                    reject(error);
                    console.log('Goods 数据导入失败...');
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              resolve();
            } else {
              reject(err);
            }
          });
        });

        var tasks_2 = new Promise(function (resolve, reject) {
          // 导入推荐数据 到 数据库
          fs.readFile(path.resolve(__dirname, '../resource/goods.json'), 'utf8', async function (err, data) {
            if (!err) {
              data = JSON.parse(data); // parse() 用于将一个字符串解析成一个 json 对象
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var item = _step2.value;

                  var RecommendEntity = new RecommendModel(item);
                  try {
                    await RecommendEntity.save();
                    recommendCount++;
                    recommendFlag = true;
                    console.log('Recommend \u6570\u636E\u6210\u529F\u5BFC\u5165\u7B2C: ' + recommendCount + ' \u6761');
                  } catch (error) {
                    recommendFlag = false;
                    reject(error);
                    console.log('Recommend 数据导入失败...');
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }

              resolve();
            } else {
              reject(err);
            }
          });
        });

        try {
          await Promise.all([tasks_1, tasks_2]);
          if (goodsFlag && recommendFlag) {
            return {
              GoodsMsg: 'Goods \u6570\u636E\u6210\u529F\u5BFC\u5165 ' + goodsCount + ' \u6761',
              RecommendMsg: 'Recommend \u6570\u636E\u6210\u529F\u5BFC\u5165 ' + recommendCount + ' \u6761'
            };
          }
        } catch (error) {
          console.log("错误:\n", error);
          if (!goodsFlag && !recommendFlag) {
            return { GoodsMsg: 'Goods \u6570\u636E\u5BFC\u5165\u5931\u8D25...', RecommendMsg: 'Recommend \u6570\u636E\u5BFC\u5165\u5931\u8D25...' };
          } else {
            if (!goodsFlag) return { msg: 'Goods 数据导入失败...' };
            if (!recommendFlag) return { msg: 'recommend 数据导入失败...' };
          }
        }
      } else {
        return {
          GoodsMsg: '\u6570\u636E\u5E93\u4E2D\u5DF2\u5B58\u5728 Goods \u6570\u636E ' + goodsResult.length + ' \u6761, \u65E0\u9700\u518D\u6B21\u5BFC\u5165',
          RecommendMsg: '\u6570\u636E\u5E93\u4E2D\u5DF2\u5B58\u5728 Recommend \u6570\u636E ' + recommendResult.length + ' \u6761, \u65E0\u9700\u518D\u6B21\u5BFC\u5165'
        };
      }
    }
  }]);

  return InitDataService;
}();

module.exports = new InitDataService();