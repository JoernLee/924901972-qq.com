import { RejectedFn, ResolvedFn } from '../types'

// 定义拦截器接口，有两个处理函数
// 因为result参数不同，所以是泛型类
interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

// 注意这个类和之前定义的接口不同，接口是给外部用的，未来写Demo添加拦截器只能使用use和eject
// 这个类是所有内部使用，包含只在内部实现的方法
export default class InterceptorManager<T> {
  // 存储拦截器们
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    // 根据传参构建一个拦截器并push到数组
    this.interceptors.push({
      resolved,
      rejected
    })
    // 返回是ID--以长度作为ID
    return this.interceptors.length - 1
  }

  // 提供此方法来给内部遍历拦截器进行处理的
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      // 这里设置为null是为了不改变数组长度，不然以长度作为ID的标志就乱了
      // 所以不能用delete操作符
      this.interceptors[id] = null
    }
  }
}
