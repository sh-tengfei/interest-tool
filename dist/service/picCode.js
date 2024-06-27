'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savePicCode = savePicCode;
exports.findPicCode = findPicCode;
exports.findAllPic = findAllPic;
exports.delPicCode = delPicCode;
exports.deleteMany = deleteMany;

var _picCode = require('../models/picCode');

var _picCode2 = _interopRequireDefault(_picCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function savePicCode(opt) {
  var newPicCode = new _picCode2.default(opt);
  return newPicCode.save();
}

async function findPicCode(code) {
  var picCode = await _picCode2.default.findOne({ code: code });
  return picCode;
}

async function findAllPic() {
  var allPics = await _picCode2.default.find();
  return allPics;
}

async function delPicCode(code) {
  return await _picCode2.default.updateOne({ code: code });
}

async function deleteMany(query, update) {
  return await _picCode2.default.deleteMany(query, update);
}