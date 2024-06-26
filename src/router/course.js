import Router from'koa-router';
import * as mongodb from 'mongodb'
import userAuthed from '../middleware/userAuthed'
import { BASE_URL } from '../config'
import { newCourse } from '../service/course'

const router = new Router();

/**
 * 创建课程
 */
router.post('/create', userAuthed, async (ctx) => {
  const { id } = ctx.user
  const { courseType, courseName } = ctx.request.body || {}
  if (!courseType || !courseName) {
    return ctx.error({
      message: '请输入正确信息',
    })
  }
  try {
    const course = await newCourse(id, courseType, courseName)
    ctx.success(course, '创建成功')
  } catch (error) {
    console.log(error)
    return ctx.error({
      message: '系统错误',
    })
  }
});

export const path = `${BASE_URL}/course`
export default router
