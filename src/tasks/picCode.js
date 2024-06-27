import { deleteMany, findAllPic } from '../service/picCode'

export default {
  interval: '0 * * * *', // 每小时执行一次
  immediate: true, // 是否在启动时立即执行
  cronOptions: {
    timezone: 'Asia/Shanghai', // 设置时区
  },
  task: async () => {
    const pics = await findAllPic()
    if (!pics.length) return
    const outTime = new Date();
    outTime.setMinutes(outTime.getMinutes() - 60);
    const query = { createdAt: { $lt: outTime }, isDelete: false };
    await deleteMany(query, { $set: { isDelete: true } });
  }
}