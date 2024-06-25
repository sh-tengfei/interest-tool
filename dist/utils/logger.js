'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dayjs = require('dayjs');

var _dayjs2 = _interopRequireDefault(_dayjs);

var _utc = require('dayjs/plugin/utc');

var _utc2 = _interopRequireDefault(_utc);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cardinal = require('cardinal');
var hostname = _os2.default.hostname();

try {
  hostname = _fs2.default.readFileSync('/etc/hostname', 'utf-8');
} catch (error) {}

_dayjs2.default.extend(_utc2.default);

exports.default = function (data) {
  data.date = _dayjs2.default.utc().format();
  data.env = _config.env;
  data.server = hostname;
  var highlightLog = cardinal.highlight(JSON.stringify(data, null, '  '));
  console.log('\n' + highlightLog);
};