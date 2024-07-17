import Router from'koa-router';
import userAuthed from '../middleware/userAuthed'
import { BASE_URL } from '../config'
import { getCourseList } from '../service/course'

const router = new Router();

/**
 * 用户注册
 */
router.get('/interest-list', userAuthed, async (ctx) => {
  const { id } = ctx.user
  const courseList = await getCourseList(id)
  ctx.success({ courseList }, '')
});

export const path = `${BASE_URL}/home`
export default router
