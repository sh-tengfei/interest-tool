import Router from 'koa-router'
import user from './user'

const router = new Router()
router.use(user)

export const routes = router.routes()