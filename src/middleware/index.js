import logger from './logger'
// import json from './json'
// import responseTime from './responseTime'
// import koaBody from './koaBody'
// import cookie from './cookie'
// import paged from './paged'
import axios from './axios'

export function init(app) {
  app.use(logger)
//   app.use(responseTime)
//   app.use(json)
//   app.use(koaBody())
//   app.use(cookie)
//   app.use(paged)
  app.use(axios)
}