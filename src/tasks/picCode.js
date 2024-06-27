import { deleteMany, findAllPic } from '../service/picCode'

export default {
  interval: '*/5 * * * *', // 每分钟执行一次
  immediate: true, // 是否在启动时立即执行
  cronOptions: {
    timezone: 'Asia/Shanghai', // 设置时区
  },
  task: async () => {
    const pics = await findAllPic()
    if (!pics.length) return console.log(Date())
    const outTime = new Date();
    outTime.setMinutes(outTime.getMinutes() - 5);
    const query = { createdAt: { $lt: outTime }, isDelete: false };
    await deleteMany(query, { $set: { isDelete: true } });
  }
}