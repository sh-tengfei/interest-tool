import Router from 'koa-router'
import user from './user'

const router = new Router()
router.use(user.routes())

export function init(app) {
  app.use(router.routes())
}
