import Router from'koa-router';
import { BASE_URL } from '../config'
import { saveUser } from '../service/mysql'

const router = new Router();

/**
 * mysql
 */
router.get('/newUser', async (ctx) => {
  const user = await saveUser({ username: 'janedoe', birthday: new Date(1980, 6, 20) })
  console.log(user)
  ctx.success(user)
});

export const path = `${BASE_URL}/mysql`
export default router
