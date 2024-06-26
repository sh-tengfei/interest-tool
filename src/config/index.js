const NODE_ENV = process.env.NODE_ENV

const dbBaseUrls = {
  development: 'mongodb://127.0.0.1/interest-tool',
  production: 'mongodb://127.0.0.1/interest-tool',
}

//
const ports = {
  development: 4000,
  production: 3000,
}

// 撒盐：加密的时候混淆 | 密钥
const secrets = {
  development: 'interest-tool',
  production: 'interest-tool',
}

const keyss = {
  development: [secrets[NODE_ENV]],
  production: [secrets[NODE_ENV]],
}

const appIds = {
  development: 'wxc57433b341246d35',
  production: 'wxc57433b341246d35',
}

const wxSecrets = {
  development: 'f766f651561758b613e56fafb5c87d21',
  production: 'f766f651561758b613e56fafb5c87d21',
}

const defaultAvatars = {
  development: 'http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
  production: 'http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
}

export const dbUrl = dbBaseUrls[NODE_ENV]
export const port = ports[NODE_ENV]
export const env = NODE_ENV
export const secret = secrets[NODE_ENV]
export const keys = keyss[NODE_ENV]
export const appId = appIds[NODE_ENV]
export const wxSecret = wxSecrets[NODE_ENV]
export const defaultAvatar = defaultAvatars[NODE_ENV]

export const errorCode = {
  exists: 11000
}

