"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// “投影” (projection) | 数据库需要返回的数据
var PROJECTION = exports.PROJECTION = {
    user: { _id: 1, userName: 1, gender: 1, avatar: 1, phone: 1, roles: 1 }
};