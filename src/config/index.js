const NODE_ENV =  process.env.NODE_ENV
const dbBaseUrls = {
  development: 'mongodb://127.0.0.1/interest-tool'
}

//
const ports = {
  development: 4000
}

// 撒盐：加密的时候混淆 | 密钥
const secrets = {
  development: 'interest-tool'
}

const keyss = {
  development: [secrets[NODE_ENV]]
}

export const dbUrl = dbBaseUrls[NODE_ENV]
export const port = ports[NODE_ENV]
export const env = NODE_ENV
export const secret = secrets[NODE_ENV]
export const keys = keyss[NODE_ENV]

export const errorCode = {
  exists: 11000
}

