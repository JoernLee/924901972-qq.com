import { AxiosTransformer } from '../types'

export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  // 如果不是数组，转为数组，这样下面的逻辑就可以统一了，常用技巧
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
