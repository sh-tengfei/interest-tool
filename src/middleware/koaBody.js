import koaBody from 'koa-body'

export default () => {
  return koaBody({ multipart: true })
}
