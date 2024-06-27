import PicCodeModel from '../models/picCode'

export function savePicCode(opt) {
  const newPicCode = new PicCodeModel(opt)
  return newPicCode.save()
}

export async function findPicCode(code) {
  const picCode = await PicCodeModel.findOne({ code, isDelete: false })
  return picCode
}

export async function findAllPic() {
  const allPics = await PicCodeModel.find({ isDelete: false })
  return allPics
}

export async function delPicCode(code) {
  return await PicCodeModel.updateOne({ code, isDelete: true })
}

export async function deleteMany(query, update) {
  return await PicCodeModel.updateMany(query, update)
}