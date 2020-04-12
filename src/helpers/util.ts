const toString = Object.prototype.toString

// 这里返回使用了类型保护，谓词is,这样调用这个方法的返回结果可以使用Date的方法属性
export function isDate(val: any): val is Date {
  // 这个是常见的判断原型的方法，可以把前部分缓存起来
  // return Object.prototype.toString.call(val) === '[object Date]'
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  // 光通过typeof判断是不够的，因为这样null情况下也是true
  return val !== null && typeof val === 'object'
}

// 判断是否是普通对象
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
