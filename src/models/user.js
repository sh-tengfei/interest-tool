import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const User = new Schema({
  roles: { required: true, type: Number, default: 1 }, // 1家长 2机构
  phone: {
    dropDups: true,
    minlength: 11,
    maxlength: 11,
    type: String,
    index: true
  }, // 手机号
  password: {
    type: String,
    select: false,
    minlength: 6
  },
  username: { type: String }, // 用户昵称
  gender: { type: String }, // 性别
  avatar: { type: String, default: 'http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280' }, // 头像
  openid: { type: String, index: true },
  unionid: { type: String }
}, {
    timestamps: true,
    versionKey: false,
    autoIndex: true,
});

export default mongoose.model('User', User);
