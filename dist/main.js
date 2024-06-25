'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _config = require('./config');

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _middleware = require('./middleware');

var middleware = _interopRequireWildcard(_middleware);

var _router = require('./router');

var router = _interopRequireWildcard(_router);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async function () {
  var app = new _koa2.default();
  await (0, _db2.default)();
  middleware.init(app);
  router.init(app);
  app.env = _config.env;
  app.keys = _config.keys;
  app.listen(_config.port, function () {
    console.log('Server running on port ' + _config.port);
  });
})();