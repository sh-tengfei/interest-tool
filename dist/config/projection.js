"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// “投影” (projection) | 数据库需要返回的数据
var PROJECTION = exports.PROJECTION = {
  user: {
    _id: 1,
    username: 1,
    phone: 1,
    roles: 1,
    city: 1,
    country: 1,
    gender: 1, // 性别
    language: 1,
    province: 1,
    avatar: 1 // 头像
  }
};