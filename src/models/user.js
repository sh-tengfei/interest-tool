import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const User = new Schema({
  nickname: String, // 用户昵称
  phone: Number, // 手机号
  sex: Number, // 性别
}, {
    timestamps: true,
    versionKey: false,
    autoIndex: true,
});

module.exports = mongoose.model('User', User);