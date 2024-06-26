import mongoose from 'mongoose';
import CourseModel from '../models/course';
import { appId, wxSecret } from '../config'

export async function newCourse(userId, courseType, courseName) {
  const course = await CourseModel.create({ userId, courseType, courseName })
  return course
}

export async function findById(id) {
  const course = await CourseModel.findById(id).select('+createdAt')
  return course
}

export async function findByUserId(userId) {
  const course = await CourseModel.find({ userId })
  return course
}

export async function getCourseList(userId) {
  const course = await CourseModel.find({ userId }, { courseType: 1, _id: 1 })
  return course
}
