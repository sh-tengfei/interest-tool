import UserModel from '../mysql-models/user'

export async function saveUser(user) {
  const newUser = await UserModel.create(user);
  console.log('Data saved successfully:', newUser.toJSON());
  return newUser
}
