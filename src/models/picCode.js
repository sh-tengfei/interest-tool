import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// 图片验证
const picCodeSchema = new Schema({
  code: {
    required: true,
    dropDups: true,
    type: String,
    index: true,
    unique: true
  }, // 验证码
  time: {
    required: true,
    type: Date,
  },
  uid: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false,
  autoIndex: true,
});

export default mongoose.model('PicCode', picCodeSchema);
