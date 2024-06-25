'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savePicCode = savePicCode;
exports.findPicCode = findPicCode;
exports.removePicCode = removePicCode;

var _picCode = require('../models/picCode');

var _picCode2 = _interopRequireDefault(_picCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function savePicCode(opt) {
  var newPicCode = new _picCode2.default(opt);
  return newPicCode.save();
}

async function findPicCode(code) {
  var picCode = await _picCode2.default.findOne({ code: code });
  await _picCode2.default.deleteOne({ code: code });
  return picCode;
}

async function removePicCode(code) {
  var picCode = await _picCode2.default.removeOne({ code: code });
  return picCode;
}