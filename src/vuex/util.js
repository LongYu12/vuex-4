/**
 * 描述：循环对象属性
 * @param {*} obj  循环的对象
 * @param {*} callback  回调函数
 */
export function forEachObjValue(obj, callback) {
  if (typeof obj != 'object') return

  Object.keys(obj).forEach(key => callback(obj[key], key))
}

/**
 * 描述： 是不是 Promise
 * @param {*} val 
 */
export function isPromise(val) {
  return val && typeof val.then == 'function'
}