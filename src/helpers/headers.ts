import { isPlainObject } from './util'

function normalizeHeaderName(headers:any,normalizedName:string):void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach((name) => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      // 就是说小写content-type和Content-type这种
      // 我们决定使用你传入的normalizedName，把值传递之后删除原先的字段
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

// 还需要额外传入data来判断需不需要处理headers
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    // header名称需要规范化，因为大小写不敏感所以可能会出现多种形式的content-type字符
    // 通过上面规范化处理所以可以减少判断数量
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}
