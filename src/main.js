import Koa from 'koa'
import { port, env, keys } from './config'
import connectDb from './db'
import * as middleware from './middleware'
import * as router from './router'
import './tasks'
import './db/mysql'
(async () => {
  const app = new Koa()
  await connectDb()
  middleware.init(app)
  router.init(app)
  app.env = env
  app.keys = keys
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
})()
