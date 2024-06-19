export default async function responseTime(ctx, next) {
  const now = Date.now()
  await next()
  ctx.data.responseTime = Date.now() - now
  ctx.set('x-response-time', ctx.data.responseTime + 'ms')
}
