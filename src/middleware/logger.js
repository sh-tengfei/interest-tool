import logger from '../utils/logger'

export default async (ctx, next) => {
  ctx.data = {
    requestId: '',
    responseTime: 0,
    error: null,
  }
  await next()
  const data = {
    method: ctx.method,
    type: 'request',
    ip: ctx.ip,
    host: ctx.host,
    url: ctx.path,
    query: ctx.querystring,
    status: ctx.status,
    ua: ctx.headers['user-agent'],
    cookie: ctx.headers.cookie,
    // responseTime: ctx.data.responseTime,
    // error: ctx.data.error && {
    //   name: ctx.data.error.name,
    //   message: ctx.data.error.message,
    //   stack: ctx.data.error.stack,
    // },
  }
  logger(data)
}
