import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  // 部分body支持类型不需要转换，但是对于对象类型需要转换为字符串
  if (isPlainObject(data)) {
    // 是普通对象（不能用isObject，因为所有派生自Object类也会返回true）
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    // 尝试转化为JSON类型，失败原样返回
    try {
      data = JSON.parse(data)
    }catch (e) {
      console.log(e)
    }
  }
  return data
}
