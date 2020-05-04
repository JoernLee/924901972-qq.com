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

// 拷贝函数，其中使用了交叉类型与泛型的知识
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    // 明确类型，避免报错
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 我们可以自己实现一个简化版深拷贝
// lodash里面深拷贝太复杂,暂不需要
// 通常这种工具函数可以利用单元测试，多尝试Case看返回是否正确
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  // 支持多个参数，所以多一层循环就行了
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        // 如果值还是对象，需要递归处理,否则直接赋值就行
        if (isPlainObject(val)) {
          // 这里还需要处理该key是否已经存在的情况
          // 因为objs是两个多个输入
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
