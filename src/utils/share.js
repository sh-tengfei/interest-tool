import crypto from 'crypto'

export function md5(str) {
  // 以md5的格式创建一个哈希值
  let hash = crypto.createHash('md5')
  return hash.update(Buffer.from(str)).digest('hex')
}
