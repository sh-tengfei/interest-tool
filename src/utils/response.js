export function success(data, msg) {
  return {
    code: 0,
    message: msg || '',
    data,
  }
}

export function error(data) {
  return {
    code: 201,
    ...data,
  }
}
