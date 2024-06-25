import Router from 'koa-router'
import user, { path as userPath} from './user'
import home, { path as homepath } from './home'

const router = new Router()
router.use(userPath, user.routes())
router.use(homepath, home.routes())

export function init(app) {
  app.use(router.routes())
}
