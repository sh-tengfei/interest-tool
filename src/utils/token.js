// @ts-ignore
import { AES, enc } from 'crypto-js'
import { secret } from '../config'

export function encode(token) {
  const tokenStr = [token.uid, token.id, token.time].join(',')
  return AES.encrypt(tokenStr, secret).toString()
}

export function decode(token) {
  try {
    const bytes = AES.decrypt(token.toString(), secret)
    const tokenStr = bytes.toString(enc.Utf8)
    const tokenArr = tokenStr.split(',')
    return {
      uid: tokenArr[0] || 0,
      id: tokenArr[1] || '',
      time: parseInt(tokenArr[2], 10) || Date.now(),
    }
  } catch (error) {
    return {
      uid: -1, // 临时用户
      id: '',
      time: 0,
    }
  }
}
