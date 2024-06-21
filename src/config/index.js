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

const appIds = {
  development: 'wxc57433b341246d35'
}

const wxSecrets = {
  development: 'f766f651561758b613e56fafb5c87d21'
}

export const dbUrl = dbBaseUrls[NODE_ENV]
export const port = ports[NODE_ENV]
export const env = NODE_ENV
export const secret = secrets[NODE_ENV]
export const keys = keyss[NODE_ENV]
export const appId = appIds[NODE_ENV]
export const wxSecret = wxSecrets[NODE_ENV]

export const errorCode = {
  exists: 11000
}

