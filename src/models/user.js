import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const User = new Schema({
  userName: String, // 用户昵称
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
  avatar: { type: String, default: 'http://img4.imgtn.bdimg.com/it/u=198369807,133263955&fm=27&gp=0.jpg' }, // 头像
}, {
    timestamps: true,
    versionKey: false,
    autoIndex: true,
});

module.exports = mongoose.model('User', User);
