import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const User = new Schema({
  username: String, // 用户昵称
  roles: { required: true, type: Number, default: 1 }, // 1家长 2机构
  phone: {
    required: true,
    dropDups: true,
    minlength: 11,
    maxlength: 11,
    type: String,
    index: true,
    unique: true
  }, // 手机号
  password: { type: String, required: true, select: false, minlength: 6 },
  gender: { type: String, default: '男', enum: [ '男', '女', '保密' ] }, // 性别
  avatar: { type: String, default: 'http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280' }, // 头像
}, {
    timestamps: true,
    versionKey: false,
    autoIndex: true,
});

export default mongoose.model('User', User);
