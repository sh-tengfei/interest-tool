import mongoose from 'mongoose'
import { dbUrl } from '../config'

export default function connectDb() {
  mongoose.connect(dbUrl);
  // 记录数据库连接的次数
  let maxConnectTimes = 0;

  return new Promise((resolve, reject) => {
    // 连接成功操作
    mongoose.connection.once('open', () => {
      console.log('Mongodb 数据库连接成功.');
      resolve();
    });
    // 连接断开操作
    mongoose.connection.on('disconnected', () => {
      console.log('*********** 数据库断开 ***********');
      if (maxConnectTimes < 3) {
        maxConnectTimes++;
        mongoose.connect(dbUrl);
      } else {
        reject(new Error('数据库连接失败'));
        throw new Error('数据库连接失败');
      }
    });
    // 连接失败操作
    mongoose.connection.on('error', error => {
      console.log('*********** 数据库错误 ***********');
      if (maxConnectTimes < 3) {
        maxConnectTimes++;
        mongoose.connect(dbUrl);
      } else {
        reject(error);
        throw new Error('数据库连接失败');
      }
    });
  });
}
