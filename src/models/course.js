import mongoose from 'mongoose'
import { defaultAvatar } from '../config'
const Schema = mongoose.Schema;

const courseTypes = {
  skidding: 1, // 轮滑
}

const Course = new Schema({
  userId: { required: true, type: mongoose.Types.ObjectId }, // 1家长 2机构
  courseType: { type: Number, required: true },
  courseName: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false,
    autoIndex: true,
});

export default mongoose.model('Course', Course);
