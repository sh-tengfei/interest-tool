import axios from 'axios'

export default async (ctx, next) => {
  ctx.axios = axios
  await next()
}
