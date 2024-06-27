import PicCodeModel from '../models/picCode'

export function savePicCode(opt) {
  const newPicCode = new PicCodeModel(opt)
  return newPicCode.save()
}

export async function findPicCode(code) {
  const picCode = await PicCodeModel.findOne({ code })
  return picCode
}

export async function findAllPic() {
  const allPics = await PicCodeModel.find()
  return allPics
}

export async function delPicCode(code) {
  return await PicCodeModel.updateOne({ code })
}

export async function deleteMany(query, update) {
  return await PicCodeModel.deleteMany(query, update)
}