import cron from 'node-cron';
import picCode from "./picCode";

cron.schedule(picCode.interval, picCode.task, picCode.cronOptions)
if (picCode.immediate) picCode.task()

export default cron