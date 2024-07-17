import Router from 'koa-router'
import user, { path as userPath} from './user'
import home, { path as homepath } from './home'
import course, { path as coursepath } from './course'
import mysql, { path as mysqlPath } from './mysql'

const router = new Router()
router.use(userPath, user.routes())
router.use(homepath, home.routes())
router.use(coursepath, course.routes())
router.use(mysqlPath, mysql.routes())

export function init(app) {
  app.use(router.routes())
}
