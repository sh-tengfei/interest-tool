const NODE_ENV =  process.env.NODE_ENV
const dbBaseUrls = {
  development: 'mongodb://127.0.0.1/interest-tool'
}
const ports = {
  development: 4000
}

export const dbUrl = dbBaseUrls[NODE_ENV]
export const port = ports[NODE_ENV]
export const env = NODE_ENV