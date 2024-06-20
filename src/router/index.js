import Router from 'koa-router'
import user, { path } from './user'

const router = new Router()
router.use(path, user.routes())

export function init(app) {
  app.use(router.routes())
}
