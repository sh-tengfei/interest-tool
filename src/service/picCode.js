import PicCodeModel from '../models/picCode'

export function savePicCode(opt) {
  const newPicCode = new PicCodeModel(opt)
  return newPicCode.save()
}

export async function findPicCode(code) {
  const picCode = await PicCodeModel.findOne({ code })
  await PicCodeModel.deleteOne({ code })
  return picCode
}


export async function removePicCode(code) {
  const picCode = await PicCodeModel.removeOne({ code })
  return picCode
}

