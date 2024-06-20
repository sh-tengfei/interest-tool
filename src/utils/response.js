export function success(data) {
  return {
    code: 0,
    message: '',
    data,
  }
}

export function error(data) {
  return {
    code: 201,
    ...data,
  }
}
