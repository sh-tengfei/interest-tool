import { success, error } from '../utils/response'

export default async function json(ctx, next) {
  ctx.success = (data, msg) => {
    const result = success(data, msg)
    ctx.body = result
  }
  ctx.error = (data, status) => {
    if (status) {
      ctx.throw(status, JSON.stringify(data))
      return
    }
    const result = error(data)
    ctx.body = result
  }
  await next()
}
