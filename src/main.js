import Koa from 'koa'
import { port, env } from './config'
import connectDb from './db'
import * as middleware from './middleware'
import router from './router'
(async () => {
  await connectDb()
  const app = new Koa()
  middleware.init(app)
  if (app.env !== env) {
    app.env = env
  }
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
})()
