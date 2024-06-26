'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NODE_ENV = process.env.NODE_ENV;
var dbBaseUrls = {
  development: 'mongodb://127.0.0.1/interest-tool',
  production: 'mongodb://127.0.0.1/interest-tool'

  //
};var ports = {
  development: 4000,
  production: 3000

  // 撒盐：加密的时候混淆 | 密钥
};var secrets = {
  development: 'interest-tool',
  production: 'interest-tool'
};

var keyss = {
  development: [secrets[NODE_ENV]],
  production: [secrets[NODE_ENV]]
};

var appIds = {
  development: 'wxc57433b341246d35',
  production: 'wxc57433b341246d35'
};

var wxSecrets = {
  development: 'f766f651561758b613e56fafb5c87d21',
  production: 'f766f651561758b613e56fafb5c87d21'
};

var BASE_URLS = {
  development: '/api',
  production: ''
};

var dbUrl = exports.dbUrl = dbBaseUrls[NODE_ENV];
var port = exports.port = ports[NODE_ENV];
var env = exports.env = NODE_ENV;
var secret = exports.secret = secrets[NODE_ENV];
var keys = exports.keys = keyss[NODE_ENV];
var appId = exports.appId = appIds[NODE_ENV];
var wxSecret = exports.wxSecret = wxSecrets[NODE_ENV];
var BASE_URL = exports.BASE_URL = BASE_URLS[NODE_ENV];

var errorCode = exports.errorCode = {
  exists: 11000
};