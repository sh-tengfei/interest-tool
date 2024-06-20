import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose'
import { decode, encode } from '../utils/token'
import * as userSv from '../service/user'


export default async(ctx, next) => {
  let cToken = ctx.cookies.get('token') || ctx.query.token || ctx.headers.token || ''
  // token 还能是个list
  if (Array.isArray(cToken)) {
    cToken = cToken[0]
  }

  const token = decode(cToken)
  // 未登录的用户分配一个临时id
  // if (token.id === '') {
  //   token.id = `${Date.now().toString(36)}-${uuidv4()}`
  // }
  ctx.token = token

  ctx.userAuthed = async () => {
    if (!mongoose.Types.ObjectId.isValid(token.id)) {
      return false
    }
    const user = await userSv.findById(token.id)
    if (!user) {
      return false
    }
    ctx.token = {
      id: user._id.toString(),
      uid: user.roles,
      time: Date.now(),
    }
    ctx.user = user
    return true
  }

  await next()

  ctx.cookies.set('token', encode(ctx.token), {
    maxAge: 1000 * 60 * 60 * 12,
    signed: true,
    path: '/',
    // secure: true,
  })
}
