'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.path = undefined;

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _mongodb = require('mongodb');

var mongodb = _interopRequireWildcard(_mongodb);

var _userAuthed = require('../middleware/userAuthed');

var _userAuthed2 = _interopRequireDefault(_userAuthed);

var _config = require('../config');

var _course = require('../service/course');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter2.default();

/**
 * 创建课程
 */
router.post('/create', _userAuthed2.default, async function (ctx) {
  var id = ctx.user.id;

  var _ref = ctx.request.body || {},
      courseType = _ref.courseType,
      courseName = _ref.courseName;

  if (!courseType || !courseName) {
    return ctx.error({
      message: '请输入正确信息'
    });
  }
  try {
    var course = await (0, _course.newCourse)(id, courseType, courseName);
    ctx.success(course, '创建成功');
  } catch (error) {
    console.log(error);
    return ctx.error({
      message: '系统错误'
    });
  }
});

var path = exports.path = _config.BASE_URL + '/course';
exports.default = router;