import Router from'koa-router';
import * as mongodb from 'mongodb'
import userAuthed from '../middleware/userAuthed'
import { BASE_URL } from '../config'

const router = new Router();

/**
 * 用户注册
 */
router.get('/interest-list', userAuthed, async (ctx) => {
  ctx.success({ interestList: [] }, '')
});

export const path = `${BASE_URL}/home`
export default router
