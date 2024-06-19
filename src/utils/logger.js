import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import os from 'os'
import fs from 'fs'
import { env } from '../config'

let cardinal = require('cardinal')
let hostname = os.hostname()

try {
  hostname = fs.readFileSync('/etc/hostname', 'utf-8')
} catch (error) {}

dayjs.extend(utc)

export default (data) => {
  data.date = dayjs.utc().format()
  data.env = env
  data.server = hostname
  const highlightLog = cardinal.highlight(JSON.stringify(data, null, '  '))
  console.log('\n' + highlightLog)
}
