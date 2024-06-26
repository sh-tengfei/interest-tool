import mongoose from 'mongoose'
import { defaultAvatar } from '../config'
const Schema = mongoose.Schema;

const User = new Schema({
  roles: { required: true, type: Number, default: 1 }, // 1家长 2机构
  phone: {
    dropDups: true,
    minlength: 11,
    maxlength: 11,
    type: String,
    index: true,
    unique: true
  }, // 手机号
  password: {
    type: String,
    select: false,
    minlength: 6
  },
  username: { type: String, default: null }, // 用户昵称
  gender: { type: String, default: null }, // 性别
  avatar: { type: String, default: defaultAvatar }, // 头像
  openid: { type: String, unique: true, index: true, dropDups: true },
  unionid: { type: String, unique: true }
}, {
    timestamps: true,
    versionKey: false,
    autoIndex: true,
});

export default mongoose.model('User', User);
