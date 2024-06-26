'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newCourse = newCourse;
exports.findById = findById;
exports.findByUserId = findByUserId;
exports.getCourseList = getCourseList;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _course = require('../models/course');

var _course2 = _interopRequireDefault(_course);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function newCourse(userId, courseType, courseName) {
  var course = await _course2.default.create({ userId: userId, courseType: courseType, courseName: courseName });
  return course;
}

async function findById(id) {
  var course = await _course2.default.findById(id).select('+createdAt');
  return course;
}

async function findByUserId(userId) {
  var course = await _course2.default.find({ userId: userId });
  return course;
}

async function getCourseList(userId) {
  var course = await _course2.default.find({ userId: userId }, { courseType: 1, _id: 1 });
  return course;
}