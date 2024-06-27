'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _picCode = require('../service/picCode');

exports.default = {
  interval: '*/5 * * * *', // 每分钟执行一次
  immediate: true, // 是否在启动时立即执行
  cronOptions: {
    timezone: 'Asia/Shanghai' // 设置时区
  },
  task: async function task() {
    var pics = await (0, _picCode.findAllPic)();
    if (!pics.length) return console.log(Date());
    var outTime = new Date();
    outTime.setMinutes(outTime.getMinutes() - 5);
    var query = { createdAt: { $lt: outTime }, isDelete: false };
    await (0, _picCode.deleteMany)(query, { $set: { isDelete: true } });
  }
};